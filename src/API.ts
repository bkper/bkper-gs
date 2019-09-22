
namespace API {

  export function call_(httpMethod: 'get' | 'delete' | 'patch' | 'post' | 'put', service?: string, Id?: string | number, params?: object, requestBody?: string, contentType?: string, headers?: object): string {
    var options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions =
    {
      "method": httpMethod
    };

    if (contentType != null) {
      options.contentType = contentType;
    }

    if (headers != null) {
      options.headers = headers;
    }

    if (requestBody != null) {
      options.payload = requestBody;
    }

    var queryParams = null;

    if (params == null) {
      params = new Object();
    }

    try {
      // @ts-ignore
      params.key = APP_KEY;
    } catch (error) {
      // @ts-ignore
      params.key = PropertiesService.getScriptProperties().getProperty('APP_KEY');
      //APP_KEY not defined. Fallback.
    }

    queryParams = Utils_.buildURLParams(params);

    var serviceFullPath = "ledgers";

    if (Id != null) {
      serviceFullPath += "/" + Id
    }

    if (service != null) {
      serviceFullPath += "/" + service;
    }

    if (queryParams != null && queryParams != "") {
      serviceFullPath += "?" + queryParams;
    }

    var contentText = fetch("bkper", "v2", serviceFullPath, options).getContentText();

    return contentText;
  }

  export function fetch(apiName: string, version: string, path: string, options?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions): GoogleAppsScript.URL_Fetch.HTTPResponse {
    var apiURL = "https://bkper-hrd.appspot.com/_ah/api/" + apiName + "/" + version + "/" + path;

    if (options == null) {
      options = new Object();
    }

    if (options.headers == null) {
      options.headers = new Headers();
    }

    (options.headers as Headers)["x-bkper-app-id"] = "bkper-gas";

    var accessToken = Authorizer_.getAccessToken();

    (options.headers as Headers).Authorization = "Bearer " + accessToken;
    if (options.contentType == null) {
      options.contentType = "application/json; charset=UTF-8";
    }

    options.muteHttpExceptions = true;

    var retries = 0;
    var sleepTime = 1000;
    while (true) {
      var response = UrlFetchApp.fetch(apiURL, options);

      if (response.getResponseCode() >= 200 && response.getResponseCode() < 300) {
        //OK
        return response;
      } else {
        //ERROR
        let responseText = response.getContentText();
        let error = JSON.parse(responseText).error;
        if (response.getResponseCode() >= 500) {
          //Retry in case of server error
          if (retries > 4) {
            throw error.message;
          } else {
            Logger.log("Retrying in " + (sleepTime / 1000) + " secs...");
            Utilities.sleep(sleepTime);
            sleepTime = sleepTime * 2;
            retries++;
          }
        } else {
          if (response.getResponseCode() == 403 || responseText.indexOf("forbidden") >= 0) {
            //Forbidden
            Authorizer_.validateAccessToken();
          }
          throw error.message;
        }
      }
    }
  }


  class Headers {
    Authorization: string
    "x-bkper-app-id": string
  }

}
