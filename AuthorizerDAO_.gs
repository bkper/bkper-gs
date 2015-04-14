var AuthorizerDAO_ = {
  
  storeTokenData: function(tokenData) {
    var userData = new Object();
    if (tokenData.refresh_token != null) {
      userData.refreshToken = tokenData.refresh_token;
    }
    userData.accessToken = tokenData.access_token;
    //Expiration on miliseconds
    var expiresOn = (Date.now() + ((tokenData.expires_in - 60) * 1000));
    userData.expiresOn = expiresOn;
    PropertiesService.getUserProperties().setProperties(userData);
    return userData;
  },
  
  getAuthorizedUserData: function() {
    var userData = PropertiesService.getUserProperties().getProperties();
    if (userData != null && userData.refreshToken != null) {
      return userData;
    } else {
      return null;
    }
  },
  
  isTokenExpired: function(userData) {
    var now = Date.now();
    return  now > userData.expiresOn;
  },

  unauthorize: function() {
    PropertiesService.getUserProperties().deleteAllProperties();
  }
}