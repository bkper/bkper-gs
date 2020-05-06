namespace UserService_ {
  
  export function getUserDetails(): bkper.UserDetailsV2Payload {
      var responseJSON = new HttpApiRequest('user/details').fetch().getContentText();
      return JSON.parse(responseJSON);
    }
}
