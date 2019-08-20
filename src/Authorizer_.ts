
namespace Authorizer_ {

  var API_UNAUTHORIZED = "bkper_api_unauthorized";

  //scriptUri: "https://script.google.com/a/macros/nimbustecnologia.com.br/s/AKfycbz5W1wM6pehcWmXa53D9jUctPHHymvFTTH05mxNdQ/dev",
  let scriptUri: "https://script.google.com/macros/s/AKfycbz8F5FGTTW72pQBfDvGjEB4eglVmOfhG_a9Qb3EXYjVo5IICg/exec"

  let tokenEndpoint: "https://accounts.google.com/o/oauth2/token"
  
  let scope: "https://www.googleapis.com/auth/userinfo.email"
  
  let clientIdKey: "CLIENT_ID"
  let clientSecretKey: "CLIENT_SECRET"
  
  export function processGetRequest(e: any): GoogleAppsScript.HTML.HtmlOutput {
    var continueUrl = null;
    var continueText = null;
    
    if (e.parameter && e.parameter.state) {
      try {
        var decoded = Utilities.base64Decode(e.parameter.state)
        var stateJSON = Utilities.newBlob(decoded).getDataAsString()
        var state = JSON.parse(stateJSON);
        continueUrl = decodeURI(state.continueUrl);
        continueText = decodeURI(state.continueText);
      } catch (error) {
        Logger.log(error);
      }
    }
    
    if (e.parameter && e.parameter.force == 'true') {
      return createAuthorizeTemplate(continueUrl, continueText);
    } else if (e.parameter && e.parameter.revoke == 'true') {
      AuthorizerDAO_.unauthorize();
      return createAuthorizeTemplate(continueUrl, continueText);
    } else if (isUserAuthorized()){
      return createAuthorizedTemplate(continueUrl, continueText);
    }
    
    if (e.parameter && e.parameter.code) {
      storeTokenData(e.parameter.code, scriptUri);
      return createAuthorizedTemplate(continueUrl, continueText);
    } else {
      // ask user to go over to Google to grant access
      return createAuthorizeTemplate();
    }    
  }
  
  export function isUserAuthorized(): boolean {
    try {
      validateAccessToken();
      return true;
    } catch (error) {
      Logger.log(error);
      return false;
    }
  }
  
  export function getAccessToken(): string {
    var userData = AuthorizerDAO_.getAuthorizedUserData();
    if (userData == null) {
      throw API_UNAUTHORIZED;
    }
    if (AuthorizerDAO_.isTokenExpired(userData)) {
      var postPayload = {
        "client_id" : PropertiesService.getScriptProperties().getProperty(clientIdKey),
        "client_secret" : PropertiesService.getScriptProperties().getProperty(clientSecretKey),
        "refresh_token" : userData.refreshToken,
        "grant_type" : "refresh_token"
      };
      var options = {
        "method" : "post",
        "payload" : postPayload
      };
      var response = fetchTokenEndpoint(options);
      var tokenData: AuthorizerDAO_.TokenData  = JSON.parse(response.getContentText());
      userData = AuthorizerDAO_.storeTokenData(tokenData);
    }
    
    return userData.accessToken;
  }

  export function storeTokenData(code: string, redirectUri: string): void {
    var postPayload = {
      "code" : code,
      "client_id" : PropertiesService.getScriptProperties().getProperty(clientIdKey),
      "client_secret" : PropertiesService.getScriptProperties().getProperty(clientSecretKey),
      "redirect_uri" : redirectUri,
      "grant_type" : "authorization_code"
    };
    var options = {
      "method" : "post",
      "payload" : postPayload
    };
    // do a URL fetch to POST the authorization code to google
    // and get an access token back
    var response = fetchTokenEndpoint(options);
    var responseText = response.getContentText()
    
    var tokenData  = JSON.parse(responseText);
    AuthorizerDAO_.storeTokenData(tokenData);
  }
  
  function fetchTokenEndpoint(options: object): GoogleAppsScript.URL_Fetch.HTTPResponse {
    try {
      return UrlFetchApp.fetch(tokenEndpoint, options);
    } catch (error) {
      var errorMsg = error + "";
      if (errorMsg.indexOf("invalid_grant") >= 0) {
        AuthorizerDAO_.unauthorize();
        throw API_UNAUTHORIZED;
      }
    }
  }
  
  export function validateAccessToken(): void {
    try {
      var accessToken =  getAccessToken();
      var responseJSON = UrlFetchApp.fetch("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + accessToken).getContentText();
      var tokenInfo = JSON.parse(responseJSON);
      var rightAudience = PropertiesService.getScriptProperties().getProperty(clientIdKey);
      if (tokenInfo.audience !=  rightAudience) {
        throw API_UNAUTHORIZED;
      }
    } catch (error) {
      Logger.log(error);
      throw API_UNAUTHORIZED;
    }
  }
  
  export function createAuthorizationURL(redirectUri: string, state: string): string {
    var authorizationURL = "https://accounts.google.com/o/oauth2/auth?client_id=" + PropertiesService.getScriptProperties().getProperty(clientIdKey) +
      "&response_type=code" +
        "&scope=" + scope +
          "&redirect_uri=" + redirectUri +
            "&access_type=offline" +
              "&login_hint=" + Session.getEffectiveUser().getEmail() +
                "&approval_prompt=force";
    if (state != null) {
      authorizationURL += "&state=" + state;
    }
    return authorizationURL;
  }
  
  export function getAuthorizedCloseWindow(): GoogleAppsScript.HTML.HtmlOutput {
    return HtmlService.createTemplateFromFile('AuthorizedViewClose').evaluate().setTitle('BkperApp authorized');
  }
  
  export function createAuthorizedTemplate(continueUrl: string, continueText: string): GoogleAppsScript.HTML.HtmlOutput {
    var template = HtmlService.createTemplateFromFile('AuthorizedView');
    if (continueUrl != null) {
      continueUrl = continueUrl.replace(/'/g, '"');
      template.continueUrl = continueUrl;
    } else {
      template.continueUrl = "http://bkper.github.io/docs/BkperApp";
    }
    if (continueText != null) {
      template.continueText = continueText;
    } else {
      template.continueText = "Documentation";
    }
    template.revokeUrl = scriptUri + "?revoke=true";
    return template.evaluate().setTitle("BkperApp authorized");
  }
  
  export function createAuthorizeTemplate(continueUrl?: string, continueText?: string): GoogleAppsScript.HTML.HtmlOutput {
    if (continueUrl != null && continueText == null) {
      throw "If continueUrl provided, continueText must be provided too.";
    }
    var redirectUri = scriptUri;
    var state = null;
    if (continueUrl != null) {
      var stateObject = {
        continueUrl: encodeURI(continueUrl),
        continueText: encodeURI(continueText)
      };
      var stateJSON = JSON.stringify(stateObject);
      state = Utilities.base64Encode(stateJSON);
    }
    var url1 = createAuthorizationURL(redirectUri, state);
    var template = HtmlService.createTemplateFromFile('AuthorizeView');
    template.authorizeLink = url1;
    return template.evaluate().setTitle("Authorize BkperApp");
  }
}


