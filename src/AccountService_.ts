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
  
  export function createAccount(bookId: string, accountSave: bkper.AccountSave): Account {
    var accountSaveJSON = JSON.stringify(accountSave);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/accounts`).setMethod('post').setPayload(accountSaveJSON).fetch().getContentText();
    var accountPlain = JSON.parse(responseJSON);
    var account = Utils_.wrapObject(new Account(), accountPlain);
    return account;
  }

  export function createAccounts(bookId: string, accountSaveList: bkper.AccountSave[]): Account[] {
    let accountSaveBatch: bkper.AccountSaveBatch = {
      items: accountSaveList
    };
    var accountSaveBatchJSON = JSON.stringify(accountSaveBatch);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/accounts/batch`).setMethod('post').setPayload(accountSaveBatchJSON).fetch().getContentText();
    var accountsPlain = JSON.parse(responseJSON).items;
    if (accountsPlain == null) {
      return [];
    }
    var accounts = Utils_.wrapObjects(new Account(), accountsPlain);
    return accounts;
    
  }


}
