namespace UserService_ {
  
  export function getUserDetails(): bkper.UserDetailsV2Payload {
      var responseJSON = API_.fetch("bkper","v2", "user/details").getContentText();
      return JSON.parse(responseJSON);
    }
}
