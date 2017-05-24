var defaultSettings = {
    authority: 'http://locahost:8080/auth/realms/test',
    client_id: 'partner-public',
    client_secret: '',
    response_type: 'code',
    scope: 'partner offline_access',
    redirect_uri: window.location.protocol + '//' + window.location.host,
    token : false
};

var settings,
    protocolUrl,
    tokenUrl,
    authUrl,
    userInfoUrl,
    logoutUrl,
    loginResponse,
    action,
    code;

init();

function init() {
    var params = new URLSearchParams(window.location.search);
    var queryParamCode = params.get('code');
    //remove code from URL
    var refreshLocation = window.location.href.split("?")[0];
    if (queryParamCode) {
        localStorage.setItem('code', queryParamCode);
    }

    var cookieCode = localStorage.getItem('code');
    if (cookieCode) {
        code = cookieCode;
        $('#request').val(
`Oh!

code: ${code}

Looks like the user logged in and the issuer redirected to this page with a query parameter 'code'.

Now you have an authorization code. Click on the "Get Tokens" button. This will prepare a request that will use the authentication code to fetch an access token.`);
    }

    var error = params.get('error');
    if (error) {
        var errorDescription = params.get('error_description');
        $('#request').val(
            `Oops!

error: ${error}
error_description: ${errorDescription}

Looks like the request was denied by the issuer and redirected to this page with a query parameter 'error' and 'error_description'.

Please check your settings and try again.`);
    }

    getSettingsInLocalStorage();
    loadSettingsIntoUI();
    pullSettingsFromUI();
    testIssuerURL();
    buttonStates();

    loginResponse = {};
}

function buttonStates() {
  if (code) {
    disableToken(false);
  } else {
    disableToken(true);
  }

  if (settings.token === false) {
    disableProfile(true);
    disableAccount(true);
    disableLogout(true);
  } else {
    disableProfile(false);
    disableAccount(false);
    disableLogout(false);
  }
}

function getTokens() {
    // detect if authenticated
    if (code) {
        var tokenRequest = {
            code: code,
            grant_type: 'authorization_code',
            client_id: settings.client_id,
            redirect_uri: settings.redirect_uri
        };

        if (settings.client_secret.trim() !== '') {
          tokenRequest.client_secret = settings.client_secret;
        }

        var postBody = postBodyEncode(tokenRequest).replace(/\&/g, "&\n");
        var request =
`Request Method: POST
Request URL: ${tokenUrl}
Post Body:
${postBody}
`;
        $('#request').val(request);
        $('#response').val('');

        action = function () {
            $.post(tokenUrl, tokenRequest)
                .done(function (data) {
                    settings.token = data;
                    $('#response').val(JSON.stringify(data, null, '    '));
                    $('#decoded-token').val(JSON.stringify(jwt_decode(data.access_token), null, '    '));
                    saveSettingsInLocalStorage();
                })
                .fail(function (data, status, error) {
                    settings.token = false;
                    var stringData = JSON.stringify({data: data, status: status, error: error}, null, '    ');
                    $('#response').val(
`Something failed. The client_id you're using has not been configured properly and might be encountering CORS issues in the browser. This is what the response contained:

${stringData}
`);
                })
                .always(function (data, o) {
                    buttonStates();
                });
        }
    }
}

function login() {
    var authParams = {
        client_id: settings.client_id,
        redirect_uri: settings.redirect_uri,
        scope: settings.scope,
        response_type: settings.response_type
    }
    var requestURL = authUrl + "?\n" + $.param(authParams).replace(/\&/g, "&\n");
    var request =
`Request Method: GET
Request URL: ${requestURL}`;

    $('#request').val(request);
    $('#response').val('');

    action = function () {
        window.location = authUrl + '?' + $.param(authParams);
    };
}

function getProfile() {
    profileRequest = settings.token;
    var postBody = postBodyEncode(profileRequest).replace(/\&/g, "&\n");
    var request =
`Request method: POST
Request URL: ${userInfoUrl}

Request Headers:
  Authorization: Bearer ${settings.token.access_token}
`;
    $('#request').val(request);
    $('#response').val('');

    action = function () {
        var x = $.post(userInfoUrl, profileRequest)
            .done(function (data) {
            })
            .fail(function (data) {
            })
            .always(function (data, status, xhr) {
                $('#response').val(JSON.stringify(data, null, '    '));
            });
    }
}

function showAccount() {
    var requestURL = settings.authority + "/account/applications";
    var request =
`Request Method: GET
Request URL: ${requestURL}
`;

    $('#request').val(request);
    $('#response').val('');

    action = function () {
        window.location = requestURL;
    };
}

