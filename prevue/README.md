# Introduction

This guide project will walk you through integrating your application
with an OpenId issuer. It has some limitations listed below.

# Limitations

1. The only `response_type` option currently supported by this tool is `code`
even though your issuer might support more.

# Installation

First you install this project on your local machine.

1. `git clone https://github.com/VirginPulsePublic/openid-connect-tool.git`
2. Install `node` 6.10.2 or higher from [the node site](nodejs.org)
or using your favorite package manager.
3. Run `npm install` to fetch dependencies

# Running it

1. Run `npm start` to start up a local server that serves the application.
2. Your browser should open to `http://localhost:8080` but you can navigate to it in manually as well.
3. Woohoo! ......now comes the hard part

# The page loads, now what?

Here is the short version of how you can acquire an access token with this demo
app.

1. Fill out the `App Settings` section.
2. Redirect the user to the issuer's authentication endpoint by clicking the
"Authenticate" button
3. Login with your test user after the redirect
4. Once back on the demo app page, click on the `Get Token` button
Yay! Now you have an access token that grants you access to some or all of
the API endpoints that acknowledge the issuer's token you just received.
5. Make API endpoint calls by adding the token to your requests in the `Authorization` header. It should look like this `Authorization: Bearer <your_token>`
6. Refresh your access token using the refresh token

# The page loads, now what? - Long version

Before you can begin using this tool you need to get your hands
on a few key pieces of information to fill out the `App Settings` section.

