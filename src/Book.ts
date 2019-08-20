/**
@classdesc
This class defines a Book.
<br/>
A  is an abstraction of a structure that you want to control, like a business, project, or personal expenses and so forth.
<br/>
It contains all {@link Account|Accounts} where {@link Transaction|Transactions} are recorded/posted;
@constructor
*/
class Book {

  private id: string
  private wrapped: Bkper.BookV2Payload
  private accounts: Account[];
  private groups: Group[];
  private idAccountMap: Map<string, Account>;
  private nameAccountMap: Map<string, Account>;
  private idGroupMap: Map<string, Group>;
  private nameGroupMap: Map<string, Group>;
  private savedQueries: Bkper.SavedQueryV2Payload[];

  constructor(id: string) {
    this.id = id;
  }

  /**
  * @return The id of this Book
  */
  public getId(): string {
    return this.id;
  }

  /**
  * @return The name of this Book
  */
  public getName(): string {
    this.checkBookLoaded_();
    return this.wrapped.name;
  }

  /**
  * @return The fraction digits of this Book
  */
  public getFractionDigits(): number {
    this.checkBookLoaded_();
    return this.wrapped.fractionDigits;
  }

  /**
  * @return The name of this Book Owner
  */
  public getOwnerName(): string {
    this.checkBookLoaded_();
    return this.wrapped.ownerName;
  }

  private checkBookLoaded_(): void {
    if (this.wrapped == null) {
      this.wrapped = BookService_.loadBookWrapped(this.getId());
    }
  }

  /**
  * @return The permission of the current user
  */
 public getPermission(): Enums.Permission {
    this.checkBookLoaded_();
    return this.wrapped.permission;
  }

  /**
  * @return The locale of the Book
  * @Deprecated Use {@link Book#getDatePattern} and {@link Book#getDecimalSeparator} instead
  */
 public getLocale(): string {
    this.checkBookLoaded_();
    return this.wrapped.locale;
  }

  /**
  * @return The date pattern of the Book
  */
 public getDatePattern(): string {
    this.checkBookLoaded_();
    return this.wrapped.datePattern;
  }

  /**
  * @return {DecimalSeparator} The decimal separator of the Book
  */
 public getDecimalSeparator(): Enums.DecimalSeparator {
    this.checkBookLoaded_();
    return this.wrapped.decimalSeparator as Enums.DecimalSeparator;
  }


  /**
  * @return The time zone of the book
  */
 public getTimeZone = function (): string {
    this.checkBookLoaded_();
    return this.wrapped.timeZone;
  }

  /**
  * @return The time zone offset of the book, in minutes
  */
 public getTimeZoneOffset(): number {
    this.checkBookLoaded_();
    return this.wrapped.timeZoneOffset;
  }

  /**
  * @return The last update date of the book, in in milliseconds
  */
 public getLastUpdateMs(): string {
    this.checkBookLoaded_();
    return this.wrapped.lastUpdateMs;
  }

  /**
  * @param  date The date to format as string.
  * @param  timeZone The output timezone of the result. Default to script's timeZone
  * @return The date formated according to {@link Book#getDatePattern|date pattern of book}
  */
 public formatDate(date: Date, timeZone?: string): string {
    return Utils_.formatDate(date, this.getDatePattern(), timeZone);
  }

  /**
  * @param value The value to be formatted.
  * @return The value formated according to {@link Book#getDecimalSeparator|decimal separator} and {@link Book#getFractionDigits|fraction digits} of book}
   */
  public formatValue(value: number): string {
    return Utils_.formatValue_(value, this.getDecimalSeparator(), this.getFractionDigits());
  }

  /**
  * Record {@link Transaction|Transactions} a on the Book. The text is usually amount and description, but it can also can contain an informed Date in full format (dd/mm/yyyy - mm/dd/yyyy).
  * @param transactions The text/array/matrix containing transaction records, one per line/row. Each line/row records one transaction.
  * @param timeZone The time zone to format dates.
  */
  public record(transactions: string | any[] | any[][], timeZone?: string) {

