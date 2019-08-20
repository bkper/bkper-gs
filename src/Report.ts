namespace Report {

  export interface BalanceContainerReport {
    getName(): string
    getBalances(): Bkper.BalanceV2Payload[]
    isCredit(): boolean
    getCumulativeBalance(): number
    getCumulativeBalanceText(): string
    getPeriodBalance(): number
    getPeriodBalanceText(): string
  }

  /**
  * @class
  * @classdesc A BalanceReport stores the balances based on an query.
  * @param {Array} balanceReportPlain balances wrapped array
  * @param {DecimalSeparator} decimalSeparator {@link Book#getDecimalSeparator|decimal separator of book}
  * @param {FractionDigits} fractionDigits {@link Book#getFractionDigits|Fraction digits of book}
  */
  export class BalanceReport {

    private wrapped: Bkper.BalancesV2Payload;
    private decimalSeparator: Enums.DecimalSeparator;
    private datePattern: string;
    private fractionDigits: number;
    private offsetInMinutes: number;
    private timeZone: string;
    private groupBalanceReports: GroupBalanceReport[];
    private accountBalanceReports: AccountBalanceReport[];
    private tagBalanceReports: TagBalanceReport[];

    constructor(balanceReportPlain: Bkper.BalancesV2Payload, decimalSeparator: Enums.DecimalSeparator, datePattern: string, fractionDigits: number, offsetInMinutes: number, timeZone: string) {
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

    /**
    * @returns The balance periodicity.
    */
    public getPeriodicity(): Enums.Periodicity {
      return this.wrapped.periodicity;
    }

    /**
    * @returns Check if {@link Report.BalanceReport|report} has only one group balance.
    */
    public hasOnlyOneGroupBalance(): boolean {
      return this.getGroupBalanceReports() != null && this.getGroupBalanceReports().length == 1;
    }

    /**
    * @returns All {@link Report.AccountBalanceReport|account balances} of this query
    */
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

    /**
    * @returns All {@link Report.TagBalanceReport|hashtags balances} of this query
    */
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

    /**
    * @returns All {@link Report.GroupBalanceReport|group balances} of this query
    */
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

    /**
    * @returns A specific {@link Report.GroupBalanceReport} of this query
  	* @param groupName The name of the group filtered on query
    */
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

    public getBalanceReportPlain(): Bkper.BalancesV2Payload {
      return this.wrapped;
    }
  }



  //###################### ACCOUNT BALANCE REPORT ######################
  /**
  * @class
  A AccountBalanceReport stores {@link Account|accounts} balances.
  */
  export class AccountBalanceReport implements BalanceContainerReport {
    private wrapped: Bkper.AccountBalancesV2Payload;
    private decimalSeparator: Enums.DecimalSeparator;
    private fractionDigits: number;

    constructor(balancePlain: Bkper.AccountBalancesV2Payload, decimalSeparator: Enums.DecimalSeparator, fractionDigits: number) {
      this.wrapped = balancePlain;
      this.decimalSeparator = decimalSeparator;
      this.fractionDigits = fractionDigits;
    }

    /**
    * @returns the {@link Account|account} name
    */
    public getName(): string {
      return this.wrapped.name;
    }

    /**
    * @returns Check if {@link Account|account} is credit
    */
    public isCredit() {
      return this.wrapped.credit;
    }

    /**
    * @returns the {@link Account|account} period balance
    */
    public getPeriodBalance(): number {
      var balance = Utils_.round(this.wrapped.periodBalance, this.fractionDigits);
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }

    /**
    * @returns the {@link Account|account} period balance formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
    */
    public getPeriodBalanceText(): string {
      return Utils_.formatValue_(this.getPeriodBalance(), this.decimalSeparator, this.fractionDigits)
    }

    /**
    * @returns The {@link Account|account} cumulative balance
    */
    public getCumulativeBalance(): number {
      var balance = Utils_.round(this.wrapped.cumulativeBalance, this.fractionDigits);
      balance = Utils_.getRepresentativeValue(balance, this.isCredit());
      return balance;
    }

    /**
    * @returns The {@link Account|account} cumulative balance formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
    */
    public getCumulativeBalanceText(): string {
      return Utils_.formatValue_(this.getCumulativeBalance(), this.decimalSeparator, this.fractionDigits);
    }

    /**
    * @returns the {@link Account|account} balances
    */
    public getBalances(): Bkper.BalanceV2Payload[] {
      return this.wrapped.balances;
    }
  }




  //###################### TAG BALANCE REPORT ######################
  /**
  * @class
  * A TagBalanceReport stores #hashtags balances.
  */
  export class TagBalanceReport implements BalanceContainerReport{

    private wrapped: Bkper.TagBalancesV2Payload;
    private decimalSeparator: Enums.DecimalSeparator;
    private fractionDigits: number;

    constructor(balancePlain: Bkper.TagBalancesV2Payload, decimalSeparator: Enums.DecimalSeparator, fractionDigits: number) {
      this.wrapped = balancePlain;
      this.decimalSeparator = decimalSeparator;
      this.fractionDigits = fractionDigits;
    }

    /**
    * @returns {string} the #hashtag
    */
    public getName(): string {
      return this.wrapped.name;
    }

    public isCredit(): boolean {
      return true;
    }

    /**
    * @returns the #hashtag period balance
    */
    public getPeriodBalance(): number {
      return Utils_.round(this.wrapped.periodBalance, this.fractionDigits);
    }

    /**
    * @returns the #hashtag period balance formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
    */
    public getPeriodBalanceText(): string {
      return Utils_.formatValue_(this.getPeriodBalance(), this.decimalSeparator, this.fractionDigits)
    }

    /**
    * @returns the #hashtag cumulative balance
    */
    public getCumulativeBalance(): number {
      return Utils_.round(this.wrapped.cumulativeBalance, this.fractionDigits);
    }

    /**
    * @returns the #hashtag cumulative balance formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
    */
    public getCumulativeBalanceText(): string {
      return Utils_.formatValue_(this.getCumulativeBalance(), this.decimalSeparator, this.fractionDigits)
    }

    /**
    * @returns the #hashtag balances
    */
    public getBalances(): Bkper.BalanceV2Payload[] {
      return this.wrapped.balances;
    }
  }


  //###################### GROUP BALANCE REPORT ######################
  /**
  * @class
  * A GroupBalanceReport stores {@link Group|group} balances.
  */
  export class GroupBalanceReport implements BalanceContainerReport {

    private wrapped: Bkper.GroupBalancesV2Payload
    private decimalSeparator: Enums.DecimalSeparator;
    private fractionDigits: number;
    private periodicity: Enums.Periodicity;
    private accountBalanceReports: AccountBalanceReport[];
    private timeZone: string;
    private datePattern: string;
    private offsetInMinutes: number;

    constructor(groupBalancesPlain: Bkper.GroupBalancesV2Payload, periodicity: Enums.Periodicity, decimalSeparator: Enums.DecimalSeparator, datePattern: string, fractionDigits: number, offsetInMinutes: number, timeZone: string) {
      this.wrapped = groupBalancesPlain;
      this.periodicity = periodicity;
      this.datePattern = datePattern;
      this.offsetInMinutes = offsetInMinutes;
      this.decimalSeparator = decimalSeparator;
      this.fractionDigits = fractionDigits;
      this.timeZone = timeZone;
    }

    /**
    * @returns {string} the {@link Group|group} name
    */
    public getName(): string {
      return this.wrapped.name;
    }

    /**
    * @returns Check if {@link Group|group} has credit {@link Account|accounts}
    */
    public isCredit = function (): boolean {
      return this.wrapped.credit;
    }

    /**
    * @returns The {@link Group|group} period balance
    */
    public getPeriodBalance(): number {
      var balance = Utils_.round(this.wrapped.periodBalance, this.fractionDigits);
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }

    /**
    * @returns The {@link Group|group} period balance formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
    */
    public getPeriodBalanceText(): string {
      return Utils_.formatValue_(this.getPeriodBalance(), this.decimalSeparator, this.fractionDigits)
    }

    /**
    * @returns {number} the {@link Group|group} period balance
    */
    public getCumulativeBalance(): number {
      var balance = Utils_.round(this.wrapped.cumulativeBalance, this.fractionDigits);
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }

    /**
    * @returns {number} the {@link Group|group} period balance formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
    */
    public getCumulativeBalanceText(): string {
        return Utils_.formatValue_(this.getCumulativeBalance(), this.decimalSeparator, this.fractionDigits)
    }

    /**
    * @returns the {@link Group|group} balances
    */
    public getBalances(): Bkper.GroupBalancesV2Payload[] {
      return this.wrapped.balances;
    }

    /**
    * @returns {@link BalancesDataTableBuilder}
    */
    public createDataTable() {
      return new BalancesDataTableBuilder(this.getAccountBalanceReports(), this.periodicity, this.decimalSeparator, this.datePattern, this.fractionDigits, this.offsetInMinutes, this.timeZone);
    }

    /**
    * @returns {Array<AccountBalanceReport>} all {@link Report.AccountBalanceReport|account balances} of this {@link Group|group}
    */
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