1. __Issuer URL__ - You can get this from the API provider you're trying to access.
It might look like this: (https://www.issuer.com/) or like this (https://www.issuer.com/auth) or like this (https://www.issuer.com/auth)
2. __Client Identity/Identifier__ - the issuer will provide this for use with your application. Usually the issuer has a way for you to register your application and create a client identity, either through a web page somewhere and creating it yourself or by calling them up on the phone.
3. __Response type__ - This tool currently only supports the `code` response type
but your issuer might support more such as the `implicit` type. The basic OAuth 2.0 description of response type is [here](https://tools.ietf.org/html/rfc6749).
4. __Scopes__ - A space separated list of scopes. You can think of these as permissions. For example, when users log into your app you might request the 'user-profile' scope which will allow you to access their 'user-profile' information. You'll need to get a list of supported scopes from the issuer as scopes vary wildly and can mean different things to different issuers. Keep in mind that the user might not give consent to all the scopes you request. Your application should include code to account for not having all the access it requested.
5. __Redirect URI__ - This is where your app will receive communications from the issuer. For mobile apps using a WebView your redirect uri can be something like `ios://myhandler` or `android://myhandler`. For web apps it can look like this `https://myapplication.com/openid/issuer_redirect_1` or just `https://myapplication.com/redirect_path`. Your application should be ready to handle any incoming requests.

Once you have this info, fill out the `App Settings` form on the page and click the `Save`. We can now begin the [Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-4.1) below.

__NOTE:__ Keep in mind, you'll also need to have a test user to authenticate as during the authentication code flow below. Ask your issuer for a test user as well, unless you already have one.

# Authorization Code Flow

The diagram below is a slightly modified version of the digram shown in the [OAuth 2.0 RFC](https://tools.ietf.org/html/rfc6749#section-4.1).

```
+----------+
| End User |
|          |
+----------+
     ^
     |
    (B)
+----|-----+          Client Identifier      +---------------+
|         -+----(A)-- & Redirection URI ---->|               |
| WebView/ |                                 | Authorization |
| Browser -+----(B)-- User authenticates --->|     Server    |
|          |                                 |               |
|         -+----(C)-- Authorization Code ---<|               |
+-|----|---+                                 +---------------+
  |    |                                         ^      v
 (A)  (C)                                        |      |
  |    |                                         |      |
  ^    v                                         |      |
+---------+                                      |      |
|         |>---(D)-- Authorization Code ---------'      |
|  Your   |          & Redirection URI                  |
|  App    |                                             |
|         |<---(E)----- Access Token -------------------'
+---------+       (w/ Optional Refresh Token)

Note: The lines illustrating steps (A), (B), and (C) are broken into
two parts as they pass through the end user's browser.
```

## Starting the flow (A)

Scroll down to the Authentication form for this part.

To start the authorization code flow you should click on the
"Authenticate" button. It will redirect the user to the OpenId
authentication URL. This url is constructed from the information
you added to the `App Settings` portion above. If your request is
not properly constructed the issuer will redirect you back to your
redirect uri with an error message included in the URL. For
example, change the __Response Type__ to `invalid` and click
Authenticate, you should see an error saying the response type is invalid.

For a better explanation of potential error messages you can visit the
[OpenId Authentication Error Response](http://openid.net/specs/openid-connect-core-1_0.html#AuthError)
page and/or the [OAuth 2.0 Authorization Error Response](https://tools.ietf.org/html/rfc6749#section-4.1.2.1)
page.


For a better explanation of the constructed URL you can [go here](http://openid.net/specs/openid-connect-core-1_0.html#AuthRequest)

Mobile application can use a WebView to navigate the user to the URL.
Most web based applications, like this one, can do a simple redirect
to the URL.

## Authenticating as a user (B)

The above step redirects you to the issuer's authentication URL.
Your application can't do much here. It's all up to the interaction
between the user and the issuer authentication process. The user
will first authenticate and then grant your app access to their
information.

## Receiving the redirect (C)

When the user authenticates successfully and grants your app
access, the issuer will redirect the user to either the redirect
uri you provided in the request or the default redirect uri the
issuer has saved for the client identity you provided. Play it
safe and always provide a redirect uri.

The request to the redirect uri will contain either an error if
something went wrong. If you receive an error your application
should do something about it and try to address the problem.

For a better explanation of potential error messages you can visit the
[OpenId Authentication Error Response](http://openid.net/specs/openid-connect-core-1_0.html#AuthError)
page and/or the [OAuth 2.0 Authorization Error Response](https://tools.ietf.org/html/rfc6749#section-4.1.2.1)
page.

Otherwise, your application will get an authorization code that
it can exchange for an access token.

Mobile apps should detect the redirect to their specified uri and
extract the code. Similarly, web applications that receive a request
to their redirect uri should extract the code either directly in the
web browser when the page loads or on the server that handles the request.

This demo application automatically extracts the authentication code
provided by the issuer.

## Get the access token (D) & (E)

Your app should now have the authentication code extracted from
the previous step. Yes! But this doesn't give you access to the API.
You must now request an access token using this authentication code.

With this demo app, click on the "Get Token" button. It will issue
a request to the issuer's token endpoint, usually ending in `/token`.

The request to the token endpoint will include the authentication code, among
other things.

You should now see the resulting access token in the UI.

```
{
  "access_token":
  "<your jwt access token would be here", // this is your access token to include in the Authorization header on API requests. It'll look like this `Authorization: Bearer <you jwt access token>`
  "expires_in":300, //access token expires after 300 seconds
  "refresh_expires_in":1800, //refresh token expires after 1800 seconds
  "refresh_token":"<your jwt refresh token>", //your refresh token!
  "token_type":"bearer", //this access token is a "bearer" token
  "id_token":"<the id token>",
  "not-before-policy":0,
  "session_state":"b02357f1-e098-4f57-a1d4-77c6d255f1eb"
}
```

Examine to make sure you understand what each piece of data means.

## Refresh your access token (E)

The access token you received can only be used for a
certain amount of time that is specified when you first
get it. Afterwards, it becomes invalid and will be
denied access. If your issuer supports it, you might
also receive a refresh token with the access token. The
refresh token is usually valid a longer than the access
token and has it's own lifetime specified in the request.
With the refresh token you can request another access
token immediately without having to put the user through
the whole authentication flow again.

Hit the "Refresh my token" button and you should now see
that you've received a new access token and potentially
a new refresh token if the one you used had a limited
lifetime. Some refresh tokens are reusable and have a
lifetime of zero. Your issuer will have more details
on what kind of refresh tokens are available.

# Additional info

OpenID Connect 1.0 is a simple identity layer on top of the OAuth 2.0 protocol.
As such, the terminology from the [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749) is used as a base.
This link describes [Open Id Terminology](http://openid.net/specs/openid-connect-core-1_0.html#Terminology)
and defines some additional terms besides those defined in OAuth 2.0.
