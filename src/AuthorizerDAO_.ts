namespace AuthorizerDAO_ {

  const BKPER_OAUTH2_TOKEN_KEY = 'bkper_oauth2_token';
  
  export function storeTokenData(tokenData: TokenData, refresh_token:string): UserData {
    var userData = new UserData();
    if (tokenData.refresh_token != null) {
      //New refresh token.
      userData.refreshToken = tokenData.refresh_token;
    } else if (refresh_token != null) {
      //Old refresh token. Preserve it.
      userData.refreshToken = refresh_token;
    }
    userData.accessToken = tokenData.access_token;
    //Expiration on miliseconds
    var expiresOn = (Date.now() + ((tokenData.expires_in - 360) * 1000));
    userData.expiresOn = expiresOn;
    let userDataJSON = JSON.stringify(userData);
    CachedProperties_.setCachedProperty(CacheService.getUserCache(), PropertiesService.getUserProperties(), BKPER_OAUTH2_TOKEN_KEY, userDataJSON);
    //OLD way - REMOVE LATER
    PropertiesService.getUserProperties().setProperties(userData);
    return userData;
  }
  
  export function getAuthorizedUserData(): UserData {

    var userDataJson = CachedProperties_.getCachedProperty(CacheService.getUserCache(), PropertiesService.getUserProperties(), BKPER_OAUTH2_TOKEN_KEY);
    var userData = userDataJson != null ? JSON.parse(userDataJson) : null;
    if (userData == null) {
      //OLD way - REMOVE LATER
      userData = PropertiesService.getUserProperties().getProperties();
    }

    if (userData != null && userData.refreshToken != null) {
      return userData;
    } else {
      return null;
    }
  }
  
  export function isTokenExpired(userData: UserData): boolean {
    var now = Date.now();
    return  now > userData.expiresOn;
  }

  export function unauthorize(): void {
    CachedProperties_.deleteCachedProperty(CacheService.getUserCache(), PropertiesService.getUserProperties(), BKPER_OAUTH2_TOKEN_KEY);

    //OLD way - REMOVE LATER
    PropertiesService.getUserProperties().deleteAllProperties();
  }

  export class TokenData {
    refresh_token: string
    access_token: string
    expires_in: number
  }

  class UserData {
    refreshToken: string
    accessToken: string
    expiresOn: number
  }
}