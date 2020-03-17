/**
 *
 * A Book represents [General Ledger](https://en.wikipedia.org/wiki/General_ledger) for a company or business, but can also represent a [Ledger](https://en.wikipedia.org/wiki/Ledger) for a project or department
 *
 * It contains all [[Accounts]] where [[Transactions]] are recorded/posted;
 * 
 * @public
 */
class Book {

  private id: string
  private wrapped: bkper.BookV2Payload
  private accounts: Account[];
  private groups: Group[];
  private idAccountMap: any;
  private nameAccountMap: any;
  private idGroupMap: any;
  private nameGroupMap: any;
  private savedQueries: bkper.SavedQueryV2Payload[];
  

  constructor(id: string, wrapped?: bkper.BookV2Payload) {
    this.id = id;
    this.wrapped = wrapped;
  }

  /**
   * Same as bookId param
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
   * @return The number of fraction digits (decimal places) supported by this Book
   */
  public getFractionDigits(): number {
    this.checkBookLoaded_();
    return this.wrapped.fractionDigits;
  }

  /**
   * @return The name of the owner of the Book
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
   * @return The permission for the current user
   */
  public getPermission(): Permission {
    this.checkBookLoaded_();
    return this.wrapped.permission;
  }


  /**
   * @deprecated
   */
  public getLocale(): string {
    this.checkBookLoaded_();
    return this.wrapped.locale;
  }

  /**
   * @return The date pattern of the Book. Example: dd/MM/yyyy
   */
  public getDatePattern(): string {
    this.checkBookLoaded_();
    return this.wrapped.datePattern;
  }

  /**
   * @return The decimal separator of the Book
   */
  public getDecimalSeparator(): DecimalSeparator {
    this.checkBookLoaded_();
    return this.wrapped.decimalSeparator as DecimalSeparator;
  }


