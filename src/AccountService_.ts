namespace AccountService_ {
  
  export function createAccountV2(bookId: string, name: string, group?: string, description?: string): void {
    
    var accountUpdate = new Object() as bkper.AccountCreationV2Payload
    
    accountUpdate.name = name;
    accountUpdate.group = group;
    accountUpdate.description = description;
    
    var accountUpdateJSON = JSON.stringify(accountUpdate);

    var responseJSON = new HttpBooksApiV2Request(`${bookId}/accounts`).setMethod('post').setPayload(accountUpdateJSON).fetch().getContentText();
    
    var accountPlain = JSON.parse(responseJSON);
  }
  
  export function createAccount(bookId: string, account: bkper.Account): Account {
    var accountSaveJSON = JSON.stringify(account);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/accounts`).setMethod('post').setPayload(accountSaveJSON).fetch().getContentText();
    var accountPlain = JSON.parse(responseJSON);
    return Utils_.wrapObject(new Account(), accountPlain);;
  }

  export function createAccounts(bookId: string, accounts: bkper.Account[]): Account[] {
    let accountList: bkper.AccountList = {
      items: accounts
    };
    var accountSaveBatchJSON = JSON.stringify(accountList);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/accounts/batch`).setMethod('post').setPayload(accountSaveBatchJSON).fetch().getContentText();
    var accountsPlain = JSON.parse(responseJSON).items;
    if (accountsPlain == null) {
      return [];
    }
    return Utils_.wrapObjects(new Account(), accountsPlain);;
    
  }


}
