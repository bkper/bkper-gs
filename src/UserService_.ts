namespace UserService_ {
  
  export function getUserDetails(): Bkper.UserDetailsV2Payload {
      var responseJSON = API.fetch("bkper","v2", "user/details").getContentText();
      return JSON.parse(responseJSON);
    }
}
