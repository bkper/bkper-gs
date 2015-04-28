var API = {

  /**
   @private
  */
  call_: function(httpMethod, service, Id, params, requestBody, contentType) {
    var options =
        {
          "method" : httpMethod
        };

    if (contentType != null) {
      options.contentType = contentType;
    }

    if (requestBody != null) {
      options.payload = requestBody;
    }
    var queryParams = null;
    if (params != null) {
      queryParams = BkperUtils.buildURLParams(params);
    }

    var serviceFullPath = "ledgers";

    if (Id != null) {
      serviceFullPath += "/" + Id
    }

    if (service != null) {
      serviceFullPath += "/" + service;
    }

    if (queryParams != null) {
      serviceFullPath += "?" +queryParams;
    }

    var contentText = API.fetch("bkper","v2", serviceFullPath, options).getContentText();

    return contentText;
  },


  /**
  @private
 */
  fetch: function(apiName, version, path, params) {
    var apiURL = "https://bkper-hrd.appspot.com/_ah/api/" + apiName + "/" + version + "/" + path;

    if (params == null) {
      params = new Object();
    }

    if (params.headers == null) {
      params.headers = new Object();
    }

    var accessToken = Authorizer_.getAccessToken();
    params.headers.Authorization = "Bearer " + accessToken;
    if (params.contentType == null) {
      params.contentType = "application/json; charset=UTF-8";
    }

    try {
      var response = UrlFetchApp.fetch(apiURL, params);
      return response;
    } catch (error) {
      var errorMsg = error + "";
      if (errorMsg.indexOf("403") >= 0 || errorMsg.indexOf("forbidden") >= 0) {
        Authorizer_.validateAccessToken();
      }
      throw error;
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
