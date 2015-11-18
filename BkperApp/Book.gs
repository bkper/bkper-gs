/**
@classdesc
This class defines a Book.
<br/>
A  is an abstraction of a structure that you want to control, like a business, project, or personal expenses and so forth.
<br/>
It contains all {@link Account|Accounts} where {@link Transaction|Transactions} are recorded/posted;
@constructor
*/
function Book(id) {

  this.id = id;

  /**
  @return {string} The id of this Book
  @method
  */
  Book.prototype.getId = function() {
    return this.id;
  }

  /**
  @return {string} The name of this Book
  @method
  */
  Book.prototype.getName = function() {
    this.checkBookLoaded_();
    return this.wrapped.name;
  }
  
  /**
  @return {string} The fraction digits of this Book
  @method
  */
  Book.prototype.getFractionDigits = function() {
    this.checkBookLoaded_();
    return this.wrapped.fractionDigits;
  }

  /**
  @return {string} The name of this Book Owner
  @method
  */
  Book.prototype.getOwnerName = function() {
    this.checkBookLoaded_();
    return this.wrapped.ownerName;
  }

  Book.prototype.checkBookLoaded_ = function() {
    if (this.wrapped == null) {
      this.wrapped = BookService_.loadBookWrapped(this.getId());
    }
  }

  /**
  @return {Permission} The permission of the current user
  */
  Book.prototype.getPermission = function() {
    this.checkBookLoaded_();
    return this.wrapped.permission;
  }

  /**
  @return {string} The locale of the Book
  @deprecated Please use getDatePattern and getDecimalSeparator instead
  */
  Book.prototype.getLocale = function() {
    this.checkBookLoaded_();
    return this.wrapped.locale;
  }

  /**
  @return {string} The date pattern of the Book
  */
  Book.prototype.getDatePattern = function() {
    this.checkBookLoaded_();
    return this.wrapped.datePattern;
  }

  /**
  @return {DecimalSeparator} The decimal separator of the Book
  */
  Book.prototype.getDecimalSeparator = function() {
    this.checkBookLoaded_();
    return this.wrapped.decimalSeparator;
  }


  /**
  @param {Date} date The date to format as string.
  @param {string} timeZone The output timezone of the result
  @return {string} The date formated according to {@link Book#getDatePattern|date pattern of book}
  */
  Book.prototype.formatDate = function(date, timeZone) {
    return Utils_.formatDate(date, this.getDatePattern(), timeZone);
  }

 /**
 @param {Number} value The value to be formatted.
 @return {string} The value formated according to {@link Book#getDecimalSeparator|decimal separator} and {@link Book#getFractionDigits|fraction digits} of book}
  */
  Book.prototype.formatValue = function(value) {
    return Utils_.formatValue_(value, this.getDecimalSeparator(), this.getFractionDigits());
  }

  /**
  Records {@link Transaction|Transactions} a on the Book. The text is usually amount and description, but it can also can contain an informed Date in full format (dd/mm/yyyy - mm/dd/yyyy).
  @param {string|Array<string>|Array<Array>} transactions The text/array/matrix containing transaction records, one per line/row. Each line/row records one transaction.
  @param {string} [timeZone] The time zone to format dates.
  */
  Book.prototype.record = function(transactions, timeZone) {
    TransactionService_.record(this, transactions, timeZone);
  }

  /**
  Resumes a transaction iteration using a continuation token from a previous iterator.
  @param {string} continuationToken continuation token from a previous folder iterator
  @return {TransactionIterator} a collection of transactions that remained in a previous iterator when the continuation token was generated
  */
  Book.prototype.continueTransactionIterator = function(query, continuationToken) {
    var transactionIterator = new TransactionIterator(this, query);
    transactionIterator.setContinuationToken(continuationToken);
    return transactionIterator;
  }

  //TRANSACTIONS

  /**
  Search for transactions.
  <br/>
  Go to <a href='https://www.bkper.com' target='_blank'>bkper.com</a> and open search wizard: <img src='http://about.bkper.com/img/wizard.png'/> to learn more about query syntax.

  @param {string} query The query string.
  @return {TransactionIterator} The search result as an iterator.

  @example
  var book = BkperApp.loadBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
  var transactions = book.search("acc:CreditCard after:28/01/2013 before:29/01/2013");
  ...
  transactions = book.search("#fuel");
  ...
  transactions = book.search("#fuel after:$d-4");
  ...
  transactions = book.search("after:23/01/2013 before:29/01/2013 using:postDate");
  ...
  while (transactions.hasNext()) {
    var transaction = transactions.next();
    Logger.log(transaction.getDescription());
  }

  */
  Book.prototype.search = function(query) {
    return new TransactionIterator(this, query);
  }


  /**
  @private
  */
  Book.prototype.configureTransactions_ = function(transactions) {
    for (var i = 0; i < transactions.length; i++) {
      this.configureTransaction_(transactions[i]);
    }
    return transactions;
  }


  /**
  @private
  */
  Book.prototype.configureTransaction_ = function(transaction) {
    transaction.book = this;
    transaction.configure_();
    return transaction;
  }


  Book.prototype.transactionPosted_ = function(transaction) {
    var creditAccount = this.getAccount(transaction.wrapped.creditAccId);
    creditAccount.wrapped.balance = transaction.wrapped.caBal;
    creditAccount.hasTransactionPosted = true;

    var debitAccount = this.getAccount(transaction.wrapped.debitAccId);
    debitAccount.wrapped.balance = transaction.wrapped.daBal;
    debitAccount.hasTransactionPosted = true;
    transaction.configure_();
  }


  /**
  Gets all {@link Account|Accounts} of this Book
  @returns {Array<Account>}
  */
  Book.prototype.getAccounts = function() {
    if (this.accounts == null) {
      this.configureAccounts_(AccountService_.getAccounts(this.getId()));
    }
    return this.accounts;
  }


  /**
  Gets an {@link Account} object
  @param {number|string} idOrName The id or name of the Account
  @returns {Account} The matching Account object
  */
  Book.prototype.getAccount = function(idOrName) {

    if (idOrName == null) {
      return null;
    }

    if (this.accounts == null) {
      this.getAccounts();
    }

    var account = this.idAccountMap[idOrName];
    var normalizedIdOfName = normalizeName(idOrName);
    if (account == null) {
      account = this.nameAccountMap[normalizedIdOfName];
    }


    for (var i = 0; i < this.accounts.length; i++) {
      var currentAcc = this.accounts[i];
      if (currentAcc.getNormalizedName().indexOf(normalizedIdOfName) > -1) {
        account = currentAcc;
        break;
      }
    }

    return account;
  }

  /**
  Create an {@link Account} in this book
  @param {string} name The name of the Account
  @param {string} description The description of the Account
  @param {boolean} permanent The {@link permanent nature|Account.isPermanent} of the Account
  @param {boolean} credit The {@link credit nature|Account.isCredit} of the Account
  @returns {Account} The created Account object
  */
  Book.prototype.createAccount = function(name, description, permanent, credit) {
    var account = AccountService_.createAccount(this.getId(), name, description, permanent, credit)
    account.book = this;
    this.accounts = null;
    return account;
  }



  Book.prototype.configureAccounts_ = function(accounts) {
    this.accounts = accounts;
    this.idAccountMap = new Object();
    this.nameAccountMap = new Object();
    for (var i = 0; i < this.accounts.length; i++) {
      var account = this.accounts[i];
      account.book = this;
      this.idAccountMap[account.getId()] = account;
      this.nameAccountMap[account.getNormalizedName()] = account;
    }
  }

  /**
  Gets all @{link Group|Groups} of this Book
  @returns {Array<Group>}
  */
  Book.prototype.getGroups = function() {
    if (this.groups == null) {
      this.configureGroups_(GroupService_.getGroups(this.getId()));
    }
    return this.groups;
  }

  /**
  Gets an {@link Group} object
  @param {number|string} idOrName The id or name of the Group
  @returns {Group} The matching Group object
  */
  Book.prototype.getGroup = function(idOrName) {

    if (idOrName == null) {
      return null;
    }

    if (this.groups == null) {
      this.getGroups();
    }

    var group = this.idGroupMap[idOrName];
    if (group == null) {
      group = this.nameGroupMap[normalizeName(idOrName)];
    }

    return group;
  }

  Book.prototype.configureGroups_ = function(groups) {
    this.groups = groups;
    this.idGroupMap = new Object();
    this.nameGroupMap = new Object();
    for (var i = 0; i < this.groups.length; i++) {
      var group = this.groups[i];
      group.book = this;
      this.idGroupMap[group.getId()] = Group;
      this.nameGroupMap[normalizeName(group.getName())] = group;
    }
  }



  Book.prototype.getSavedQueries = function() {
    if (this.savedQueries == null) {
      this.savedQueries = SavedQueryService_.getSavedQueries(this.getId());
    }
    return this.savedQueries;
  }



  /**
  Get balances reports given a query. Balance queries starts with "=".
  <br/><br/>
  This method gives a {@link BalanceReport|Report.BalanceReport}.
  </br>
  Usually balances are used to populate data tables for charts with <a href='https://developers.google.com/apps-script/reference/charts/' target='_blank'>Chart Services</a> and create great user interfaces, dashboards or insert in documents to report it for users.
  <br/><br/>
  Go to <a href='https://www.bkper.com' target='_blank'>bkper.com</a> and open report wizard: <img src='http://about.bkper.com/img/wizard.png'/> to learn more about query sintax.

  @param {string} query The report query (starting with '=')
  @return {Report.BalanceReport} A Balance Report representation

  @example


  var book = BkperApp.openById("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");



  book.getBalanceReport("=#rental #energy after:8/2013 before:9/2013");
  ...
  book.getBalanceReport("=group:'Expenses' after:$m before:$m+1");
  ...
  book.getBalanceReport("=acc:'Home' acc:'Transport' #medicines after:8/2013 before:12/2013");

  @see Variables
  */
  Book.prototype.getBalanceReport = function(query) {
    var balances = BalancesService_.getBalances(this.getId(), query);

    return new Report.BalanceReport(balances, this.getDecimalSeparator(), this.getDatePattern(), this.getFractionDigits());
  }

  /**
  Create a {@link TransactionsDataTableBuilder|TransactionsDataTableBuilder} based on a query.
  <br/><br/>
  This method gives a {@link TransactionsDataTableBuilder|TransactionsDataTableBuilder} to create two dimensional Array representations of transactions dataset.
  <br/><br/>
  Go to <a href='https://www.bkper.com' target='_blank'>bkper.com</a> and open report wizard: <img src='http://about.bkper.com/img/wizard.png'/> to learn more about query sintax.

  @param {string} query The flter query.
  @return {TransactionsDataTableBuilder} the Transactions list builder.

  @example

  var book = BkperApp.openById("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");


  book.createTransactionsDataTable("acc:'Bank' after:8/2013 before:9/2013");
  ...
  book.createTransactionsDataTable("after:$m before:$m+1");
  ...
  book.createTransactionsDataTable("#gas");

  @see Variables
  */
  Book.prototype.createTransactionsDataTable = function(query) {
    var transactionIterator = this.search(query);
    return new TransactionsDataTableBuilder(transactionIterator);
  }

}