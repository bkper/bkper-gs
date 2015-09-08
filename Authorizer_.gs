var API_UNAUTHORIZED = "bkper_api_unauthorized";

var Authorizer_ = {

//scriptUri: "https://script.google.com/a/macros/nimbustecnologia.com.br/s/AKfycbz5W1wM6pehcWmXa53D9jUctPHHymvFTTH05mxNdQ/dev",
scriptUri: "https://script.google.com/macros/s/AKfycbz8F5FGTTW72pQBfDvGjEB4eglVmOfhG_a9Qb3EXYjVo5IICg/exec",

  tokenEndpoint: "https://accounts.google.com/o/oauth2/token",
  
  scope: "https://www.googleapis.com/auth/userinfo.email",
  
  clientIdKey: "CLIENT_ID",
  clientSecretKey: "CLIENT_SECRET",
  
  processGetRequest: function(e) {
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
      return Authorizer_.createAuthorizeTemplate(continueUrl, continueText);
    } else if (e.parameter && e.parameter.revoke == 'true') {
      AuthorizerDAO_.unauthorize();
      return Authorizer_.createAuthorizeTemplate(continueUrl, continueText);
    } else if (Authorizer_.isUserAuthorized()){
      return Authorizer_.createAuthorizedTemplate(continueUrl, continueText);
    }
    
    if (e.parameter && e.parameter.code) {
      Authorizer_.storeTokenData(e.parameter.code, Authorizer_.scriptUri);
      return Authorizer_.createAuthorizedTemplate(continueUrl, continueText);
    } else {
      // ask user to go over to Google to grant access
      return Authorizer_.createAuthorizeTemplate();
    }    
  },
  
  isUserAuthorized: function() {
    try {
      Authorizer_.validateAccessToken();
      return true;
    } catch (error) {
      Logger.log(error);
      return false;
    }
  },
  
  
  getAccessToken: function() {
    var userData = AuthorizerDAO_.getAuthorizedUserData();
    if (userData == null) {
      throw API_UNAUTHORIZED;
    }
    if (AuthorizerDAO_.isTokenExpired(userData)) {
      var postPayload = {
        "client_id" : PropertiesService.getScriptProperties().getProperty(Authorizer_.clientIdKey),
        "client_secret" : PropertiesService.getScriptProperties().getProperty(Authorizer_.clientSecretKey),
        "refresh_token" : userData.refreshToken,
        "grant_type" : "refresh_token"
      };
      var options = {
        "method" : "post",
        "payload" : postPayload
      };
      var response = Authorizer_.fetchTokenEndpoint(options);
      var tokenData  = JSON.parse(response.getContentText());
      userData = AuthorizerDAO_.storeTokenData(tokenData);
    }
    
    return userData.accessToken;
  },

  storeTokenData: function(code, redirectUri) {
    var postPayload = {
      "code" : code,
      "client_id" : PropertiesService.getScriptProperties().getProperty(Authorizer_.clientIdKey),
      "client_secret" : PropertiesService.getScriptProperties().getProperty(Authorizer_.clientSecretKey),
      "redirect_uri" : redirectUri,
      "grant_type" : "authorization_code"
    };
    var options = {
      "method" : "post",
      "payload" : postPayload
    };
    // do a URL fetch to POST the authorization code to google
    // and get an access token back
    var response = Authorizer_.fetchTokenEndpoint(options);
    var responseText = response.getContentText()
    
    var tokenData  = JSON.parse(responseText);
    AuthorizerDAO_.storeTokenData(tokenData);
  },
  
  fetchTokenEndpoint: function(options) {
    try {
      return UrlFetchApp.fetch(Authorizer_.tokenEndpoint, options);
    } catch (error) {
      var errorMsg = error + "";
      if (errorMsg.indexOf("invalid_grant") >= 0) {
        AuthorizerDAO_.unauthorize();
        throw API_UNAUTHORIZED;
      }
    }
  },
  
  validateAccessToken : function() {
    try {
      var accessToken =  Authorizer_.getAccessToken();
      var responseJSON = UrlFetchApp.fetch("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + accessToken);
      var tokenInfo = JSON.parse(responseJSON);
      var rightAudience = PropertiesService.getScriptProperties().getProperty(Authorizer_.clientIdKey);
      if (tokenInfo.audience !=  rightAudience) {
        throw API_UNAUTHORIZED;
      }
    } catch (error) {
      Logger.log(error);
      throw API_UNAUTHORIZED;
    }
  },
  
  createAuthorizationURL: function(redirectUri, state) {
    var authorizationURL = "https://accounts.google.com/o/oauth2/auth?client_id=" + PropertiesService.getScriptProperties().getProperty(Authorizer_.clientIdKey) +
      "&response_type=code" +
        "&scope=" + Authorizer_.scope +
          "&redirect_uri=" + redirectUri +
            "&access_type=offline" +
              "&login_hint=" + Session.getEffectiveUser().getEmail() +
                "&approval_prompt=force";
    if (state != null) {
      authorizationURL += "&state=" + state;
    }
    return authorizationURL;
  },
  
  getAuthorizedCloseWindow: function() {
    return HtmlService.createTemplateFromFile('AuthorizedViewClose').evaluate().setTitle('BkperApp authorized');
  },
  
  createAuthorizedTemplate: function(continueUrl, continueText) {
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
    template.revokeUrl = Authorizer_.scriptUri + "?revoke=true";
    return template.evaluate().setTitle("BkperApp authorized");
  },  
  
  createAuthorizeTemplate: function(continueUrl, continueText) {
    if (continueUrl != null && continueText == null) {
      throw "If continueUrl provided, continueText must be provided too.";
    }
    var redirectUri = Authorizer_.scriptUri;
    var state = null;
    if (continueUrl != null) {
      var stateObject = {
        continueUrl: encodeURI(continueUrl),
        continueText: encodeURI(continueText)
      };
      var stateJSON = JSON.stringify(stateObject);
      state = Utilities.base64Encode(stateJSON);
    }
    var url1 = Authorizer_.createAuthorizationURL(redirectUri, state);
    var template = HtmlService.createTemplateFromFile('AuthorizeView');
    template.authorizeLink = url1;
    return template.evaluate().setTitle("Authorize BkperApp");
  }
}


