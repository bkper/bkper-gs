var UserService_ = {
  
    getUserDetails: function() {
      var responseJSON = API.fetch("bkper","v2", "user/details");
      return JSON.parse(responseJSON);
    }
}
