
let API_KEY_: string;
let OAUTH_TOKEN_PROVIDER_: OAuthTokenProvider;

/**
 * Interface to provide OAuth2 tokens upon calling the API.
 * 
 * Implement your own if you need to use one other than the default built-in [ScriptApp](https://developers.google.com/apps-script/reference/script/script-app#getoauthtoken).
 * 
 * Its specially usefull on environments where you can use the built-in ScriptApp services such as [Custom Functions in Google Sheets](https://developers.google.com/apps-script/guides/sheets/functions).
 * 
 * Learn more how to [OAuth 2 library](https://github.com/gsuitedevs/apps-script-oauth2) for Google Apps Script
 * 
 * @public
 */
interface OAuthTokenProvider {

  /**
   * A valid OAuth2 access token with **email** scope authorized.
   */
  getOAuthToken(): string;
}

/**
 * Sets the API key to identify the agent.
 * 
 * API keys are intended for agent identification only, not for authentication. [Learn more](https://cloud.google.com/endpoints/docs/frameworks/java/when-why-api-key)
 * 
 * See how to create your api key [here](https://cloud.google.com/docs/authentication/api-keys).
 *
 * @param key The key from GCP API &  Services Credentials console.
 * 
 * @public
 */
function setApiKey(key: string | null | undefined): void {
  API_KEY_ = key;
}

/**
 * Sets the [[OAuthTokenProvider]]. 
 * 
 * If none set, the default built-in [ScriptApp](https://developers.google.com/apps-script/reference/script/script-app#getoauthtoken) will be used.
 * 
 * @param tokenProvider The [[OAuthTokenProvider]] implementation.
 * 
 * @public
 */
function setOAuthTokenProvider(tokenProvider: OAuthTokenProvider) {
  OAUTH_TOKEN_PROVIDER_ = tokenProvider;
}


class HttpApiRequest  {

  private httpRequest: Bkper.HttpRequest;
  
  constructor(path: string) {
    this.httpRequest = HttpRequestApp.newRequest(`https://app.bkper.com/_ah/api/bkper/${path}`);
  }

  public setMethod(method: GoogleAppsScript.URL_Fetch.HttpMethod) {
    this.httpRequest.setMethod(method);
    return this;
  }

  public setHeader(name: string, value: string) {
    this.httpRequest.setHeader(name, value);
    return this;
  }

  public addParam(name: string, value: any) {
    this.httpRequest.addParam(name, value)
    return this;
  }

  public setContentType(contentType: string) {
    this.httpRequest.setContentType(contentType);
    return this;
  }

  public getContentType(): string {
    return this.httpRequest.getContentType();
  }

  public setPayload(payload: GoogleAppsScript.URL_Fetch.Payload) {
    this.httpRequest.setPayload(payload);
    return this;
  }


  fetch(): GoogleAppsScript.URL_Fetch.HTTPResponse {
    if (OAUTH_TOKEN_PROVIDER_ == null) {
      OAUTH_TOKEN_PROVIDER_ = ScriptApp;
    }

    if (API_KEY_ == null) {
      API_KEY_ = CachedProperties_.getCachedProperty(CacheService.getScriptCache(), PropertiesService.getScriptProperties(), 'API_KEY');
    }

    this.httpRequest.setHeader('Authorization', `Bearer ${OAUTH_TOKEN_PROVIDER_.getOAuthToken()}`);
    this.httpRequest.addParam('key', API_KEY_);
    if (this.httpRequest.getContentType() == null) {
      this.httpRequest.setContentType('application/json; charset=UTF-8')
    }
    this.httpRequest.setMuteHttpExceptions(true);

    var retries = 0;
    var sleepTime = 1000;
    while (true) {
      let response;
      try {
        response = this.httpRequest.fetch();
      } catch (addressUnavailable) {
        //Error on fetch service
        if (retries > 4) {
            throw addressUnavailable;
        } else {
          Logger.log("Retrying in " + (sleepTime / 1000) + " secs...");
          Utilities.sleep(sleepTime);
          sleepTime = sleepTime * 2;
          retries++;
          continue;
        }
      }

      if (response.getResponseCode() >= 200 && response.getResponseCode() < 300) {
        //OK
        return response;      
      } else {
        //ERROR
        let responseText = response.getContentText();
        let error;
        let unknowError = false;
        try {
           error = JSON.parse(responseText).error;
        } catch (e) {
          unknowError = true;
        }
        if (unknowError || response.getResponseCode() == 429 || response.getResponseCode() >= 500) {
          //Retry in case of server error
          if (retries > 4) {
            if (unknowError) {
              throw responseText;
            } else {
              throw error.message;
            }
          } else {
            Logger.log("Retrying in " + (sleepTime / 1000) + " secs...");
            Utilities.sleep(sleepTime);
            sleepTime = sleepTime * 2;
            retries++;
          }
        } else {
          throw error.message;
        }
      }
    }
  }
}

class HttpBooksApiV2Request extends HttpApiRequest {
  constructor(service: string) {
    super(`v2/ledgers/${service}`)
  }
}

class HttpBooksApiV5Request extends HttpApiRequest {
  constructor(service: string) {
    super(`v5/books/${service}`)
  }
}

class HttpApiV5Request extends HttpApiRequest {
  constructor(service: string) {
    super(`v5/${service}`)
  }
}
