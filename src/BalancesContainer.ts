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
   */
  getBalancesReport(): BalancesReport;

  /**
   * The [[Account]] name, [[Group]] name or #hashtag
   */
  getName(): string;

  /**
   * All [[Balances]] of the container
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
   */
  isCredit(): boolean;


  /**
   * The cumulative balance to the date, since the first transaction posted.
   */
  getCumulativeBalance(): number;
  /**
   * The cumulative balance formatted according to [[Book]] decimal format and fraction digits.
   */
  getCumulativeBalanceText(): string;


  /**
   * The cumulative checked balance to the date, since the first transaction posted.
   */
  getCheckedCumulativeBalance(): number;
  /**
   * The cumulative checked balance formatted according to [[Book]] decimal format and fraction digits.
   */
  getCheckedCumulativeBalanceText(): string;


  /**
   * The cumulative unchecked balance to the date, since the first transaction posted.
   */
  getUncheckedCumulativeBalance(): number;
  /**
   * The cumulative unchecked balance formatted according to [[Book]] decimal format and fraction digits.
   */
  getUncheckedCumulativeBalanceText(): string;


  /**
   * The balance on the date period.
   */
  getPeriodBalance(): number;
  /**
   * The balance on the date period formatted according to [[Book]] decimal format and fraction digits
   */
  getPeriodBalanceText(): string;


  /**
   * The checked balance on the date period.
   */
  getCheckedPeriodBalance(): number;
  /**
   * The checked balance on the date period formatted according to [[Book]] decimal format and fraction digits
   */
  getCheckedPeriodBalanceText(): string;


  /**
   * The unchecked balance on the date period.
   */
  getUncheckedPeriodBalance(): number;
  /**
   * The unchecked balance on the date period formatted according to [[Book]] decimal format and fraction digits
   */
  getUncheckedPeriodBalanceText(): string;


  /**
   * Gets all child [[BalancesContainers]].
   * 
   * **NOTE**: Only for Groups balance containers. Accounts and hashtags return empty.
   */
  getBalancesContainers(): BalancesContainer[]

  /**
   * Gets a specific [[BalancesContainer]].
   * 
   * **NOTE**: Only for Groups balance containers. Accounts and hashtags return null.
   */
  getBalancesContainer(name: string): BalancesContainer;

  /**
   * Creates a BalancesDataTableBuilder to generate a two-dimensional array with all [[BalancesContainers]]
   */
  createDataTable(): BalancesDataTableBuilder;
}
//###################### ACCOUNT BALANCE CONTAINER ######################

class AccountBalancesContainer implements BalancesContainer {

  private wrapped: bkper.AccountBalances;
  private balancesReport: BalancesReport;


  constructor(balancesReport: BalancesReport, balancePlain: bkper.AccountBalances) {
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

  public getCumulativeBalance(): number {
    var balance = Utils_.round(this.wrapped.cumulativeBalance, this.balancesReport.getBook().getFractionDigits());
    balance = Utils_.getRepresentativeValue(balance, this.isCredit());
    return balance;
  }
  public getCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
  }

