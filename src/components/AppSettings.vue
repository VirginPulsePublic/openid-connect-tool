<template>
  <div class="app-settings">
    <div class="panel panel-default">
      <div class="panel-heading">
        App settings
      </div>
      <div class="panel-body">
        <form class="form-horizonal">
          <div class="form-group">
            <label for="authority" class="col-sm-2 control-label">
              Issuer URL
            </label>
            <div class="col-sm-10">
              <input id="authority" class="form-control" type="text" name="authority" v-model="authority">
            </div>
          </div>
          <div class="form-group">
            <label for="grant_type" class="col-md-2 control-label">
              Grant Type
            </label>
            <div class="col-md-10">
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
              <div class="col-md-10">
                <input id="username" class="form-control" type="text" name="username" placeholder="Username you want to login with" v-model="username">
              </div>
            </div>
            <div class="form-group">
              <label for="password" class="col-md-2 control-label">
                Password
              </label>
              <div class="col-md-10">
                <input id="password" class="form-control" type="password" name="password" v-model="password">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="client_id" class="col-md-2 control-label">
              Client ID
            </label>
            <div class="col-md-10">
              <input id="client_id" class="form-control" type="text" name="client_id" v-model="client_id">
            </div>
          </div>
          <div class="form-group">
            <label for="client_secret" class="col-md-2 control-label">
              Client Secret
            </label>
            <div class="col-md-10">
                <input id="client_secret" class="form-control" type="text" name="client_secret" placeholder="Fill me in if you have a secret" v-model="client_secret">
            </div>
          </div>
          <div class="form-group">
            <label for="scope" class="col-md-2 control-label">
              Scope
            </label>
            <div class="col-md-10">
              <input id="scope" class="form-control" type="text" name="scope" v-model="scope">
            </div>
          </div>
          <div class="form-group">
            <label for="redirect_uri" class="col-md-2 control-label">
              Redirect Uri
            </label>
            <div class="col-md-10">
                <input id="redirect_uri"  class="form-control" type="text" name="redirect_uri" v-model="redirect_uri">
            </div>
          </div>
          <div class="form-group">
            <div class="col-md-offset-2 col-md-12">
              <button type="button" class="btn btn-primary">
                Save
              </button>
              <button id="test-issuer" type="button" class="btn btn-warning">
                <span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>
                Test Issuer URL
              </button>
              <button type="button" class="btn btn-error">
                Defaults
              </button>
              </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import Cookie from 'js-cookie'
import merge from 'lodash/merge'

let defaultSettings = {
  authority: 'http://locahost:8080/auth/realms/test',
  grant_type: 'code',
  client_id: 'partner-public',
  scope: 'partner offline_access',
  redirect_uri: window.location.protocol + '//' + window.location.host
}

export default {
  name: 'app-settings',
  data () {
    let settings = merge({
      authority: '',
      grant_type: 'code',
      username: '',
      password: '',
      client_id: '',
      client_secret: '',
      scope: '',
      redirect_uri: ''
    }, defaultSettings)
    return settings
  }
}
</script>

<style lang="scss">

</style>