    if (timeZone == null || timeZone.trim() == "") {
      Logger.log("Fallback to book timezone!")
      timeZone = this.getTimeZone();
    }

    TransactionService_.record(this, transactions, timeZone);
  }

  /**
  * Resumes a transaction iteration using a continuation token from a previous iterator.
  * @param continuationToken continuation token from a previous folder iterator
  * @return a collection of transactions that remained in a previous iterator when the continuation token was generated
  */
  public continueTransactionIterator(query: string, continuationToken: string): TransactionIterator {
    var transactionIterator = new TransactionIterator(this, query);
    transactionIterator.setContinuationToken(continuationToken);
    return transactionIterator;
  }

  //TRANSACTIONS

  /**
  * Search for transactions.
  * <br/>
  * Go to <a href='https://app.bkper.com' target='_blank'>bkper.com</a> and open search wizard: <img src='http://about.bkper.com/img/wizard.png'/> to learn more about query syntax.
  *  
  * @param query The query string.
  * @return The search result as an iterator.
  * 
  * @example
  * ```
  * var book = BkperApp.loadBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
  * var transactions = book.search("acc:CreditCard after:28/01/2013 before:29/01/2013");
  * ...
  * transactions = book.search("#fuel");
  * ...
  * transactions = book.search("#fuel after:$d-4");
  * ...
  * transactions = book.search("after:23/01/2013 before:29/01/2013 using:postDate");
  * ...
  * while (transactions.hasNext()) {
  *  var transaction = transactions.next();
  *  Logger.log(transaction.getDescription());
  * }
  * ```
  */
  public search(query: string): TransactionIterator {
    return new TransactionIterator(this, query);
  }


  /**
  * @private
  */
  public configureTransactions_(transactions: Transaction[]) {
    for (var i = 0; i < transactions.length; i++) {
      this.configureTransaction_(transactions[i]);
    }
    return transactions;
  }


  /**
  * @private
  */
  private configureTransaction_(transaction: Transaction) {
    transaction.book = this;
    transaction.configure_();
    return transaction;
  }


  public transactionPosted_(transaction: Transaction) {
    var creditAccount = this.getAccount(transaction.wrapped.creditAccId);
    creditAccount.wrapped.balance = transaction.wrapped.caBal;

    var debitAccount = this.getAccount(transaction.wrapped.debitAccId);
    debitAccount.wrapped.balance = transaction.wrapped.daBal;
    transaction.configure_();
  }


  /**
  * Gets all {@link Account|Accounts} of this Book
  */
  public getAccounts(): Account[] {
    if (this.accounts == null) {
      this.configureAccounts_(AccountService_.getAccounts(this.getId()));
    }
    return this.accounts;
  }


  /**
  Gets an {@link Account} object
  * @param idOrName The id or name of the Account
  * @returns The matching Account object
  */
  public getAccount(idOrName: string): Account {

    if (idOrName == null) {
      return null;
    }

    if (this.accounts == null) {
      this.getAccounts();
    }

    var account = this.idAccountMap.get(idOrName);
    if (account == null) {
      var normalizedIdOfName = normalizeName(idOrName);
      account = this.nameAccountMap.get(normalizedIdOfName);
    }

    return account;
  }

  /**
  * Create an {@link Account} in this book. 
  * 
  * The type of account will be determined by the type of others Accounts in same group. If not specified, the type ASSET (permanent=true/credit=false) will be set.
  * 
  * If all other accounts in same group is in another group, the account will also be added to the other group.
  * 
  * @param name The name of the Account
  * @param group The group of the Account. 
  * @param description The description of the Account
  * @returns The created Account object
  */
  public createAccount(name: string, group?: string, description?: string): Account {
    var account = AccountService_.createAccount(this.getId(), name, group, description);
    account.book = this;
    this.accounts = null;
    return account;
  }



  private configureAccounts_(accounts: Account[]): void {
    this.accounts = accounts;
    this.idAccountMap = new Map<string, Account>();
    this.nameAccountMap = new Map<string, Account>();
    for (var i = 0; i < this.accounts.length; i++) {
      var account = this.accounts[i];
      account.book = this;
      this.idAccountMap.set(account.getId(), account);
      this.nameAccountMap.set(account.getNormalizedName(), account);
    }
  }

