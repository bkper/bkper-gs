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
   * The cumulative balance to the date.
   */
  getCumulativeBalance(): Amount;

  /**
   * The cumulative credit to the date.
   */
  getCumulativeCredit(): Amount;

  /**
   * The cumulative debit to the date.
   */
  getCumulativeDebit(): Amount;

  /**
   * The cumulative balance formatted according to [[Book]] decimal format and fraction digits.
   */
  getCumulativeBalanceText(): string;

  /**
   * The cumulative credit formatted according to [[Book]] decimal format and fraction digits.
   */
  getCumulativeCreditText(): string;

  /**
   * The cumulative credit formatted according to [[Book]] decimal format and fraction digits.
   */
  getCumulativeDebitText(): string;


  /**
   * The balance on the date period.
   */
  getPeriodBalance(): Amount;

  /**
   * The credit on the date period.
   */
  getPeriodCredit(): Amount;

  /**
   * The debit on the date period.
   */
  getPeriodDebit(): Amount;

  /**
   * The balance on the date period formatted according to [[Book]] decimal format and fraction digits
   */
  getPeriodBalanceText(): string;

  /**
   * The credit on the date period formatted according to [[Book]] decimal format and fraction digits
   */
  getPeriodCreditText(): string;

  /**
   * The debit on the date period formatted according to [[Book]] decimal format and fraction digits
   */
  getPeriodDebitText(): string;


  /**
   * Gets all child [[BalancesContainers]].
   * 
   * **NOTE**: Only for Group balance containers. Accounts returns null.
   */
  getBalancesContainers(): BalancesContainer[]

  /**
   * Gets a specific [[BalancesContainer]].
   * 
   * **NOTE**: Only for Group balance containers. Accounts returns null.
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

  public getCumulativeBalance(): Amount {
    var balance = Utils_.round(this.wrapped.cumulativeBalance, this.balancesReport.getBook().getFractionDigits());
    balance = Utils_.getRepresentativeValue(balance, this.isCredit());
    return balance;
  }

  public getCumulativeCredit(): Amount {
    var balance = Utils_.round(this.wrapped.cumulativeCredit, this.balancesReport.getBook().getFractionDigits());
    return balance;
  }

  public getCumulativeDebit(): Amount {
    var balance = Utils_.round(this.wrapped.cumulativeDebit, this.balancesReport.getBook().getFractionDigits());
    return balance;
  }
  
  public getCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
  }
  public getCumulativeCreditText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeCredit());
  }
  public getCumulativeDebitText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeDebit());
  }


  public getPeriodBalance(): Amount {
    var balance = Utils_.round(this.wrapped.periodBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }
  public getPeriodCredit(): Amount {
    var balance = Utils_.round(this.wrapped.periodCredit, this.balancesReport.getBook().getFractionDigits());
    return balance;
  }
  public getPeriodDebit(): Amount {
    var balance = Utils_.round(this.wrapped.periodDebit, this.balancesReport.getBook().getFractionDigits());
    return balance;
  }

  public getPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
  }
  public getPeriodCreditText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodCredit());
  }
  public getPeriodDebitText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodDebit());
  }

  public getBalances(): Balance[] {
    if (!this.wrapped.balances) {
      return new Array<Balance>();
    }
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



//###################### GROUP BALANCE CONTAINER ######################

class GroupBalancesContainer implements BalancesContainer {

  private wrapped: bkper.GroupBalances
  private accountBalances: AccountBalancesContainer[];
  private periodicity: Periodicity;

  private balancesReport: BalancesReport;

  constructor(balancesReport: BalancesReport, groupBalancesPlain: bkper.GroupBalances, periodicity: Periodicity) {
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



  public getCumulativeBalance(): Amount {
    var balance = Utils_.round(this.wrapped.cumulativeBalance, this.balancesReport.getBook().getFractionDigits());
    balance = Utils_.getRepresentativeValue(balance, this.isCredit());
    return balance;
  }

  public getCumulativeCredit(): Amount {
    var balance = Utils_.round(this.wrapped.cumulativeCredit, this.balancesReport.getBook().getFractionDigits());
    return balance;
  }

  public getCumulativeDebit(): Amount {
    var balance = Utils_.round(this.wrapped.cumulativeDebit, this.balancesReport.getBook().getFractionDigits());
    return balance;
  }
  
  public getCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
  }
  public getCumulativeCreditText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeCredit());
  }
  public getCumulativeDebitText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeDebit());
  }


  public getPeriodBalance(): Amount {
    var balance = Utils_.round(this.wrapped.periodBalance, this.balancesReport.getBook().getFractionDigits());
    return Utils_.getRepresentativeValue(balance, this.isCredit());
  }
  public getPeriodCredit(): Amount {
    var balance = Utils_.round(this.wrapped.periodCredit, this.balancesReport.getBook().getFractionDigits());
    return balance;
  }
  public getPeriodDebit(): Amount {
    var balance = Utils_.round(this.wrapped.periodDebit, this.balancesReport.getBook().getFractionDigits());
    return balance;
  }

  public getPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
  }
  public getPeriodCreditText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodCredit());
  }
  public getPeriodDebitText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodDebit());
  }

  public getBalances(): Balance[] {
    if (!this.wrapped.balances) {
      return new Array<Balance>();
    }
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
