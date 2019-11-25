[Bkper]: https://bkper.com/
[bkper.com]: https://bkper.com

[Google Apps Script]: https://developers.google.com/apps-script/reference/
[OAuth2]: https://oauth.net/2/
[bkper.app]: https://bkper.app

[Dashboard]: https://script.google.com/home
[Book]: https://bkper.com/api/bkper-app/#book
[Account]: https://bkper.com/api/bkper-app/#account
[Transaction]: https://bkper.com/api/bkper-app/#transaction
[TransactionIterator]: https://bkper.com/api/bkper-app/#transactioniterator
[Google Apps Script API]: https://developers.google.com/apps-script/api/

[record]: https://bkper.com/api/bkper-app/#book_record
[getTransactions]: https://bkper.com/api/bkper-app/#book_gettransactions
[getBook]: https://bkper.com/api/bkper-app/#bkperapp_getbook

[CalendarApp]: https://developers.google.com/apps-script/reference/calendar/calendar-app
[DocumentApp]: https://developers.google.com/apps-script/reference/document/document-app
[SpreadsheetApp]: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app

[Add-on for Google Sheets]: https://apps.google.com/marketplace/app/nigjlfhgcfljgfalepfbklfceelkggdd
[Forms]: https://gsuite.google.com/marketplace/app/bkper_forms/588203895124
[Typescript]: https://developers.google.com/apps-script/guides/typescript
[reference documentation]: https://bkper.com/api/bkper-app/
[VS Code]: https://code.visualstudio.com
[clasp]: https://developers.google.com/apps-script/guides/clasp
[Typescript Definitions]: https://www.npmjs.com/package/@bkper/bkper-app-types
[GitHub]: https://github.com/
[Cloud Source Repositories]: https://cloud.google.com/source-repositories/
[BkperApp]: https://bkper.com/api/bkper-app

## <a name='overview'></a>Overview 

The standard way to access the [Bkper] API is through our [Google Apps Script] library [BkperApp](https://bkper.com/api/bkper-app). 


[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)
[![npm (scoped)](https://img.shields.io/npm/v/@bkper/bkper-app-types?color=%235889e4&label=types)](https://www.npmjs.com/package/@bkper/bkper-app-types)
[![GSTests status](https://gs-tests-status.appspot.com/badge.svg?suite=BkperApp&namespace=bkpertest)](https://script.google.com/macros/s/AKfycbyWJJFIwoqnNudRMGse18qVNWw5aa7g03-iLmL_rjqO8mg-MjI/exec?suite=BkperApp&namespace=bkpertest)


With BkperApp you can create many bookkeeping and accounting solutions on G Suite, such as the Bkper [Add-on for Google Sheets], simple automations or advanced solutions with [Google Apps Script API], and you can manage your scripts in the [Dashboard].

It works the same way your favorite Google Apps Script library works, like [CalendarApp], [DocumentApp], [SpreadsheetApp] etc, and it is safely authorized using [OAuth2] protocol:

<p align="center">
  <img src="https://bkper.com/api/images/BkperApp-overview.png">
</p>


## <a name='authorization'></a>Authorization

To authorize the library, you just need to run the OAuth2 flow only once per account. This can be easily done when you install any Add-ons, or at [bkper.app]


## <a name='setup'></a>Setup

This library is already published as an Apps Script, making it easy to include in your project. To add it to your script, do the following in the Apps Script code editor:

1. Click on the menu item "Resources > Libraries..."
2. In the "Add a Library" text box, enter the Script ID "**1fSZnepYcDUjxCsrWYD3452UJ5nJiB4js0cD45WWOAjMcKJR_PKfLU60X**" and click the "Select" button.
3. Choose a version in the dropdown box (usually best to pick the latest version).
4. Click the "Save" button.

## <a name='development'></a>Development

Altough you can work on the Online editor really quickly, we strongly recommend [clasp] to develop locally with [Typescript] on [VS Code] editor, which is really powerfull and free, so you get:

 - Code Autocomplete
 - Contextual documentation
 - Compile time error checking
 - Code navigation - really helpful!
 - Calling hierarchy searching
 - Use of new javascript features such as classes, interfaces, arrow functions etc
 - Easier code redability
 - Automatic refactoring

### Add Typescript Definitions:

#### 1) Add the package:

```
npm i -S @bkper/bkper-app-types
```
or
```
yarn add --dev @bkper/bkper-app-types
```

#### 2) Configure tsconfig.json:

```
{
    "compilerOptions": {
        "typeRoots" : ["node_modules/@bkper", "node_modules/@types" ]
    }
}
```

[Learn more](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types) about **@types**, **typeRoots** and **types**


Don't forget to keep your code always in sync with version control system such as [GitHub] or [Cloud Source Repositories]

## <a name='record_transactions'></a>Record Transactions


To record your first [Transaction], after authorizing and setup, copy and paste the function bellow:

```javascript
function recordATransaction() {

  var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHIOCxIGTGVkZ2VyGNKJAgw");

  book.record("#gas 63.23");

}
```
Exchange the parameter of the function [getBook] for the id of the [Book] you want to record the [Transaction]. This is the same parameter found on the URL accessed on [bkper.com]:

![bookId](https://bkper.com/api/images/bookId.png)

Now run the **recordATransaction** function and see the record appearing on the bkper screen:

![Recording](https://bkper.com/api/images/recording.png)

You can also record transactions in batch by passing an Array of strings as the [record] method parameter:

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



## <a name='list_transactions'></a>List Transactions


Each book is a large database and every interaction is done in terms of queries. Everytime you "select" an [Account] by clicking on left menu at [bkper.com], you are actually filtering transactions by that [Account].

Every query is shown in the search box on top of the page:

![Query](https://bkper.com/api/images/query.png)

When you retrieve transactions, the [getTransactions] method returns an [TransactionIterator] to let you handle potentially large datasets:

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

![Search log](https://bkper.com/api/images/logSearch.png)



## <a name='list_accounts'></a>List Accounts


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


<!-- 
## <a name='samples'></a>Samples


- [BkperCSVExportService](https://github.com/bkper/BkperCSVExportService) - Service to export bkper transactions in CSV format.

- [bkper things](https://github.com/oshliaer/bkper/tree/master/bkper%20things) - Custom action scripts triggered from inside bkper through webhooks -->

