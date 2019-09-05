 //###################### ACCOUNT BALANCE CONTAINER ######################

 class AccountBalancesContainer implements GoogleAppsScript.Bkper.BalancesContainer {
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

  public getBalances(): GoogleAppsScript.Bkper.Balance[] {
    return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
  }

  public createDataTable(): BalancesDataTableBuilder {
    return new BalancesDataTableBuilder(this.balancesReport.getBook(), [this], this.balancesReport.getPeriodicity());
  }

  public getBalancesContainers(): GoogleAppsScript.Bkper.BalancesContainer[] {
    return [];
  }
  public getBalancesContainer(name: string): GoogleAppsScript.Bkper.BalancesContainer {
    return null;
  }
}







//###################### TAG BALANCE CONTAINER ######################

class TagBalancesContainer implements GoogleAppsScript.Bkper.BalancesContainer {

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

  public getBalances(): GoogleAppsScript.Bkper.Balance[] {
    return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
  }

  public getBalancesContainers(): GoogleAppsScript.Bkper.BalancesContainer[] {
    return [];
  }

  public getBalancesContainer(name: string): GoogleAppsScript.Bkper.BalancesContainer {
    return null;
  }
  public createDataTable(): BalancesDataTableBuilder {
    return new BalancesDataTableBuilder(this.balancesReport.getBook(), [this], this.balancesReport.getPeriodicity());
  }   
}







//###################### GROUP BALANCE CONTAINER ######################

class GroupBalancesContainer implements GoogleAppsScript.Bkper.BalancesContainer {

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

  public getBalances(): GoogleAppsScript.Bkper.Balance[] {
    return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
  }


  public createDataTable() {
    return new BalancesDataTableBuilder(this.balancesReport.getBook(), this.getBalancesContainers(), this.periodicity);
  }

  public getBalancesContainers(): GoogleAppsScript.Bkper.BalancesContainer[] {
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
  
  public getBalancesContainer(name: string): GoogleAppsScript.Bkper.BalancesContainer {
    return null;
  }  

}
