<template>
  <div class="app v-cloak" id="app">
    <div class="panel panel-default">
      <div class="panel-heading">
        App settings
      </div>
      <div class="panel-body">
        <form class="form-horizontal">
          <div class="form-group">
            <label for="authority" class="col-md-2 control-label">
              Issuer URL
            </label>
            <div v-bind:class="{ 'has-warning': mismatchingProtocols }" class="col-md-5">
              <input id="authority" class="form-control" type="url" name="authority" v-model="authority" v-on:change="testConnection" v-on:keydown="testConnection">
              <div v-show="mismatchingProtocols" class="alert alert-warning" role="alert">Mismatching protocols detected. Browser might block connection test.</div>
              <div v-show="badUrl" class="alert alert-error" role="alert">The URL you provided is malformed.</div>
            </div>
          </div>
          <div class="form-group">
            <label for="grant_type" class="col-md-2 control-label">
              Grant Type
            </label>
            <div class="col-md-5">
              <select id="grant_type" class="form-control" name="grant_type" v-model="grant_type">
                <option value="code">Authorization Code Grant</option>
                <option value="password">Resource Owner Password Credentials Grant</option>
                <option value="client_credentials">Client Credentials Grant</option>
              </select>
            </div>
          </div>
          <div v-show="grant_type === 'password'">
            <div class="form-group">
              <label for="username" class="col-md-2 control-label">
                Username
              </label>
              <div class="col-md-5">
                <input id="username" class="form-control" type="text" name="username" placeholder="Username you want to login with" v-model="username">
              </div>
            </div>
            <div class="form-group">
              <label for="password" class="col-md-2 control-label">
                Password
              </label>
              <div class="col-md-5">
                <input id="password" class="form-control" type="password" name="password" v-model="password">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="client_id" class="col-md-2 control-label">
              Client ID
            </label>
            <div class="col-md-5">
              <input id="client_id" class="form-control" type="text" name="client_id" v-model="client_id">
            </div>
          </div>
          <div class="form-group">
            <label for="client_secret" class="col-md-2 control-label">
              Client Secret
            </label>
            <div class="col-md-5">
                <input id="client_secret" class="form-control" type="text" name="client_secret" placeholder="Fill me in if you have a secret" v-model="client_secret">
            </div>
          </div>
          <div class="form-group">
            <label for="scope" class="col-md-2 control-label">
              Scope
            </label>
            <div class="col-md-5">
              <input id="scope" class="form-control" type="text" name="scope" v-model="scope">
            </div>
          </div>
          <div class="form-group">
            <label for="redirect_uri" class="col-md-2 control-label">
              Redirect Uri
            </label>
            <div class="col-md-5">
                <input id="redirect_uri"  class="form-control" type="text" name="redirect_uri" v-model="redirect_uri">
            </div>
          </div>
          <div class="form-group">
            <div class="col-md-offset-2 col-md-12">
              <button type="button" class="btn btn-primary" v-on:click="saveSettings">
                Save
              </button>
              <button id="test-issuer" type="button" class="btn" v-bind:class="{ 'btn-warning': connection === 'untested', 'btn-success': connection === 'good', 'btn-danger': connection === 'bad' }">
                <span class="glyphicon" v-bind:class="{ 'glyphicon-thumbs-down': connection === 'untested' || connection === 'bad', 'glyphicon-thumbs-up': connection === 'good' }" aria-hidden="true"></span>
                Test Issuer URL
              </button>
              <button type="button" class="btn btn-error" v-on:click="restoreDefaults">
                Defaults
              </button>
              </div>
          </div>
        </form>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        Authentication
      </div>
      <div class="panel-body">
        <div class="btn-group">
            <button id="button-login" type="button" class="btn btn-primary" v-on:click="loginButtonClick">
                Login
            </button>
            <button id="button-token" type="button" class="btn btn-primary" v-bind:disabled="authorizationCode.length === 0">
                Get Tokens
            </button>
            <button id="button-profile" type="button" class="btn btn-primary" v-bind:disabled="accessToken.length === 0">
                Get Profile
            </button>
            <button id="button-account" type="button" class="btn btn-primary" v-bind:disabled="accessToken.length === 0">
                Show Account
            </button>
            <button id="button-logout" type="button" class="btn btn-default" v-bind:disabled="accessToken.length === 0">
                Logout
            </button>
        </div>
        <br> <br>
        <div class="btn-group">
          <button id="button-go" type="button" class="btn btn-primary btn-lg" v-bind:disabled="gotoUrl.length === 0" v-on:click="goButtonClick">
            Go!
          </button>
        </div>
        <br> <br>
        <textarea id="request" class="form-control" rows="7" value="" v-model="requestText" placeholder="This'll be populated with what the request would look like"></textarea>
        <br>
        <textarea id="response" class="form-control" rows="5" placeholder="This is what the server's response will look like"></textarea>
        <br> <br>
        <textarea id="decoded-token" class="form-control" rows="20" placeholder="When you acquire your tokens, this will populate with the decoded access token."></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import merge from 'lodash/merge'
