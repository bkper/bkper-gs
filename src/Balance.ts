class Balance implements GoogleAppsScript.Bkper.Balance {

  private wrapped: bkper.BalanceV2Payload;

  private container: BalanceContainer;

  constructor(container: BalanceContainer, balancePlain: bkper.BalanceV2Payload) {
    this.container = container;
    this.wrapped = balancePlain;
  }

  public getDay(): number {
    return this.wrapped.day
  }

  public getMonth(): number {
    return this.wrapped.month;
  }

  public getYear(): number {
    return this.wrapped.year;
  }

  public getDate(): Date {
    var year = this.getYear();
    var month = this.getMonth();
    var day = this.getDay();

    if (month == null || month == 0) {
      year++;
    }
    if (day == null || day == 0) {
      month++;
    }
    var date = Utils_.createDate(year, month, day, this.container.getBook().getTimeZoneOffset());
    return date;
  }

  public getFuzzyDate(): number {
    return this.wrapped.fuzzyDate;
  }

  public getCumulativeBalance(): number {
    return this.wrapped.cumulativeBalance;
  }

  public getPeriodBalance(): number {
    return this.wrapped.periodBalance;
  }

  public getCheckedCumulativeBalance(): number {
    return this.wrapped.checkedCumulativeBalance;
  }

  public getCheckedPeriodBalance(): number {
    return this.wrapped.checkedPeriodBalance;
  }

  public getUncheckedCumulativeBalance(): number {
    return this.wrapped.uncheckedCumulativeBalance;
  }

  public getUncheckedPeriodBalance(): number {
    return this.wrapped.uncheckedPeriodBalance;
  }


}