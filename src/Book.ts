/**
 * @external
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

  /**
   * @ignore
   */
  constructor(id: string, wrapped?: bkper.BookV2Payload) {
    this.id = id;
    this.wrapped = wrapped;
  }

  /**
   * @inheritdoc
   */
  public getId(): string {
    return this.id;
  }

  /**
   * @inheritdoc
   */
  public getName(): string {
    this.checkBookLoaded_();
    return this.wrapped.name;
  }

  /**
   * @inheritdoc
   */
  public getFractionDigits(): number {
    this.checkBookLoaded_();
    return this.wrapped.fractionDigits;
  }

  /**
   * @inheritdoc
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
   * @inheritdoc
   */
  public getPermission(): Permission {
    this.checkBookLoaded_();
    return this.wrapped.permission;
  }


  /**
   * @ignore
   */
  public getLocale(): string {
    this.checkBookLoaded_();
    return this.wrapped.locale;
  }

  /**
   * @inheritdoc
   */
  public getDatePattern(): string {
    this.checkBookLoaded_();
    return this.wrapped.datePattern;
  }

  /**
   * @inheritdoc
   */
  public getDecimalSeparator(): DecimalSeparator {
    this.checkBookLoaded_();
    return this.wrapped.decimalSeparator as DecimalSeparator;
  }


  /**
   * @inheritdoc
   */
  public getTimeZone(): string {
    this.checkBookLoaded_();
    return this.wrapped.timeZone;
  }

  /**
   * @inheritdoc
   */
  public getTimeZoneOffset(): number {
    this.checkBookLoaded_();
    return this.wrapped.timeZoneOffset;
  }

  /**
   * @inheritdoc
   */
  public getLastUpdateMs(): number {
    this.checkBookLoaded_();
    return +this.wrapped.lastUpdateMs;
  }

  /**
   * @inheritdoc
   */
  public formatDate(date: Date, timeZone?: string): string {
    return Utils_.formatDate(date, this.getDatePattern(), timeZone);
  }

  /**
   * @inheritdoc
   */
  public formatValue(value: number): string {
    return Utils_.formatValue_(value, this.getDecimalSeparator(), this.getFractionDigits());
  }

  /**
   * @inheritdoc
   */
  public record(transactions: string | any[] | any[][], timeZone?: string): void {
    if (timeZone == null || timeZone.trim() == "") {
      Logger.log("Fallback to book timezone!")
      timeZone = this.getTimeZone();
    }
    TransactionService_.record(this, transactions, timeZone);
  }

  /**
   * @inheritdoc
   */
  public continueTransactionIterator(query: string, continuationToken: string): TransactionIterator {
    var transactionIterator = new TransactionIterator(this, query);
    transactionIterator.setContinuationToken(continuationToken);
    return transactionIterator;
  }

  /**
   * @ignore
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


  // private transactionPosted_(transaction: Transaction) {
  //   var creditAccount = this.getAccount(transaction.wrapped.creditAccId);
  //   creditAccount.wrapped.balance = transaction.wrapped.caBal;

  //   var debitAccount = this.getAccount(transaction.wrapped.debitAccId);
  //   debitAccount.wrapped.balance = transaction.wrapped.daBal;
  //   transaction.configure_();
  // }

  /**
   * @inheritdoc
   */
  public getAccounts(): Account[] {
    if (this.accounts == null) {
      this.configureAccounts_(AccountService_.getAccounts(this.getId()));
    }
    return this.accounts;
  }


  /**
   * @inheritdoc
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
   * @inheritdoc
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
   * @inheritdoc
   */
  public getGroups(): Group[] {
    if (this.groups == null) {
      this.configureGroups_(GroupService_.getGroups(this.getId()));
    }
    return this.groups;
  }

  /**
   * @inheritdoc
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

  public getSavedQueries(): { id: string, query: string, title: string }[] {
    if (this.savedQueries == null) {
      this.savedQueries = SavedQueryService_.getSavedQueries(this.getId());
    }
    return this.savedQueries;
  }

  /**
   * @inheritdoc
   */
  public getBalancesReport(query: string): BalancesReport {
    var balances = BalancesService_.getBalances(this.getId(), query);
    return new BalancesReport(this, balances);
  }

  /**
   * @inheritdoc
   */
  public createBalancesDataTable(query: string): BalancesDataTableBuilder {
    var balances = BalancesService_.getBalances(this.getId(), query);
    return new BalancesReport(this, balances).createDataTable();
  }


  /**
   * @inheritdoc
   */
  public createTransactionsDataTable(query?: string): TransactionsDataTableBuilder {
    var transactionIterator = this.getTransactions(query);
    return new TransactionsDataTableBuilder(transactionIterator);
  }

  /**
   * @inheritdoc
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