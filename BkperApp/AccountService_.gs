var AccountService_ = {

  getAccounts: function(bookId) {
    var responseJSON = API.call_("get", "accounts", bookId);
    var accountsPlain = JSON.parse(responseJSON).items;
    if (accountsPlain == null) {
      return new Array();
    }
    var accounts = Utils_.wrapObjects(new Account(), accountsPlain);
    return accounts;
  },
  
  createAccount: function(bookId, name, description, permanent, credit) {
    
    var accountUpdate = new Object();
    
    accountUpdate.name = name;
    accountUpdate.description = description;
    
    if (permanent == true || permanent == false) {
      accountUpdate.permanent = permanent;
    }
    
    if (credit == true || credit == false) {
      accountUpdate.credit = credit;
    }
    
    var accountUpdateJSON = JSON.stringify(accountUpdate);
    
    var responseJSON = API.call_("post", "accounts", bookId, null, accountUpdateJSON);
    
    
    var accountPlain = JSON.parse(responseJSON);
    var account = Utils_.wrapObject(new Account(), accountPlain);
    return account;
  }

}
