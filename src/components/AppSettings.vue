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
              <input id="authority" class="form-control" type="text" name="authority">
            </div>
          </div>
          <div class="form-group">
            <label for="client_id" class="col-md-2 control-label">
              ClientID
            </label>
            <div class="col-md-10">
              <input id="client_id" class="form-control" type="text" name="client_id" value="">
            </div>
          </div>
          <div class="form-group">
            <label for="client_secret" class="col-md-2 control-label">
              Client Seceret
            </label>
            <div class="col-md-10">
                <input id="client_secret" class="form-control" type="text" name="client_secret" placeholder="Fill me in if you have a secret">
            </div>
          </div>
          <div class="form-group">
            <label for="response_type" class="col-md-2 control-label">
              Response Type
            </label>
            <div class="col-md-10">
              <select id="response_type" class="form-control" name="response_type">
                <option value="code">Code</option>
              </select>
            </div>
          </div>
          <div class="form-group">
              <label for="scope" class="col-md-2 control-label">
                Scope
              </label>
              <div class="col-md-10">
                <input id="scope" class="form-control" type="text" name="scope" value="">
              </div>
          </div>
          <div class="form-group">
              <label for="redirect_uri" class="col-md-2 control-label">
                Redirect Uri
              </label>
              <div class="col-md-10">
                  <input id="redirect_uri"  class="form-control" type="text" name="redirect_uri" value="">
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

export default {
  name: 'app-settings',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">

</style>
