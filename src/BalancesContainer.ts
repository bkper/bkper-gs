 //###################### ACCOUNT BALANCE CONTAINER ######################

 class AccountBalancesContainer implements GoogleAppsScript.Bkper.BalancesContainer {
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







//###################### TAG BALANCE CONTAINER ######################

class TagBalancesContainer implements GoogleAppsScript.Bkper.BalancesContainer {

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







//###################### GROUP BALANCE CONTAINER ######################

class GroupBalancesContainer implements GoogleAppsScript.Bkper.BalancesContainer {

  private wrapped: bkper.GroupBalancesV2Payload
  private accountBalances: AccountBalancesContainer[];
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

  public getAccountBalances(): AccountBalancesContainer[] {
    var accountBalances = this.wrapped.accountBalances;
    if (this.accountBalances == null && accountBalances != null) {
      this.accountBalances = [];
      for (var i = 0; i < accountBalances.length; i++) {
        var accountBalance = accountBalances[i];
        var accBalances = new AccountBalancesContainer(this.book, accountBalance);
        this.accountBalances.push(accBalances);
      }
    }
    return this.accountBalances;
  }
}