function logout() {
    var authParams = {
        client_id: settings.client_id,
        redirect_uri: settings.redirect_uri,
        scope: settings.scope,
        response_type: settings.response_type
    }

    var requestURL = logoutUrl + "?\n" + $.param(authParams).replace(/\&/g, "&\n");
    var request =
`Request Method: GET
Request URL: ${requestURL}
Request Headers:
  Authorization: Bearer ${settings.token.access_token}
`;
    $('#request').val(request);
    $('#response').val('');
    action = function () {
        localStorage.removeItem('code');
        settings.token = false;
        saveSettingsInLocalStorage();
        window.location = logoutUrl + '?' + $.param(authParams);
    }
}

// ui binding functions for settings
function executeRequest() {
  if (action) {
    action();
  } else {
    $('#request').val(`Select an action from above before clicking Go`);
  }
}

function testAndSaveSettings() {
  var test = testIssuerURL();
  test
  .always(function(){
      pullSettingsFromUI();
      saveSettingsInLocalStorage();
      markAsSaved();
    });
}

function disableToken(disable) {
  $('#button-token').prop('disabled', disable);
}

function disableLogout(disable) {
  $('#button-logout').prop('disabled', disable);
}

function disableProfile(disable) {
  $('#button-profile').prop('disabled', disable);
}

function disableAccount(disable) {
  $('#button-account').prop('disabled', disable);
}

function pullSettingsFromUI() {
  settings.authority = $('#authority').val();
  settings.client_id = $('#client_id').val();
  settings.client_secret = $('#client_secret').val();
  settings.response_type = $('#response_type').val();
  settings.scope = $('#scope').val();
  settings.redirect_uri = $('#redirect_uri').val();

  protocolUrl = settings.authority + '/protocol/openid-connect';
  tokenUrl = protocolUrl + '/token';
  authUrl = protocolUrl + '/auth';
  userInfoUrl = protocolUrl + '/userinfo';
  logoutUrl = protocolUrl + '/logout';
}

function loadSettingsIntoUI() {
    $('#authority').val(settings.authority);
    $('#client_id').val(settings.client_id);
    $('#client_secret').val(settings.client_secret);
    $('#response_type').val(settings.response_type);
    $('#scope').val(settings.scope);
    $('#redirect_uri').val(settings.redirect_uri);
    if (settings.token) {
      $('#decoded-token').val(JSON.stringify(jwt_decode(settings.token.access_token), null, '    '));
    }
}

function clearSettingsFromUI() {
  $('#authority').val('');
  $('#client_id').val('');
  $('#client_secret').val('');
  $('#response_type').val('');
  $('#scope').val('');
  $('#redirect_uri').val('');
}

function loadDefaultSettings() {
  settings = $.extend({}, defaultSettings);
  loadSettingsIntoUI();
  saveSettingsInLocalStorage();
  markAsSaved();
}

function saveSettingsInLocalStorage() {
    localStorage.setItem('settings', JSON.stringify(settings));
}

function deleteSettingsFromLocalStorage() {
    localStorage.removeItem('settings');
}

function getSettingsInLocalStorage() {
    settings = localStorage.getItem('settings');

    if (!settings) {
        settings = $.extend({}, defaultSettings);
        saveSettingsInLocalStorage();
    } else {
        settings = JSON.parse(settings);
    }
}

function connectionGood() {
  var button = $('#test-issuer');
  button
    .removeClass('btn-warning btn-danger')
    .addClass('btn-success');

  $('.glyphicon', button)
    .removeClass('glyphicon-thumbs-down')
    .addClass('glyphicon-thumbs-up');
}

function connectionUntested() {
  var button = $('#test-issuer');
  button
    .removeClass('btn-success btn-danger')
    .addClass('btn-warning');
  $('.glyphicon', button)
    .removeClass('glyphicon-thumbs-up')
    .addClass('glyphicon-thumbs-down');
}

function connectionFailed() {
  var button = $('#test-issuer');
  button
    .removeClass('btn-warning btn-success')
    .addClass('btn-danger');
  $('.glyphicon', button)
    .removeClass('glyphicon-thumbs-up')
    .addClass('glyphicon-thumbs-down');
}

function testIssuerURL() {
  return $.ajax({
    url: $('#authority').val(),
    dataType: 'json',
    type: 'GET'
  })
  .done(function() { connectionGood(); })
  .fail(function() { connectionFailed(); });
}

function inputChanged(el) {
  var id = $(el).attr('id');
  var val = $(el).val();
  var div = $(el).closest('div');
  if (settings[id] != val) {
    div.removeClass('bg-success').addClass('bg-warning');
  } else {
    div.removeClass('bg-warning').addClass('bg-success');
  }
}

function authorityChanged(el) {
  inputChanged(el);
  testIssuerURL();
}

function markAsSaved() {
  var controls = $('#app-settings .form-control');
  controls.closest('div').removeClass('bg-warning').addClass('bg-success');
}

function postBodyEncode(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}