  /**
   * @return The time zone of the book
   */
  public getTimeZone(): string {
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
  public getLastUpdateMs(): number {
    this.checkBookLoaded_();
    return +this.wrapped.lastUpdateMs;
  }


  /**
   * Gets the custom properties stored in this Book
   */  
  public getProperties(): any {
    this.checkBookLoaded_();
    return this.wrapped.properties;
  }

  /**
   * Gets the property value for a given key
   * 
   * @param key The property key
   */
  public getProperty(key: string): string {
    this.checkBookLoaded_();
    return this.wrapped.properties[key];
  }  


  /**
   * @param  date The date to format as string.
   * @param  timeZone The output timezone of the result. Default to script's timeZone
   * 
   * @return The date formated according to date pattern of book
   */
  public formatDate(date: Date, timeZone?: string): string {
    return Utils_.formatDate(date, this.getDatePattern(), timeZone);
  }

  /**
   * @param value The value to be formatted.
   * 
   * @return The value formated according to [[DecimalSeparator]] and fraction digits of Book
   */
  public formatValue(value: number): string {
    return Utils_.formatValue_(value, this.getDecimalSeparator(), this.getFractionDigits());
  }

  /**
   * Record [[Transactions]] a on the Book. 
   * 
   * The text is usually amount and description, but it can also can contain an informed Date in full format (dd/mm/yyyy - mm/dd/yyyy).
   * 
   * Example: 
   * ```js
   * book.record("#gas 63.23");
   * ```
   * 
   * @param transactions The text/array/matrix containing transaction records, one per line/row. Each line/row records one transaction.
   * @param timeZone The time zone to format dates.
   */
  public record(transactions: string | any[] | any[][], timeZone?: string): void {
    if (timeZone == null || timeZone.trim() == "") {
      timeZone = this.getTimeZone();
    }
    TransactionService_.record(this, transactions, timeZone);
  }

  /**
   * Resumes a transaction iteration using a continuation token from a previous iterator.
   * 
   * @param continuationToken continuation token from a previous transaction iterator
   * 
   * @return a collection of transactions that remained in a previous iterator when the continuation token was generated
   */
  public continueTransactionIterator(query: string, continuationToken: string): TransactionIterator {
    var transactionIterator = new TransactionIterator(this, query);
    transactionIterator.setContinuationToken(continuationToken);
    return transactionIterator;
  }


  configureTransactions_(transactions: Transaction[]) {
    for (var i = 0; i < transactions.length; i++) {
      this.configureTransaction_(transactions[i]);
    }
    return transactions;
  }


  private configureTransaction_(transaction: Transaction) {
    transaction.book = this;
    transaction.configure_();
    return transaction;
  }


  // private transactionPosted_(transaction: Transaction) {
  //   var creditAccount = this.getAccount(transaction.wrapped.creditAccId);
  //   creditAccount.wrapped.balance = transaction.wrapped.caBal;

  //   var debitAccount = this.getAccount(transaction.wrapped.debitAccId);
  //   debitAccount.wrapped.balance = transaction.wrapped.daBal;
  //   transaction.configure_();
  // }

  /**
   * Gets all [[Accounts]] of this Book
   */
  public getAccounts(): Account[] {
    if (this.accounts == null) {
      this.configureAccounts_(AccountService_.getAccounts(this.getId()));
    }
    return this.accounts;
  }


  /**
   * Gets an [[Account]] object
   * 
   * @param idOrName The id or name of the Account
   * 
   * @returns The matching Account object
   */
  public getAccount(idOrName: string): Account {

    if (idOrName == null) {
      return null;
    }

    if (this.accounts == null) {
      this.getAccounts();
    }

    var account = this.idAccountMap[idOrName];
    if (account == null) {
      var normalizedIdOfName = normalizeName(idOrName);
      account = this.nameAccountMap[normalizedIdOfName];
    }

    return account;
  }

  /**
   * Create an [[Account]] in this book. 
   * 
   * The type of account will be determined by the type of others Accounts in same group. 
   * 
   * If not specified, the type ASSET (permanent=true/credit=false) will be set.
   * 
   * If all other accounts in same group is in another group, the account will also be added to the other group.
   * 
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
   * Gets all [[Groups]] of this Book
   */
  public getGroups(): Group[] {
    if (this.groups == null) {
      this.configureGroups_(GroupService_.getGroups(this.getId()));
    }
    return this.groups;
  }

  /**
   * Gets a [[Group]] object
   * 
   * @param idOrName The id or name of the Group
   * 
   * @returns The matching Group object
   */
  public getGroup(idOrName: string): Group {

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

  private configureGroups_(groups: Group[]): void {
    this.groups = groups;
    this.idGroupMap = new Object();
    this.nameGroupMap = new Object();
    for (var i = 0; i < this.groups.length; i++) {
      var group = this.groups[i];
      group.book = this;
      this.idGroupMap[group.getId()] = group;
      this.nameGroupMap[normalizeName(group.getName())] = group;
    }
  }

  /**
   * Gets all saved queries from this book
   */
  public getSavedQueries(): { id: string, query: string, title: string }[] {
    if (this.savedQueries == null) {
      this.savedQueries = SavedQueryService_.getSavedQueries(this.getId());
    }
    return this.savedQueries;
  }

  /**
   * 
   * Create a [[BalancesReport]] based on query
   * 
   * @param query The balances report query
   */
  public getBalancesReport(query: string): BalancesReport {
    var balances = BalancesService_.getBalances(this.getId(), query);
    return new BalancesReport(this, balances);
  }

  /**
   * Create a [[BalancesDataTableBuilder]] based on a query, to create two dimensional Array representation of balances of [[Account]], [[Group]] or #hashtag
   * 
   * See [Query Guide](https://help.bkper.com/en/articles/2569178-search-query-guide) to learn more
   * 
   * @param query The balances report query
   * 
   * @return The balances data table builder
   * 
   * Example:
   * 
   * ```js
   * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
   * 
   * var balancesDataTable = book.createBalancesDataTable("#rental #energy after:8/2013 before:9/2013").build();
   * ```
   */
  public createBalancesDataTable(query: string): BalancesDataTableBuilder {
    var balances = BalancesService_.getBalances(this.getId(), query);
    return new BalancesReport(this, balances).createDataTable();
  }


  /**
   * Create a [[TransactionsDataTableBuilder]] based on a query, to create two dimensional Array representations of [[Transactions]] dataset.
   * 
   * See [Query Guide](https://help.bkper.com/en/articles/2569178-search-query-guide) to learn more
   * 
   * @param query The flter query.
   * 
   * @return Transactions data table builder.
   * 
   * Example: 
   * 
   * ```js
   * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
   * 
   * var transactionsDataTable = book.createTransactionsDataTable("account:'Bank' after:8/2013 before:9/2013").build();
   * ```
   */
  public createTransactionsDataTable(query?: string): TransactionsDataTableBuilder {
    var transactionIterator = this.getTransactions(query);
    return new TransactionsDataTableBuilder(transactionIterator);
  }

  /**
   * Get Book transactions based on a query.
   * 
   * See [Query Guide](https://help.bkper.com/en/articles/2569178-search-query-guide) to learn more
   *  
   * @param query The query string.
   * 
   * @return The Transactions result as an iterator.
   * 
   * Example:
   * 
   * ```js
   * var book = BkperApp.loadBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
   *
   * var transactions = book.getTransactions("account:CreditCard after:28/01/2013 before:29/01/2013");
   *
   * while (transactions.hasNext()) {
   *  var transaction = transactions.next();
   *  Logger.log(transaction.getDescription());
   * }
   * ```
   */
  public getTransactions(query?: string): TransactionIterator {
    return new TransactionIterator(this, query);
  }








  //DEPRECATED
  /**
   * @deprecated
   */
  public getBalanceReport(query: string): BalancesReport {
    return this.getBalancesReport(query);
  }

  /**
   * @deprecated
   */
  public search(query?: string): TransactionIterator {
    return this.getTransactions(query);
  }

}