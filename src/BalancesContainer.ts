/**
 * The container of balances of an [[Account]], [[Group]] or #hashtag
 * 
 * The container is composed of a list of [[Balances]] for a window of time, as well as its period and cumulative totals.
 * 
 * @public
 */
interface BalancesContainer {

  /**
   * The parent BalancesReport of the container
   * 
   * @public
   */
  getBalancesReport(): BalancesReport;

  /**
   * The [[Account]] name, [[Group]] name or #hashtag
   * 
   * @public
   */
  getName(): string;

  /**
   * All [[Balances]] of the container
   * 
   * @public
   */
  getBalances(): Balance[];

  /**
   * Gets the credit nature of the BalancesContainer, based on [[Account]], [[Group]] or #hashtag this container represents.
   * 
   * For [[Account]], the credit nature will be the same as the one from the Account
   * 
   * For [[Group]], the credit nature will be the same, if all accounts containing on it has the same credit nature. False if mixed.
   * 
   * For #hashtag, the credit nature will be true.
   * 
   * @public
   */
  isCredit(): boolean;

  /**
   * The cumulative balance to the date, since the first transaction posted.
   * 
   * @public
   */
  getCumulativeBalance(): number;

  /**
   * The cumulative balance formatted according to [[Book]] decimal format and fraction digits.
   * 
   * @public
   */
  getCumulativeBalanceText(): string;

  /**
   * The balance on the date period.
   * 
   * @public
   */
  getPeriodBalance(): number;

  /**
   * The balance on the date period formatted according to [[Book]] decimal format and fraction digits
   * 
   * @public
   */
  getPeriodBalanceText(): string;

  /**
   * Gets all child [[BalancesContainers]].
   * 
   * **NOTE**: Only for Groups balance containers. Accounts and hashtags return empty.
   * 
   * @public
   */
  getBalancesContainers(): BalancesContainer[]

  /**
   * Gets a specific [[BalancesContainer]].
   * 
   * **NOTE**: Only for Groups balance containers. Accounts and hashtags return null.
   * 
   * @public
   */
  getBalancesContainer(name: string): BalancesContainer;

  /**
   * Creates a BalancesDataTableBuilder to generate a two-dimensional array with all [[BalancesContainers]]
   * 
   * @public
   */
  createDataTable(): BalancesDataTableBuilder;
}
//###################### ACCOUNT BALANCE CONTAINER ######################

class AccountBalancesContainer implements BalancesContainer {
  private wrapped: bkper.AccountBalancesV2Payload;
  private balancesReport: BalancesReport;


  constructor(balancesReport: BalancesReport, balancePlain: bkper.AccountBalancesV2Payload) {
    this.balancesReport = balancesReport
    this.wrapped = balancePlain;
  }

  public getBalancesReport(): BalancesReport {
    return this.balancesReport;
  }

  public getName(): string {
    return this.wrapped.name;
  }

  public isCredit() {
    return this.wrapped.credit;
  }

  public getPeriodBalance(): number {
    var balance = Utils_.round(this.wrapped.periodBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }

  public getPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
  }

  public getCumulativeBalance(): number {
    var balance = Utils_.round(this.wrapped.cumulativeBalance, this.balancesReport.getBook().getFractionDigits());
    balance = Utils_.getRepresentativeValue(balance, this.isCredit());
    return balance;
  }

  public getCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
  }

  public getBalances(): Balance[] {
    return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
  }

  public createDataTable(): BalancesDataTableBuilder {
    return new BalancesDataTableBuilder(this.balancesReport.getBook(), [this], this.balancesReport.getPeriodicity());
  }

  public getBalancesContainers(): BalancesContainer[] {
    return [];
  }
  public getBalancesContainer(name: string): BalancesContainer {
    return null;
  }
}






//###################### TAG BALANCE CONTAINER ######################

class TagBalancesContainer implements BalancesContainer {

  private wrapped: bkper.TagBalancesV2Payload;
  private balancesReport: BalancesReport;

  constructor(balancesReport: BalancesReport, balancePlain: bkper.TagBalancesV2Payload) {
    this.balancesReport = balancesReport;
    this.wrapped = balancePlain;
  }

  public getBalancesReport(): BalancesReport {
    return this.balancesReport;
  }

  public getName(): string {
    return this.wrapped.name;
  }

  public isCredit(): boolean {
    return true;
  }

  public getPeriodBalance(): number {
    return Utils_.round(this.wrapped.periodBalance, this.balancesReport.getBook().getFractionDigits());
  }

  public getPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
  }

  public getCumulativeBalance(): number {
    return Utils_.round(this.wrapped.cumulativeBalance, this.balancesReport.getBook().getFractionDigits());
  }

  public getCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
  }

  public getBalances(): Balance[] {
    return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
  }

  public getBalancesContainers(): BalancesContainer[] {
    return [];
  }

  public getBalancesContainer(name: string): BalancesContainer {
    return null;
  }
  public createDataTable(): BalancesDataTableBuilder {
    return new BalancesDataTableBuilder(this.balancesReport.getBook(), [this], this.balancesReport.getPeriodicity());
  }
}







//###################### GROUP BALANCE CONTAINER ######################

class GroupBalancesContainer implements BalancesContainer {

  private wrapped: bkper.GroupBalancesV2Payload
  private accountBalances: AccountBalancesContainer[];
  private periodicity: Periodicity;

  private balancesReport: BalancesReport;

  constructor(balancesReport: BalancesReport, groupBalancesPlain: bkper.GroupBalancesV2Payload, periodicity: Periodicity) {
    this.balancesReport = balancesReport;
    this.wrapped = groupBalancesPlain;
    this.periodicity = periodicity;
  }

  public getBalancesReport(): BalancesReport {
    return this.balancesReport;
  }

  public getName(): string {
    return this.wrapped.name;
  }

  public isCredit(): boolean {
    return this.wrapped.credit;
  }

  public getPeriodBalance(): number {
    var balance = Utils_.round(this.wrapped.periodBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }

  public getPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
  }

  public getCumulativeBalance(): number {
    var balance = Utils_.round(this.wrapped.cumulativeBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }

  public getCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
  }

  public getBalances(): Balance[] {
    return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
  }

  public createDataTable() {
    return new BalancesDataTableBuilder(this.balancesReport.getBook(), this.getBalancesContainers(), this.periodicity);
  }

  public getBalancesContainers(): BalancesContainer[] {
    var accountBalances = this.wrapped.accountBalances;
    if (this.accountBalances == null && accountBalances != null) {
      this.accountBalances = [];
      for (var i = 0; i < accountBalances.length; i++) {
        var accountBalance = accountBalances[i];
        var accBalances = new AccountBalancesContainer(this.balancesReport, accountBalance);
        this.accountBalances.push(accBalances);
      }
    }
    return this.accountBalances;
  }

  public getBalancesContainer(name: string): BalancesContainer {
    return null;
  }

}
