
/**
 * Class representing a Balance Report, generated when calling [Book.getBalanceReport](#book_getbalancesreport)
 * 
 * @public
 */
class BalancesReport {

  private wrapped: bkper.Balances;

  private book: Book;
  private groupBalancesContainers: GroupBalancesContainer[];
  private accountBalancesContainers: AccountBalancesContainer[];


  constructor(book: Book, balancesReportPlain: bkper.Balances) {
    this.book = book;
    this.wrapped = balancesReportPlain;
    this.groupBalancesContainers = null;
    this.accountBalancesContainers = null;
  }

  /**
   * The [[Book]] that generated the report.
   */
  public getBook(): Book {
    return this.book;
  }

  /**
   * Creates a BalancesDataTableBuilder to generate a two-dimensional array with all [[BalancesContainers]].
   */
  public createDataTable(): BalancesDataTableBuilder {
    return new BalancesDataTableBuilder(this.book, this.getBalancesContainers(), this.getPeriodicity());
  }

  /**
   * Gets all [[BalancesContainers]] of the report.
   */
  public getBalancesContainers(): BalancesContainer[] {
    var containers = new Array<BalancesContainer>();
    if (this.getAccountBalancesContainers() != null) {
      containers = containers.concat(this.getAccountBalancesContainers());
    }
    if (this.getGroupBalancesContainers() != null) {
      containers = containers.concat(this.getGroupBalancesContainers());
    }
    return containers;
  }


  /**
   * The [[Periodicity]] of the query used to generate the report.
   */
  public getPeriodicity(): Periodicity {
    return this.wrapped.periodicity as Periodicity;
  }

  /**
   * Check if the report has only one Group specified on query.
   */
  public hasOnlyOneGroup(): boolean {
    return this.getGroupBalancesContainers() != null && this.getGroupBalancesContainers().length == 1;
  }

  private getAccountBalancesContainers(): AccountBalancesContainer[] {
    if (this.accountBalancesContainers == null && this.wrapped.accountBalances != null) {
      this.accountBalancesContainers = [];
      for (var i = 0; i < this.wrapped.accountBalances.length; i++) {
        var accountBalance = this.wrapped.accountBalances[i];
        var accountBalancesReport = new AccountBalancesContainer(null, this, accountBalance);
        this.accountBalancesContainers.push(accountBalancesReport);
      }
    }
    return this.accountBalancesContainers;
  }


  private getGroupBalancesContainers(): GroupBalancesContainer[] {
    if (this.groupBalancesContainers == null && this.wrapped.groupBalances != null) {
      this.groupBalancesContainers = [];
      for (var i = 0; i < this.wrapped.groupBalances.length; i++) {
        var grouBalances = this.wrapped.groupBalances[i];
        var accGroupBalances = new GroupBalancesContainer(null, this, grouBalances);
        this.groupBalancesContainers.push(accGroupBalances);
      }
    }
    return this.groupBalancesContainers;
  }

  /**
   * Gets a specific [[BalancesContainers]].
   * 
   * @param name The [[Account]] name, [[Group]] name or #hashtag.
   */
  public getBalancesContainer(groupName: string): BalancesContainer {
    var groupBalances = this.getBalancesContainers();
    if (groupBalances == null) {
      return null;
    }

    for (var i = 0; i < groupBalances.length; i++) {
      if (groupName == groupBalances[i].getName()) {
        return groupBalances[i];
      }
    }
  }

}