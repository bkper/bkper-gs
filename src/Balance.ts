/**
 * Class that represents an [[Account]], [[Group]] or #hashtag balance on a window of time (Day / Month / Year). 
 * 
 * @public
 */
class Balance {

  private wrapped: bkper.Balance;

  private container: BalancesContainer;

  constructor(container: BalancesContainer, balancePlain: bkper.Balance) {
    this.container = container;
    this.wrapped = balancePlain;
  }

  /**
   * The day of the balance. Days starts on 1 to 31. 
   * 
   * Day can be 0 (zero) in case of Monthly or Early [[Periodicity]] of the [[BalancesReport]]
   */
  public getDay(): number {
    return this.wrapped.day
  }

  /**
   * The month of the balance. Months starts on 1 (January) to 12 (December)
   * 
   * Month can be 0 (zero) in case of Early [[Periodicity]] of the [[BalancesReport]]
   */
  public getMonth(): number {
    return this.wrapped.month;
  }

  /**
   * The year of the balance
   */
  public getYear(): number {
    return this.wrapped.year;
  }

  /**
   * Date object constructed based on [[Book]] time zone offset. Usefull for 
   * 
   * If Month or Day is zero, the date will be constructed with first Month (January) or Day (1).
   */
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
    var date = Utils_.createDate(year, month, day, this.container.getBalancesReport().getBook().getTimeZoneOffset());
    return date;
  }

  /**
   * The Fuzzy Date of the balance, based on [[Periodicity]] of the [[BalancesReport]] query, composed by Year, Month and Day.
   * 
   * The format is **YYYYMMDD**. Very usefull for ordering and indexing
   * 
   * Month and Day can be 0 (zero), depending on the granularity of the [[Periodicity]].
   * 
   * *Example:*
   * 
   * **20180125** - 25, January, 2018 - DAILY Periodicity
   * 
   * **20180100** - January, 2018 - MONTHLY Periodicity
   * 
   * **20180000** - 2018 - YEARLY Periodicity
   */
  public getFuzzyDate(): number {
    return this.wrapped.fuzzyDate;
  }

  /**
   * The cumulative balance to the date, since the first transaction posted.
   */
  public getCumulativeBalance(): Big {
    return new Big(this.wrapped.cumulativeBalance);
  }

  /**
   * The cumulative checked balance to the date, since the first transaction posted.
   */
  public getCheckedCumulativeBalance(): Big {
    return new Big(this.wrapped.checkedCumulativeBalance);
  }

  /**
   * The balance on the date period.
   */
  public getPeriodBalance(): Big {
    return new Big(this.wrapped.periodBalance);
  }

  /**
   * The checked balance on the date period.
   */
  public getCheckedPeriodBalance(): Big {
    return new Big(this.wrapped.checkedPeriodBalance);
  }

  /**
   * The unchecked cumulative balance to the date, since the first transaction posted.
   */
  public getUncheckedCumulativeBalance(): Big {
    return new Big(this.wrapped.uncheckedCumulativeBalance);
  }

  /**
    * The unchecked balance on the date period.
    */
  public getUncheckedPeriodBalance(): Big {
    return new Big(this.wrapped.uncheckedPeriodBalance);
  }


}