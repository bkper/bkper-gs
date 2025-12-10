namespace AccountService_ {

    export function createAccountV2(bookId: string, name: string, group?: string, description?: string): void {

        var accountUpdate = new Object() as any;

        accountUpdate.name = name;
        accountUpdate.group = group;
        accountUpdate.description = description;

        var payload = JSON.stringify(accountUpdate);

        var responseJSON = new HttpBooksApiV2Request(`${bookId}/accounts`).setMethod('post').setPayload(payload).fetch().getContentText();

        var accountPlain = JSON.parse(responseJSON);
    }

    export function createAccount(bookId: string, account: bkper.Account): bkper.Account {
        var payload = JSON.stringify(account);
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/accounts`).setMethod('post').setPayload(payload).fetch().getContentText();
        return JSON.parse(responseJSON);
    }

    export function updateAccount(bookId: string, account: bkper.Account): bkper.Account {
        var payload = JSON.stringify(account);
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/accounts`).setMethod('put').setPayload(payload).fetch().getContentText();
        return JSON.parse(responseJSON);
    }

    export function deleteAccount(bookId: string, account: bkper.Account): bkper.Account {
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/accounts/${account.id}`).setMethod('delete').fetch().getContentText();
        return JSON.parse(responseJSON);
    }

    export function createAccounts(bookId: string, accounts: bkper.Account[]): bkper.Account[] {
        let accountList: bkper.AccountList = {
            items: accounts
        };
        var accountSaveBatchJSON = JSON.stringify(accountList);
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/accounts/batch`).setMethod('post').setPayload(accountSaveBatchJSON).fetch().getContentText();
        var accountsPlain = JSON.parse(responseJSON).items;
        if (accountsPlain == null) {
            return [];
        }
        return accountsPlain;

    }

    export function listAccounts(bookId: string): bkper.Account[] {
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/accounts`).setMethod('get').fetch().getContentText();
        var accountsPlain = JSON.parse(responseJSON).items;
        if (accountsPlain == null) {
            return [];
        }
        return accountsPlain;

    }

    export function listAccountsByGroup(bookId: string, groupId: string): bkper.Account[] {
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/groups/${groupId}/accounts`).setMethod('get').fetch().getContentText();
        var accountsPlain = JSON.parse(responseJSON).items;
        if (accountsPlain == null) {
            return [];
        }
        return accountsPlain;
    }



}
