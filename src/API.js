
var API = {

  /**
   @private
  */
  call_: function(httpMethod, service, Id, params, requestBody, contentType, headers) {
    var options =
        {
          "method" : httpMethod
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
      params.key = APP_KEY;
    } catch (error) {
      params.key = "AIzaSyCd9EGlw8P2vUoAkyaAE_472zXAhItPax8";
      //APP_KEY not defined. Fallback.
    }
    
    queryParams = BkperUtils.buildURLParams(params);

    var serviceFullPath = "ledgers";

    if (Id != null) {
      serviceFullPath += "/" + Id
    }

    if (service != null) {
      serviceFullPath += "/" + service;
    }

    if (queryParams != null && queryParams != "") {
      serviceFullPath += "?" +queryParams;
    }

    var contentText = API.fetch("bkper","v2", serviceFullPath, options).getContentText();

    return contentText;
  },



  /**
  @private
 */
  fetch: function(apiName, version, path, options) {
    var apiURL = "https://bkper-hrd.appspot.com/_ah/api/" + apiName + "/" + version + "/" + path;

    if (options == null) {
      options = new Object();
    }

    if (options.headers == null) {
      options.headers = new Object();
    }
    
    options.headers["x-bkper-app-id"] = "bkper-gas";
    
    var accessToken = Authorizer_.getAccessToken();
    options.headers.Authorization = "Bearer " + accessToken;
    if (options.contentType == null) {
      options.contentType = "application/json; charset=UTF-8";
    }      

  var retries = 0;
  var sleepTime = 1000;
  while (true) {
    try {
      var response = UrlFetchApp.fetch(apiURL, options);
      return response;
    } catch (error) {
      var errorMsg = error + "";
      if (errorMsg.indexOf("code 50") >= 0 || errorMsg.indexOf("Address unavailable") >= 0 || errorMsg.indexOf("Unexpected error") >= 0 || errorMsg.indexOf("Timeout") >= 0) {
        Logger.log("Failed to execute: " + retries);
        if (retries > 4) {
          throw error;
        } else {
          Logger.log("Retrying in " + (sleepTime/1000) + " secs...");
          Utilities.sleep(sleepTime);
          sleepTime = sleepTime * 2;
          retries++;
        }
      } else {
        if (errorMsg.indexOf("403") >= 0 || errorMsg.indexOf("forbidden") >= 0) {
          Authorizer_.validateAccessToken();
        }
        throw error;
      }
    }
  }    

  },


}


//function getUploadUrl() {
//  var params =
//      {
//        "method" : "get",
//      };
//
//  if (params.headers == null) {
//    params.headers = new Object();
//  }
//  var accessToken = Authorizer_.getAccessToken();
//  params.headers.Authorization = "Bearer " + accessToken;
//
//  var contentText = UrlFetchApp.fetch("https://bkper-hrd.appspot.com/_ah/api/bkper/v1/uploadUrl", params).getContentText();
//
//  var contentObj = JSON.parse(contentText);
//  return contentObj.url;
//}