import debounce from 'lodash/debounce'
import axios from 'axios'
import queryString from 'query-string'

let defaultSettings = {
  authority: 'http://locahost:8080/auth/realms/test',
  grant_type: 'code',
  username: '',
  password: '',
  client_id: 'partner-public',
  client_secret: '',
  scope: 'partner offline_access',
  redirect_uri: window.location.protocol + '//' + window.location.host
}

export default {
  name: 'app',
  mounted () {
    this.testConnection()
  },
  beforeMount () {
    const url = new URL(window.location.href)
    if (url.searchParams.has('code')) {
      const code = url.searchParams.get('code')
      if (code.length >= 0) {
        this.authorizationCode = code
        this.requestText =
`code: ${this.authorizationCode}

Oh! Looks like the user logged in and the issuer
redirected to this page with a query parameter 'code'.

Click on the "Get Tokens" button. This will prepare
a request that will use the authentication code to fetch
an access token.`
      }
    }
  },
  data () {
    return merge({
      authority: '',
      grant_type: 'code',
      username: '',
      password: '',
      client_id: '',
      client_secret: '',
      scope: '',
      redirect_uri: '',
      connection: 'untested',
      mismatchingProtocols: false,
      badUrl: false,
      clickedButton: 'none',
      requestText: '',
      authorizationCode: '',
      gotoUrl: '',
      accessToken: ''
    }, defaultSettings, JSON.parse(localStorage.getItem('settings')))
  },
  computed: {
    protocolUrl () {
      return this.authority + '/protocol/openid-connect'
    },
    tokenEndpoint () {
      return this.protocolUrl + '/token'
    },
    authUrl () {
      return this.protocolUrl + '/auth'
    },
    userInfoUrl () {
      return this.protocolUrl + '/userinfo'
    }
  },
  methods: {
    saveSettings () {
      localStorage.setItem('settings', JSON.stringify({
        authority: this.authority,
        grant_type: this.grant_type,
        username: this.username,
        password: this.password,
        client_id: this.client_id,
        client_secret: this.client_secret,
        scope: this.scope,
        redirect_uri: this.redirect_uri
      }))
    },
    restoreDefaults () {
      this.authority = defaultSettings.authority
      this.grant_type = defaultSettings.grant_type
      this.username = defaultSettings.username
      this.password = defaultSettings.password
      this.client_id = defaultSettings.client_id
      this.client_secret = defaultSettings.client_secret
      this.scope = defaultSettings.scope
      this.redirect_uri = defaultSettings.redirect_uri
      this.saveSettings()
    },
    verifyAuthorityUrl () {
      try {
        const url = new URL(this.authority)
        this.badUrl = false
        return url
      } catch (e) {
        this.badUrl = true
        return
      }
    },
    testConnection: debounce(function () {
      const url = this.verifyAuthorityUrl()
      if (!url) {
        return
      }

      const protocol = url.protocol

      if (window.location.protocol !== protocol) {
        this.mismatchingProtocols = true
      } else {
        this.mismatchingProtocols = false
      }

      axios
      .get(this.authority)
      .then(() => {
        this.connection = 'good'
      }).catch(() => {
        this.connection = 'bad'
      })
    }, 1000),
    loginButtonClick () {
      switch (this.grant_type) {
        case 'code':
          const url = new URL(this.authUrl)
          url.search = queryString.stringify({
            client_id: this.client_id,
            redirect_uri: this.redirect_uri,
            scope: this.scope,
            response_type: this.grant_type
          })
          this.clickedButton = 'login'
          this.requestText =
      `Request Method: GET
Request URL (Line breaks added for readability):
${url.toString().replace(/&/g, '&\n').replace(/\?/g, '?\n')}`
          this.gotoUrl = url.toString()
          break
        case 'password':
          break
        case 'client_credentials':
          break
      }
    },
    goButtonClick () {
      switch (this.grant_type) {
        case 'code':
          window.location.href = this.gotoUrl
          break
        case 'password':
          break
        case 'client_credentials':
          break
      }
    }
  }
}
</script>

<style lang="scss">

</style>