  public getCheckedCumulativeBalance(): number {
    var balance = Utils_.round(this.wrapped.checkedCumulativeBalance, this.balancesReport.getBook().getFractionDigits());
    balance = Utils_.getRepresentativeValue(balance, this.isCredit());
    return balance;
  }
  public getCheckedCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCheckedCumulativeBalance());
  }

  public getUncheckedCumulativeBalance(): number {
    var balance = Utils_.round(this.wrapped.uncheckedCumulativeBalance, this.balancesReport.getBook().getFractionDigits());
    balance = Utils_.getRepresentativeValue(balance, this.isCredit());
    return balance;
  }
  public getUncheckedCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getUncheckedCumulativeBalance());
  }

  public getPeriodBalance(): number {
    var balance = Utils_.round(this.wrapped.periodBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }
  public getPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
  }

  public getCheckedPeriodBalance(): number {
    var balance = Utils_.round(this.wrapped.checkedPeriodBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }
  public getCheckedPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCheckedPeriodBalance());
  }

  public getUncheckedPeriodBalance(): number {
    var balance = Utils_.round(this.wrapped.uncheckedPeriodBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }
  public getUncheckedPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getUncheckedPeriodBalance());
  }


  public getBalances(): Balance[] {
    if (!this.wrapped.balances) {
      return new Array<Balance>();
    }
    return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
  }

  public createDataTable(): BalancesDataTableBuilder {
    return new BalancesDataTableBuilder(this.balancesReport.getBook(), [this], this.balancesReport.getPeriodicity(), this.balancesReport.getBalanceCheckedType());
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

  private wrapped: bkper.TagBalances;
  private balancesReport: BalancesReport;

  constructor(balancesReport: BalancesReport, balancePlain: bkper.TagBalances) {
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


  public getCumulativeBalance(): number {
    return Utils_.round(this.wrapped.cumulativeBalance, this.balancesReport.getBook().getFractionDigits());
  }
  public getCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
  }

  public getCheckedCumulativeBalance(): number {
    return Utils_.round(this.wrapped.checkedCumulativeBalance, this.balancesReport.getBook().getFractionDigits());
  }
  public getCheckedCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCheckedCumulativeBalance());
  }


  public getUncheckedCumulativeBalance(): number {
    return Utils_.round(this.wrapped.uncheckedCumulativeBalance, this.balancesReport.getBook().getFractionDigits());
  }
  public getUncheckedCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getUncheckedCumulativeBalance());
  }


  public getPeriodBalance(): number {
    return Utils_.round(this.wrapped.periodBalance, this.balancesReport.getBook().getFractionDigits());
  }
  public getPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
  }


  public getCheckedPeriodBalance(): number {
    return Utils_.round(this.wrapped.checkedPeriodBalance, this.balancesReport.getBook().getFractionDigits());
  }
  public getCheckedPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCheckedPeriodBalance());
  }


  public getUncheckedPeriodBalance(): number {
    return Utils_.round(this.wrapped.uncheckedPeriodBalance, this.balancesReport.getBook().getFractionDigits());
  }
  public getUncheckedPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getUncheckedPeriodBalance());
  }


  public getBalances(): Balance[] {
    if (!this.wrapped.balances) {
      return new Array<Balance>();
    }    
    return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
  }

  public getBalancesContainers(): BalancesContainer[] {
    return [];
  }

  public getBalancesContainer(name: string): BalancesContainer {
    return null;
  }
  public createDataTable(): BalancesDataTableBuilder {
    return new BalancesDataTableBuilder(this.balancesReport.getBook(), [this], this.balancesReport.getPeriodicity(), this.balancesReport.getBalanceCheckedType());
  }
}







//###################### GROUP BALANCE CONTAINER ######################

class GroupBalancesContainer implements BalancesContainer {

  private wrapped: bkper.GroupBalances
  private accountBalances: AccountBalancesContainer[];
  private periodicity: Periodicity;
  private balanceCheckedType: BalanceCheckedType;

  private balancesReport: BalancesReport;

  constructor(balancesReport: BalancesReport, groupBalancesPlain: bkper.GroupBalances, periodicity: Periodicity, balanceCheckedType: BalanceCheckedType) {
    this.balancesReport = balancesReport;
    this.wrapped = groupBalancesPlain;
    this.periodicity = periodicity;
    this.balanceCheckedType = balanceCheckedType;
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


  public getCumulativeBalance(): number {
    var balance = Utils_.round(this.wrapped.cumulativeBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }
  public getCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
  }


  public getCheckedCumulativeBalance(): number {
    var balance = Utils_.round(this.wrapped.checkedCumulativeBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }
  public getCheckedCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCheckedCumulativeBalance());
  }


  public getUncheckedCumulativeBalance(): number {
    var balance = Utils_.round(this.wrapped.uncheckedCumulativeBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }
  public getUncheckedCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getUncheckedCumulativeBalance());
  }


  public getPeriodBalance(): number {
    var balance = Utils_.round(this.wrapped.periodBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }
  public getPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
  }  


  public getCheckedPeriodBalance(): number {
    var balance = Utils_.round(this.wrapped.checkedPeriodBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }
  public getCheckedPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCheckedPeriodBalance());
  }    

  public getUncheckedPeriodBalance(): number {
    var balance = Utils_.round(this.wrapped.uncheckedPeriodBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }
  public getUncheckedPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getUncheckedPeriodBalance());
  }    
  

  public getBalances(): Balance[] {
    if (!this.wrapped.balances) {
      return new Array<Balance>();
    }    
    return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
  }

  public createDataTable() {
    return new BalancesDataTableBuilder(this.balancesReport.getBook(), this.getBalancesContainers(), this.periodicity, this.balanceCheckedType);
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
