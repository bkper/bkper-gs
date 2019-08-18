namespace AuthorizerDAO_ {
  
  export function storeTokenData(tokenData: TokenData): UserData {
    var userData = new UserData();
    if (tokenData.refresh_token != null) {
      userData.refreshToken = tokenData.refresh_token;
    }
    userData.accessToken = tokenData.access_token;
    //Expiration on miliseconds
    var expiresOn = (Date.now() + ((tokenData.expires_in - 60) * 1000));
    userData.expiresOn = expiresOn;
    PropertiesService.getUserProperties().setProperties(userData);
    return userData;
  }
  
  export function getAuthorizedUserData(): UserData {
    var userData = PropertiesService.getUserProperties().getProperties();
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