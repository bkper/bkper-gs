
/**
 * @ignore
 */
namespace Report {

  export class BalanceReport {

    private wrapped: bkper.BalancesV2Payload;

    private book: Book;
    private groupBalances: GroupBalances[];
    private accountBalances: AccountBalances[];
    private tagBalances: TagBalances[];


    constructor(book: Book, balanceReportPlain: bkper.BalancesV2Payload) {
      this.book = book;
      this.wrapped = balanceReportPlain;
      this.groupBalances = null;
      this.accountBalances = null;
      this.tagBalances = null;
    }

    public createDataTable(): BalancesDataTableBuilder {
      var dataTable = new Array();
      if (this.getAccountBalances() != null) {
        dataTable = dataTable.concat(this.getAccountBalances());
      }
      if (this.getTagBalances() != null) {
        dataTable = dataTable.concat(this.getTagBalances());
      }
      if (this.getGroupBalances() != null) {
        dataTable = dataTable.concat(this.getGroupBalances());
      }

      return new BalancesDataTableBuilder(this.book, dataTable, this.getPeriodicity());
    }


    public getPeriodicity(): Periodicity {
      return this.wrapped.periodicity;
    }

    public hasOnlyOneGroupBalance(): boolean {
      return this.getGroupBalances() != null && this.getGroupBalances().length == 1;
    }

    public getAccountBalances(): AccountBalances[] {
      if (this.accountBalances == null && this.wrapped.accountBalances != null) {
        this.accountBalances = [];
        for (var i = 0; i < this.wrapped.accountBalances.length; i++) {
          var accountBalance = this.wrapped.accountBalances[i];
          var accountBalanceReport = new Report.AccountBalances(this.book, accountBalance);
          this.accountBalances.push(accountBalanceReport);
        }
      }
      return this.accountBalances;
    }

    public getTagBalances(): TagBalances[] {
      if (this.tagBalances == null && this.wrapped.tagBalances != null) {
        this.tagBalances = [];
        for (var i = 0; i < this.wrapped.tagBalances.length; i++) {
          var tagBalance = this.wrapped.tagBalances[i];
          var tagBalanceReport = new Report.TagBalances(this.book, tagBalance);
          this.tagBalances.push(tagBalanceReport);
        }
      }
      return this.tagBalances;
    }


    public getGroupBalances(): GroupBalances[] {
      if (this.groupBalances == null && this.wrapped.groupBalances != null) {
        this.groupBalances = [];
        for (var i = 0; i < this.wrapped.groupBalances.length; i++) {
          var grouBalances = this.wrapped.groupBalances[i];
          var accGroupBalances = new GroupBalances(this.book, grouBalances, this.getPeriodicity());
          this.groupBalances.push(accGroupBalances);
        }
      }
      return this.groupBalances;
    }

    public getGroupBalance(groupName: string): GroupBalances {
      var groupBalances = this.getGroupBalances();
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


  //###################### ACCOUNT BALANCE REPORT ######################


  export class AccountBalances implements BalanceContainer {
    private wrapped: bkper.AccountBalancesV2Payload;
    private book: Book;

    constructor(book: Book, balancePlain: bkper.AccountBalancesV2Payload) {
      this.book = book;
      this.wrapped = balancePlain;
    }

    public getBook(): Book {
      return this.book;
    }

    public getName(): string {
      return this.wrapped.name;
    }

    public isCredit() {
      return this.wrapped.credit;
    }

    public getPeriodBalance(): number {
      var balance = Utils_.round(this.wrapped.periodBalance, this.book.getFractionDigits());
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }

    public getPeriodBalanceText(): string {
      return this.book.formatValue(this.getPeriodBalance());
    }

    public getCumulativeBalance(): number {
      var balance = Utils_.round(this.wrapped.cumulativeBalance, this.book.getFractionDigits());
      balance = Utils_.getRepresentativeValue(balance, this.isCredit());
      return balance;
    }

    public getCumulativeBalanceText(): string {
      return this.book.formatValue(this.getCumulativeBalance());
    }

    public getBalances(): GoogleAppsScript.Bkper.Balance[] {
      return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
    }
  }


  //###################### TAG BALANCE REPORT ######################

  export class TagBalances implements BalanceContainer {

    private wrapped: bkper.TagBalancesV2Payload;
    private book: Book;

    constructor(book: Book, balancePlain: bkper.TagBalancesV2Payload) {
      this.book = book;
      this.wrapped = balancePlain;
    }

    public getBook(): Book {
      return this.book;
    }

    public getName(): string {
      return this.wrapped.name;
    }

    public isCredit(): boolean {
      return true;
    }

    public getPeriodBalance(): number {
      return Utils_.round(this.wrapped.periodBalance, this.book.getFractionDigits());
    }

    public getPeriodBalanceText(): string {
      return this.book.formatValue(this.getPeriodBalance());
    }

    public getCumulativeBalance(): number {
      return Utils_.round(this.wrapped.cumulativeBalance, this.book.getFractionDigits());
    }

    public getCumulativeBalanceText(): string {
      return this.book.formatValue(this.getCumulativeBalance());
    }

    public getBalances(): GoogleAppsScript.Bkper.Balance[] {
      return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
    }
  }


  //###################### GROUP BALANCE REPORT ######################

  export class GroupBalances implements BalanceContainer {

    private wrapped: bkper.GroupBalancesV2Payload
    private accountBalances: AccountBalances[];
    private periodicity: Periodicity;

    private book: Book;

    constructor(book: Book, groupBalancesPlain: bkper.GroupBalancesV2Payload, periodicity: Periodicity) {
      this.book = book;
      this.wrapped = groupBalancesPlain;
      this.periodicity = periodicity;
    }

    public getBook(): Book {
      return this.book;
    }

    public getName(): string {
      return this.wrapped.name;
    }

    public isCredit(): boolean {
      return this.wrapped.credit;
    }

    public getPeriodBalance(): number {
      var balance = Utils_.round(this.wrapped.periodBalance, this.book.getFractionDigits());
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }

    public getPeriodBalanceText(): string {
      return this.book.formatValue(this.getPeriodBalance());
    }

    public getCumulativeBalance(): number {
      var balance = Utils_.round(this.wrapped.cumulativeBalance, this.book.getFractionDigits());
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }

    public getCumulativeBalanceText(): string {
      return this.book.formatValue(this.getCumulativeBalance());
    }

    public getBalances(): GoogleAppsScript.Bkper.Balance[] {
      return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
    }


    public createDataTable() {
      return new BalancesDataTableBuilder(this.book, this.getAccountBalances(), this.periodicity);
    }

    public getAccountBalances(): AccountBalances[] {
      var accountBalances = this.wrapped.accountBalances;
      if (this.accountBalances == null && accountBalances != null) {
        this.accountBalances = [];
        for (var i = 0; i < accountBalances.length; i++) {
          var accountBalance = accountBalances[i];
          var accBalances = new AccountBalances(this.book, accountBalance);
          this.accountBalances.push(accBalances);
        }
      }
      return this.accountBalances;
    }
  }
}
