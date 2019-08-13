[Bkper]: https://bkper.com/
[bkper.com]: https://bkper.com

[Intercom]: https://www.intercom.io/

[Google Apps Script]: https://developers.google.com/apps-script/reference/
[OAuth2]: http://oauth.net/
[authorization script]: https://script.google.com/macros/s/AKfycbz8F5FGTTW72pQBfDvGjEB4eglVmOfhG_a9Qb3EXYjVo5IICg/exec

[Dashboard]: https://script.google.com/home
[Book]: https://developers.bkper.com/Book.html
[Account]: https://developers.bkper.com/Account.html
[Transaction]: https://developers.bkper.com/Transaction.html
[TransactionIterator]: https://developers.bkper.com/TransactionIterator.html
[Google Apps Script API]: https://developers.google.com/apps-script/api/concepts/

[record]: https://developers.bkper.com/Book.html#record
[search]: https://developers.bkper.com/Book.html#search
[openById]: https://developers.bkper.com/global.html#openById
[getBalanceReport]: https://developers.bkper.com/Book.html#getBalanceReport

[CalendarApp]: https://developers.google.com/apps-script/reference/calendar/calendar-app
[DocumentApp]: https://developers.google.com/apps-script/reference/document/document-app
[SpreadsheetApp]: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app

[Sheets]: https://gsuite.google.com/marketplace/app/bkper_sheets/75894855272
[Forms]: https://gsuite.google.com/marketplace/app/bkper_forms/588203895124

## BkperApp  [![GSTests status](https://gs-tests-status.appspot.com/badge.svg?suite=BkperApp&namespace=bkper)](https://script.google.com/macros/s/AKfycbyWJJFIwoqnNudRMGse18qVNWw5aa7g03-iLmL_rjqO8mg-MjI/exec?suite=BkperApp&namespace=bkper)

BkperApp is a [Google Apps Script] library for [Bkper]. 

With BkperApp you can create many solutions on G Suite, such as the [Sheets] and [Forms] Add-ons, simple automations or advanced solutions with [Google Apps Script API], and you can manage your scripts in the [Dashboard].

It works the same way your favorite Google Apps Script library works, like [CalendarApp], [DocumentApp], [SpreadsheetApp] etc, and it is safely authorized using [OAuth2] protocol:

![BkperApp overview](images/BkperApp-overview.png)




### Authorization

To authorize the library, you just need to run the OAuth2 flow only once per account. This can be easily done when you install any Add-ons, or by clicking and running this [authorization script]



### Setup
This library is already published as an Apps Script, making it easy to include in your project. To add it to your script, do the following in the Apps Script code editor:

1. Click on the menu item "Resources > Libraries..."
2. In the "Find a Library" text box, enter the project key "**My8jgp9C1MEeWVxuYNppyFgoOxUd2qb-3**" and click the "Select" button.
3. Choose a version in the dropdown box (usually best to pick the latest version).
4. Click the "Save" button.



### Record Transactions

To record your first [Transaction], after authorizing and setup, copy and paste the function bellow:

```javascript
function recordATransaction() {

  var book = BkperApp.openById("agtzfmJrcGVyLWhyZHIOCxIGTGVkZ2VyGNKJAgw");

  book.record("#gas 63.23");

}
```
Exchange the parameter of the function [openById] for the id of the [Book] you want to record the [Transaction]. This is the same parameter found on the URL accessed on [bkper.com]:

![bookId](images/bookId.png)

Now run the **recordATransaction** function and see the record appearing on the bkper screen:

![Recording](images/recording.png)

You can also record transactions in batch by passing an Array of strings as the [record] method parameter:

```javascript
function batchRecordTransactions() {

  var book = BkperApp.openById("agtzfmJrcGVyLWhyZHIOCxIGTGVkZ2VyGNKJAgw");

  var transactions = new Array();

  transactions.push("#breakfast 15.40");
  transactions.push("#lunch 27.45");
  transactions.push("#dinner 35.86");

  book.record(transactions);

}
```
The above code will send all records in a bulk. Very useful for importing large amount of data without the risk of reaching script limits.





### Query Transactions

Each book is a large database and every interaction is done in terms of queries. Everytime you "select" an [Account] by clicking on left menu at [bkper.com], you are actually filtering transactions by that [Account].

Every query is shown in the search box on top of the page:

![Query](images/query.png)

When you search transactions, the [search] method returns an [TransactionIterator] to let you handle potentially large datasets:

```javascript
function queryTransactions() {

  var book = BkperApp.openById("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgKCtg6MLDA");

  //Search returns an interator to deal with potencial large datasets
  var transactionIterator = book.search("acc:'Bank' after:01/04/2014");

  while (transactionIterator.hasNext()) {
    var transaction = transactionIterator.next();
    Logger.log(transaction.getDescription());
  }

}
```

Run the **queryTransactions** function, exchanging your bookId, with the same query, check the log output and you will see the same descriptions:

![Search log](images/logSearch.png)



### List Accounts Balances

You can access all Account objects, and query its balances, in a way similar to the left sidebar:
```javascript
function listAccountBalances() {
  //Open the book
  var book = BkperApp.openById("agtzfmJrcGVyLWhyZHIOCxIGTGVkZ2VyGNKJAgw");

  var accounts = book.getAccounts();
  for (var i=0; i < accounts.length; i++) {
    var account = accounts[i];
    if (account.isPermanent() && account.isActive()) {
      Logger.log(account.getName() + ": " + account.getBalance());
    }
  }
}
```


### Query Balances over time

it is very easy to query balances of Accounts and #hashtags over time, getting period and cumulative balances. Balance queries are used in [bkper.com] to generate chart reports:

![Balance Queries](images/balanceQueries.png)

You can easily run balance queries on your script, by calling the function [getBalanceReport], like the example bellow:
```javascript
/**
Deploy as web app to get the generated Charts
*/
function doGet() {

  //Open the book
  var book = BkperApp.openById("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgKCtg6MLDA");

  //Query for balances
  var report = book.getBalanceReport("= group:'Expenses' group:'Incomes' after:01/2014 before:02/2014");

  //Create data table builder
  var dataTableBuilder = report.createDataTable().setBalanceType(BkperApp.BalanceType.TOTAL);

  //Create chart
  var chartsDataTable = dataTableBuilder.buildChartDataTable();
  var pieChart = Charts.newPieChart().setDataTable(chartsDataTable).build();
  var tableChart = Charts.newTableChart().setDataTable(chartsDataTable).build();

  //Add to UI
  var ui = UiApp.createApplication();
  ui.add(pieChart);
  ui.add(tableChart);

  return ui;

}
```

Exchange the book id and the query, deploy and run the [script as a web app](https://developers.google.com/apps-script/execution_web_apps), and you will get a report like this [live example](https://script.google.com/macros/s/AKfycbxm2ezSE16D2pcuc3Hr-R8gFEZ7q_i8r55WHCsaFcH4ugwZ2cM/exec).



### Samples

- [BkperCSVExportService](https://github.com/bkper/BkperCSVExportService) - Service to export bkper transactions in CSV format.

- [bkper things](https://github.com/oshliaer/bkper/tree/master/bkper%20things) - Custom action scripts triggered from inside bkper through webhooks

- [IntercomBkperBridge](https://github.com/bkper/IntercomBkperBridge) - Bridge from [Intercom] to [Bkper], to keep a view of user segments over time.