  /**
  Gets all @{link Group|Groups} of this Book
  */
  public getGroups(): Group[] {
    if (this.groups == null) {
      this.configureGroups_(GroupService_.getGroups(this.getId()));
    }
    return this.groups;
  }

  /**
  Gets an {@link Group} object
  @param idOrName The id or name of the Group
  @returns {Group} The matching Group object
  */
  public getGroup(idOrName: string): Group {

    if (idOrName == null) {
      return null;
    }

    if (this.groups == null) {
      this.getGroups();
    }

    var group = this.idGroupMap.get(idOrName);
    if (group == null) {
      group = this.nameGroupMap.get(normalizeName(idOrName));
    }

    return group;
  }

  private configureGroups_(groups: Group[]): void {
    this.groups = groups;
    this.idGroupMap = new Map<string, Group>();
    this.nameGroupMap = new Map<string, Group>();
    for (var i = 0; i < this.groups.length; i++) {
      var group = this.groups[i];
      group.book = this;
      this.idGroupMap.set(group.getId(), group);
      this.nameGroupMap.set(normalizeName(group.getName()), group);
    }
  }

  public getSavedQueries(): Bkper.SavedQueryV2Payload[] {
    if (this.savedQueries == null) {
      this.savedQueries = SavedQueryService_.getSavedQueries(this.getId());
    }
    return this.savedQueries;
  }



  /**
  * Get balances reports given a query. Balance queries starts with "=".
  * <br/><br/>
  * This method gives a {@link BalanceReport|Report.BalanceReport}.
  * </br>
  * Usually balances are used to populate data tables for charts with <a href='https://developers.google.com/apps-script/reference/charts/' target='_blank'>Chart Services</a> and create great user interfaces, dashboards or insert in documents to report it for users.
  * <br/><br/>
  * Go to <a href='https://app.bkper.com' target='_blank'>bkper.com</a> and open report wizard: <img src='http://about.bkper.com/img/wizard.png'/> to learn more about query sintax.
  * 
  * @param {string} query The report query (starting with '=')
  * @return {Report.BalanceReport} A Balance Report representation
  * 
  * @example
  * 
  * ```
  * var book = BkperApp.openById("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
  * 
  * book.getBalanceReport("=#rental #energy after:8/2013 before:9/2013");
  * ...
  * book.getBalanceReport("=group:'Expenses' after:$m before:$m+1");
  * ...
  * book.getBalanceReport("=acc:'Home' acc:'Transport' #medicines after:8/2013 before:12/2013");
  * 
  * ```
  * @see Variables
  */
  public getBalanceReport(query: string): Report.BalanceReport{
    var balances = BalancesService_.getBalances(this.getId(), query);
    return new Report.BalanceReport(balances, this.getDecimalSeparator(), this.getDatePattern(), this.getFractionDigits(), this.getTimeZoneOffset(), this.getTimeZone());
  }

  /**
  * Create a {@link TransactionsDataTableBuilder|TransactionsDataTableBuilder} based on a query.
  * <br/><br/>
  * This method gives a {@link TransactionsDataTableBuilder|TransactionsDataTableBuilder} to create two dimensional Array representations of transactions dataset.
  * <br/><br/>
  * Go to <a href='https://app.bkper.com' target='_blank'>bkper.com</a> and open report wizard: <img src='http://about.bkper.com/img/wizard.png'/> to learn more about query sintax.
  * 
  * @param {string} query The flter query.
  * @return {TransactionsDataTableBuilder} the Transactions list builder.
  * 
  * @example
  * 
  * var book = BkperApp.openById("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
  * 
  * book.createTransactionsDataTable("acc:'Bank' after:8/2013 before:9/2013");
  * ...
  * book.createTransactionsDataTable("after:$m before:$m+1");
  * ...
  * book.createTransactionsDataTable("#gas");
  * 
  * @see Variables
  */
  public createTransactionsDataTable(query: string) {
    var transactionIterator = this.search(query);
    return new TransactionsDataTableBuilder(transactionIterator);
  }

}