
namespace AccountService_ {

  export function getAccounts(bookId: string): Array<Account> {
    var responseJSON = API.call_("get", "accounts", bookId);
    if (responseJSON == null || responseJSON == "") {
      return new Array();
    }
    var accountsPlain = JSON.parse(responseJSON).items;
    if (accountsPlain == null) {
      return new Array();
    }
    var accounts = Utils_.wrapObjects(new Account(), accountsPlain);
    return accounts;
  }
  
  export function createAccount(bookId: string, name: string, group?: string, description?: string): Account {
    
    var accountUpdate = new Object() as Bkper.AccountCreationV2Payload
    
    accountUpdate.name = name;
    accountUpdate.group = group;
    accountUpdate.description = description;
    
    var accountUpdateJSON = JSON.stringify(accountUpdate);
    
    var responseJSON = API.call_("post", "accounts", bookId, null, accountUpdateJSON);
    
    var accountPlain = JSON.parse(responseJSON);
    var account = Utils_.wrapObject(new Account(), accountPlain);
    return account;
  }

}
