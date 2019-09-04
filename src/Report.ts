
/**
 * @ignore
 */
namespace Report {


  export interface BalanceContainerReport {
    getName(): string
    getBalances(): bkper.BalanceV2Payload[]
    isCredit(): boolean
    getCumulativeBalance(): number
    getCumulativeBalanceText(): string
    getPeriodBalance(): number
    getPeriodBalanceText(): string
  }

  export class BalanceReport {

    private wrapped: bkper.BalancesV2Payload;
    private decimalSeparator: DecimalSeparator;
    private datePattern: string;
    private fractionDigits: number;
    private offsetInMinutes: number;
    private timeZone: string;
    private groupBalanceReports: GroupBalanceReport[];
    private accountBalanceReports: AccountBalanceReport[];
    private tagBalanceReports: TagBalanceReport[];


    constructor(balanceReportPlain: bkper.BalancesV2Payload, decimalSeparator: DecimalSeparator, datePattern: string, fractionDigits: number, offsetInMinutes: number, timeZone: string) {
      this.wrapped = balanceReportPlain;
      this.groupBalanceReports = null;
      this.accountBalanceReports = null;
      this.tagBalanceReports = null;

      this.decimalSeparator = decimalSeparator;
      this.datePattern = datePattern;
      this.fractionDigits = fractionDigits;
      this.offsetInMinutes = offsetInMinutes;
      this.timeZone = timeZone;
    }

    public createDataTable(): BalancesDataTableBuilder {
      var dataTable = new Array();
      if (this.getAccountBalanceReports() != null) {
        dataTable = dataTable.concat(this.getAccountBalanceReports());
      }
      if (this.getTagBalanceReports() != null) {
        dataTable = dataTable.concat(this.getTagBalanceReports());
      }
      if (this.getGroupBalanceReports() != null) {
        dataTable = dataTable.concat(this.getGroupBalanceReports());
      }

      return new BalancesDataTableBuilder(dataTable, this.getPeriodicity(), this.decimalSeparator, this.datePattern, this.fractionDigits, this.offsetInMinutes, this.timeZone);
    }


    public getPeriodicity(): Periodicity {
      return this.wrapped.periodicity;
    }

    public hasOnlyOneGroupBalance(): boolean {
      return this.getGroupBalanceReports() != null && this.getGroupBalanceReports().length == 1;
    }

    public getAccountBalanceReports(): AccountBalanceReport[] {
      if (this.accountBalanceReports == null && this.wrapped.accountBalances != null) {
        this.accountBalanceReports = [];
        for (var i = 0; i < this.wrapped.accountBalances.length; i++) {
          var accountBalance = this.wrapped.accountBalances[i];
          var accountBalanceReport = new Report.AccountBalanceReport(accountBalance, this.decimalSeparator, this.fractionDigits);
          this.accountBalanceReports.push(accountBalanceReport);
        }
      }
      return this.accountBalanceReports;
    }

    public getTagBalanceReports(): TagBalanceReport[] {
      if (this.tagBalanceReports == null && this.wrapped.tagBalances != null) {
        this.tagBalanceReports = [];
        for (var i = 0; i < this.wrapped.tagBalances.length; i++) {
          var tagBalance = this.wrapped.tagBalances[i];
          var tagBalanceReport = new Report.TagBalanceReport(tagBalance, this.decimalSeparator, this.fractionDigits);
          this.tagBalanceReports.push(tagBalanceReport);
        }
      }
      return this.tagBalanceReports;
    }


    public getGroupBalanceReports(): GroupBalanceReport[] {
      if (this.groupBalanceReports == null && this.wrapped.groupBalances != null) {
        this.groupBalanceReports = [];
        for (var i = 0; i < this.wrapped.groupBalances.length; i++) {
          var grouBalances = this.wrapped.groupBalances[i];
          var accGroupBalances = new GroupBalanceReport(grouBalances, this.getPeriodicity(), this.decimalSeparator, this.datePattern, this.fractionDigits, this.offsetInMinutes, this.timeZone);
          this.groupBalanceReports.push(accGroupBalances);
        }
      }
      return this.groupBalanceReports;
    }

    public getGroupBalanceReport(groupName: string): GroupBalanceReport {
      var groupBalances = this.getGroupBalanceReports();
      if (groupBalances == null) {
        return null;
      }

      for (var i = 0; i < groupBalances.length; i++) {
        if (groupName == groupBalances[i].getName()) {
          return groupBalances[i];
        }
      }
    }

    public getBalanceReportPlain(): bkper.BalancesV2Payload {
      return this.wrapped;
    }
  }


  //###################### ACCOUNT BALANCE REPORT ######################


  export class AccountBalanceReport implements BalanceContainerReport {
    private wrapped: bkper.AccountBalancesV2Payload;
    private decimalSeparator: DecimalSeparator;
    private fractionDigits: number;

    constructor(balancePlain: bkper.AccountBalancesV2Payload, decimalSeparator: DecimalSeparator, fractionDigits: number) {
      this.wrapped = balancePlain;
      this.decimalSeparator = decimalSeparator;
      this.fractionDigits = fractionDigits;
    }

