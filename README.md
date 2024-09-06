## bkper-gs

```bkper-gs``` library provides a simple and secure way to access the [Bkper REST API][Bkper REST API] through [Google Apps Script][Google Apps Script] infrastructure.

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)
[![npm (scoped)](https://img.shields.io/npm/v/@bkper/bkper-gs-types?color=%235889e4&label=types)](https://www.npmjs.com/package/@bkper/bkper-gs-types)

With ```bkper-gs``` you can build [Apps and Bots][Apps and Bots] to your Books to create bookkeeping and accounting solutions on Google Workspace, such as the Bkper [Add-on for Google Sheets][Add-on for Google Sheets], simple automations or advanced solutions, and you can manage your scripts in the [Dashboard][Dashboard].

It works the same way your favorite Google Apps Script library works, providing a **BkperApp** entry point, like [CalendarApp][CalendarApp], [DocumentApp][DocumentApp], [SpreadsheetApp][SpreadsheetApp] and the like.

See the [complete reference](https://bkper.com/docs/bkper-gs/)

### Setup

This library is already published as an [Apps Script](https://script.google.com/d/1hMJszJGSUVZDB3vmsWrUZfRhY1UWbhS0SQ6Lzl06gm1zhBF3ioTM7mpJ/edit?usp=sharing), making it easy to include in your project. To add it to your script, do the following in the Apps Script code editor:

1. Click on the menu item "Resources > Libraries..."
2. In the "Add a Library" text box, enter the Script ID "**1hMJszJGSUVZDB3vmsWrUZfRhY1UWbhS0SQ6Lzl06gm1zhBF3ioTM7mpJ**" and click the "Select" button.
3. Choose a version in the dropdown box (usually best to pick the latest version).
4. Click the "Save" button.

#### Typescript Definitions for autocomplete:

To use TypeScript in the development of an Apps Script project, see the [Develop Apps Script using TypeScript](https://developers.google.com/apps-script/guides/typescript) as reference.

##### 1) Add the package:

```
npm i -S @bkper/bkper-gs-types
```

or

```
yarn add --dev @bkper/bkper-gs-types
```

##### 2) Configure tsconfig.json:

```
{
    "compilerOptions": {
        "typeRoots" : ["node_modules/@bkper", "node_modules/@types" ]
    }
}
```

[Learn more](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types) about **@types**, **typeRoots** and **types**

### Get a Book

The get a [Book][Book], use the parameter found on the URL accessed on [bkper.com][bkper.com]:

![bookId](https://bkper.com/docs/images/bookId.png)

To get the Book name:

```javascript
function getBookName() {
  var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHIOCxIGTGVkZ2VyGNKJAgw");
  var bookName = book.getName();
}
```

### Record Transactions

To record a simple transaction:

```javascript
function recordATransaction() {
  var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHIOCxIGTGVkZ2VyGNKJAgw");
  book.record("#gas 63.23");
}
```

You can also record transactions in batch by passing an Array of strings as the [record][record] method parameter:

```javascript
function batchRecordTransactions() {

  var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHIOCxIGTGVkZ2VyGNKJAgw");

  var transactions = new Array();

  transactions.push("#breakfast 15.40");
  transactions.push("#lunch 27.45");
  transactions.push("#dinner 35.86");

  book.record(transactions);

}
```

The above code will send all records in a bulk. Very useful for importing large amount of data without the risk of reaching script limits.

### List Transactions

Each book is a large database and every interaction is done in terms of queries. Everytime you "select" an [Account][Account] by clicking on left menu at [bkper.com][bkper.com], you are actually filtering transactions by that [Account][Account].

When you retrieve transactions, the [getTransactions][getTransactions] method returns an [TransactionIterator][TransactionIterator] to let you handle potentially large datasets:

```javascript
function listTransactions() {

  var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgKCtg6MLDA");

  //GetTransactions returns an interator to deal with potencial large datasets
  var transactionIterator = book.getTransactions("account:'Bank' after:01/04/2014");

  while (transactionIterator.hasNext()) {
    var transaction = transactionIterator.next();
    Logger.log(transaction.getDescription());
  }

}
```

Run the **queryTransactions** function, exchanging your bookId, with the same query, check the log output and you will see the same descriptions:

![Search log](https://bkper.com/docs/images/logSearch.png)

### List Accounts

You can access all Account objects, in a way similar to the left sidebar:

```javascript
function listAccounts() {
  //Open the book
  var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHIOCxIGTGVkZ2VyGNKJAgw");

  var accounts = book.getAccounts();
  for (var i=0; i < accounts.length; i++) {
    var account = accounts[i];
    if (account.isPermanent() && account.isActive()) {
      Logger.log(account.getName() + ": " + account.getBalance());
    }
  }
}
```

### See the [complete reference](https://bkper.com/docs/bkper-gs/)


[Bkper]: https://bkper.com/
[bkper.com]: https://bkper.com
[Apps and Bots]: https://bkper.com/docs
[Bkper REST API]: http://bkper.com/docs/#rest-api
[Google Apps Script]: https://developers.google.com/apps-script/reference/
[Dashboard]: https://script.google.com/home
[Book]: https://bkper.com/docs/bkper-gs/#book
[Account]: https://bkper.com/docs/bkper-gs/#account
[Transaction]: https://bkper.com/docs/bkper-gs/#transaction
[TransactionIterator]: https://bkper.com/docs/bkper-gs/#transactioniterator
[record]: https://bkper.com/docs/bkper-gs/#book_record
[getTransactions]: https://bkper.com/docs/bkper-gs/#book_gettransactions
[getBook]: https://bkper.com/docs/bkper-gs/#bkperapp_getbook
[CalendarApp]: https://developers.google.com/apps-script/reference/calendar/calendar-app
[DocumentApp]: https://developers.google.com/apps-script/reference/document/document-app
[SpreadsheetApp]: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
[Add-on for Google Sheets]: https://workspace.google.com/marketplace/app/bkper/360398463400
