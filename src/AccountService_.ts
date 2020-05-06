namespace AccountService_ {

  export function getAccounts(bookId: string): Account[] {
    var responseJSON = new HttpBooksApiRequest(`${bookId}/accounts`).fetch().getContentText();
    if (responseJSON == null || responseJSON == "") {
      return [];
    }
    var accountsPlain = JSON.parse(responseJSON).items;
    if (accountsPlain == null) {
      return [];
    }
    var accounts = Utils_.wrapObjects(new Account(), accountsPlain);
    return accounts;
  }
  
  export function createAccount(bookId: string, name: string, group?: string, description?: string): Account {
    
    var accountUpdate = new Object() as bkper.AccountCreationV2Payload
    
    accountUpdate.name = name;
    accountUpdate.group = group;
    accountUpdate.description = description;
    
    var accountUpdateJSON = JSON.stringify(accountUpdate);

    Logger.log(accountUpdateJSON)
    
    var responseJSON = new HttpBooksApiRequest(`${bookId}/accounts`).setMethod('post').setPayload(accountUpdateJSON).fetch().getContentText();
    
    var accountPlain = JSON.parse(responseJSON);
    var account = Utils_.wrapObject(new Account(), accountPlain);
    return account;
  }

}