    public getName(): string {
      return this.wrapped.name;
    }

    public isCredit() {
      return this.wrapped.credit;
    }

    public getPeriodBalance(): number {
      var balance = Utils_.round(this.wrapped.periodBalance, this.fractionDigits);
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }

    public getPeriodBalanceText(): string {
      return Utils_.formatValue_(this.getPeriodBalance(), this.decimalSeparator, this.fractionDigits)
    }

    public getCumulativeBalance(): number {
      var balance = Utils_.round(this.wrapped.cumulativeBalance, this.fractionDigits);
      balance = Utils_.getRepresentativeValue(balance, this.isCredit());
      return balance;
    }

    public getCumulativeBalanceText(): string {
      return Utils_.formatValue_(this.getCumulativeBalance(), this.decimalSeparator, this.fractionDigits);
    }

    public getBalances(): bkper.BalanceV2Payload[] {
      return this.wrapped.balances;
    }
  }




  //###################### TAG BALANCE REPORT ######################

  export class TagBalanceReport implements BalanceContainerReport {

    private wrapped: bkper.TagBalancesV2Payload;
    private decimalSeparator: DecimalSeparator;
    private fractionDigits: number;

    constructor(balancePlain: bkper.TagBalancesV2Payload, decimalSeparator: DecimalSeparator, fractionDigits: number) {
      this.wrapped = balancePlain;
      this.decimalSeparator = decimalSeparator;
      this.fractionDigits = fractionDigits;
    }

    public getName(): string {
      return this.wrapped.name;
    }

    public isCredit(): boolean {
      return true;
    }

    public getPeriodBalance(): number {
      return Utils_.round(this.wrapped.periodBalance, this.fractionDigits);
    }

    public getPeriodBalanceText(): string {
      return Utils_.formatValue_(this.getPeriodBalance(), this.decimalSeparator, this.fractionDigits)
    }

    public getCumulativeBalance(): number {
      return Utils_.round(this.wrapped.cumulativeBalance, this.fractionDigits);
    }

    public getCumulativeBalanceText(): string {
      return Utils_.formatValue_(this.getCumulativeBalance(), this.decimalSeparator, this.fractionDigits)
    }

    public getBalances(): bkper.BalanceV2Payload[] {
      return this.wrapped.balances;
    }
  }


  //###################### GROUP BALANCE REPORT ######################

  export class GroupBalanceReport implements BalanceContainerReport {

    private wrapped: bkper.GroupBalancesV2Payload
    private decimalSeparator: DecimalSeparator;
    private fractionDigits: number;
    private periodicity: Periodicity;
    private accountBalanceReports: AccountBalanceReport[];
    private timeZone: string;
    private datePattern: string;
    private offsetInMinutes: number;

    constructor(groupBalancesPlain: bkper.GroupBalancesV2Payload, periodicity: Periodicity, decimalSeparator: DecimalSeparator, datePattern: string, fractionDigits: number, offsetInMinutes: number, timeZone: string) {
      this.wrapped = groupBalancesPlain;
      this.periodicity = periodicity;
      this.datePattern = datePattern;
      this.offsetInMinutes = offsetInMinutes;
      this.decimalSeparator = decimalSeparator;
      this.fractionDigits = fractionDigits;
      this.timeZone = timeZone;
    }

    public getName(): string {
      return this.wrapped.name;
    }

    public isCredit(): boolean {
      return this.wrapped.credit;
    }

    public getPeriodBalance(): number {
      var balance = Utils_.round(this.wrapped.periodBalance, this.fractionDigits);
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }

    public getPeriodBalanceText(): string {
      return Utils_.formatValue_(this.getPeriodBalance(), this.decimalSeparator, this.fractionDigits)
    }

    public getCumulativeBalance(): number {
      var balance = Utils_.round(this.wrapped.cumulativeBalance, this.fractionDigits);
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }

    public getCumulativeBalanceText(): string {
      return Utils_.formatValue_(this.getCumulativeBalance(), this.decimalSeparator, this.fractionDigits)
    }

    public getBalances(): bkper.GroupBalancesV2Payload[] {
      return this.wrapped.balances;
    }


    public createDataTable() {
      return new BalancesDataTableBuilder(this.getAccountBalanceReports(), this.periodicity, this.decimalSeparator, this.datePattern, this.fractionDigits, this.offsetInMinutes, this.timeZone);
    }

    public getAccountBalanceReports(): AccountBalanceReport[] {
      var accountBalances = this.wrapped.accountBalances;
      if (this.accountBalanceReports == null && accountBalances != null) {
        this.accountBalanceReports = [];
        for (var i = 0; i < accountBalances.length; i++) {
          var accountBalance = accountBalances[i];
          var accBalances = new AccountBalanceReport(accountBalance, this.decimalSeparator, this.fractionDigits);
          this.accountBalanceReports.push(accBalances);
        }
      }
      return this.accountBalanceReports;
    }
  }
}
