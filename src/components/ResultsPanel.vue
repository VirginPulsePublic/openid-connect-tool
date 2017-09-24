<template>
  <div class="results-panel">
    <div class="panel panel-default">
      <div class="panel-heading">
          Authentication
      </div>
      <div class="panel-body">
        <div class="btn-group">
            <button id="button-login" type="button" class="btn btn-primary">
                Login
            </button>
            <button id="button-token" type="button" class="btn btn-primary">
                Get Tokens
            </button>
            <button id="button-profile" type="button" class="btn btn-primary">
                Get Profile
            </button>
            <button id="button-account" type="button" class="btn btn-primary">
                Show Account
            </button>
            <button id="button-logout" type="button" class="btn btn-default">
                Logout
            </button>
        </div>
        <br> <br>
        <div class="btn-group">
          <button id="button-go" type="button" class="btn btn-primary btn-lg" onclick="executeRequest()">
            Go!
          </button>
        </div>
        <br> <br>
        <textarea id="request" class="form-control" rows="7" value="" placeholder="This'll be populated with what the request would look like"></textarea>
        <br>
        <textarea id="response" class="form-control" rows="5" placeholder="This is what the server's response will look like"></textarea>
        <br> <br>
        <textarea id="decoded-token" class="form-control" rows="20" placeholder="When you acquire your tokens, this will populate with the decoded access token."></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'results-panel'
}
</script>

<style lang="scss">

</style>
