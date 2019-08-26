

/**
 * A BalancesDataTableBuilder is used to setup and build two-dimensional arrays containing balance information.
 */
class BalancesDataTableBuilder implements bkper.BalancesDataTableBuilder {

  private balanceType: BalanceType;
  private periodicity: Periodicity;
  private decimalSeparator: DecimalSeparator;
  private datePattern: string;
  private fractionDigits: number;
  private balanceArray: Report.BalanceContainerReport[];
  private shouldFormatDate: boolean;
  private offsetInMinutes: number;
  private timeZone: string;
  private shouldFormatValue: boolean;

  /**
   * @ignore
   */
  constructor(balanceContainerReportArray: Report.BalanceContainerReport[], periodicity: Periodicity, decimalSeparator: DecimalSeparator, datePattern: string, fractionDigits: number, offsetInMinutes: number, timeZone: string) {
    this.balanceType = BalanceType.TOTAL;
    this.periodicity = periodicity;
    this.decimalSeparator = decimalSeparator;
    this.datePattern = datePattern;
    this.fractionDigits = fractionDigits;
    this.balanceArray = balanceContainerReportArray;
    this.shouldFormatDate = false;
    this.shouldFormatValue = false;
    this.offsetInMinutes = offsetInMinutes;
    this.timeZone = timeZone;
  }

  /**
   * @inheritdoc
   */
  public formatDate(): BalancesDataTableBuilder {
    this.shouldFormatDate = true;
    return this;
  }

  /**
   * @inheritdoc
   */
  public formatValue(): BalancesDataTableBuilder {
    this.shouldFormatValue = true;
    return this;
  }

  /**
   * Fluent method to set the [[BalanceType]]
   * 
   * For [[BalanceType.TOTAL]] balance type, the table format looks like:
   * 
   * ```
   *   _____________________
   *  |    NAME   | AMOUNT  |
   *  | Expenses  | 4568.23 |
   *  | Incomes   | 5678.93 |
   *  |    ...    |   ...   |
   *  |___________|_________|
   * 
   * ```
   * Two columns, and Each Group | Account | Tag per line.
   * 
   * For [[BalanceType.PERIOD]] or  [[BalanceType.CUMULATIVE]], the table will be a time table, and the format looks like:
   * 
   * ```
   *  _____________________________________________
   *  |    DATE    | Expenses | Incomes |    ...   |
   *  | 15/01/2014 | 2345.23  | 3452.93 |    ...   |
   *  | 15/02/2014 | 2345.93  | 3456.46 |    ...   |
   *  | 15/03/2014 | 2456.45  | 3567.87 |    ...   |
   *  |    ...     |   ...    |   ...   |    ...   |
   *  |___________ |__________|_________|__________|
   * 
   * ```
   * 
	 * First column will be the Date column, and one column for each Group | Account | Tag.
   * 
   * 
   * @param balanceType The type of balance for this data table
   * 
   * @returns This builder with respective balance type.
   */
  public setBalanceType(balanceType: BalanceType): BalancesDataTableBuilder {
    this.balanceType = balanceType;
    return this;
  }


  /**
   * 
   * Gets an two-dimensional array with the balances.
   * 
   *  @returns
   */
  public build(): any[][] {
    if (this.balanceType == BalanceType.TOTAL) {
      return this.buildTotalDataTable_();
    } else {
      return this.buildTimeDataTable_();
    }
  }


  ///////////////////////


  private buildTotalDataTable_() {
    var table = new Array();
    var header = ["Name", "Amount"]
    table.push(header);


    if (this.balanceArray != null) {
      this.balanceArray.sort(function (a, b) {
        if (a != null && b != null) {
          return b.getCumulativeBalance() - a.getCumulativeBalance();
        }
        return -1;
      });
      for (var i = 0; i < this.balanceArray.length; i++) {
        var balanceReport = this.balanceArray[i];
        if (balanceReport != null) {
          var line = new Array();
          var name = balanceReport.getName();
          line.push(name);
          var balance = this.shouldFormatValue ? balanceReport.getCumulativeBalanceText() : balanceReport.getCumulativeBalance();
          line.push(balance);
          table.push(line);
        }
      }
    }

    return table;
  }

  private buildTimeDataTable_() {
    var table = new Array<Array<any>>();
    var dataIndexMap: any = new Object();
    var cumulativeBalance = this.balanceType == BalanceType.CUMULATIVE;

    var header = new Array();
    header.push("Date");

    for (var i = 0; i < this.balanceArray.length; i++) {
      var balanceReport = this.balanceArray[i];
      header.push(balanceReport.getName());

      var balances = balanceReport.getBalances();

      if (balances != null) {

        for (var j = 0; j < balances.length; j++) {
          var balance = balances[j];
          var fuzzyDate = this.getFuzzyDate_(balance);
          var indexEntry = dataIndexMap[fuzzyDate];
          if (indexEntry == null) {
            indexEntry = new Object();
            indexEntry.date = this.getBalanceDate_(balance, this.offsetInMinutes);
            dataIndexMap[fuzzyDate] = indexEntry;
          }
          var bal = cumulativeBalance ? balance.cumulativeBalance : balance.periodBalance;
          indexEntry[balanceReport.getName()] = Utils_.getRepresentativeValue(bal, balanceReport.isCredit());
        }

      }
    }

    table.push(header);

    var rows = new Array<Array<any>>();
    for (var fuzzy in dataIndexMap) {
      var rowObject = dataIndexMap[fuzzy];
      var row = new Array();
      row.push(rowObject.date);
      for (var i = 0; i < this.balanceArray.length; i++) {
        var balanceReport = this.balanceArray[i];
        var amount = rowObject[balanceReport.getName()];
        if (amount == null) {
          amount = "null_amount";
        } else {
          amount = Utils_.round(amount);
          if (this.shouldFormatValue) {
            amount = Utils_.formatValue_(amount, this.decimalSeparator, this.fractionDigits);
          }
        }
        row.push(amount);
      }

      rows.push(row);
    }

    rows.sort(function (a, b) { return a[0].getTime() - b[0].getTime() });


    var lastRow: any[] = null;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (i == 0) {
        //first row, all null values will be 0
        for (var j = 1; j < row.length; j++) {
          var cell = row[j];
          if (cell == "null_amount") {
            var amount: any = 0;
            if (this.shouldFormatValue) {
              amount = Utils_.formatValue_(amount, this.decimalSeparator, this.fractionDigits);
            }
            row[j] = amount;
          }
        }
      } else {
        for (var j = 1; j < row.length; j++) {
          var cell = row[j];
          if (cell == "null_amount" && cumulativeBalance) {
            row[j] = lastRow[j];
          } else if (cell == "null_amount") {
            var amount: any = 0;
            if (this.shouldFormatValue) {
              amount = Utils_.formatValue_(amount, this.decimalSeparator, this.fractionDigits);
            }
            row[j] = amount;
          }
        }

      }
      lastRow = row;
      table.push(row);
    }

    if (this.shouldFormatDate && table.length > 0) {
      var pattern = Utils_.getDateFormatterPattern(this.datePattern, this.periodicity);
      for (var j = 1; j < table.length; j++) {
        var row = table[j];
        if (row.length > 0) {
          //first column
          row[0] = Utils_.formatDate(row[0], pattern, this.timeZone);
        }
      }

    }

    return table;
  }

  private getBalanceDate_(balance: bkper.BalanceV2Payload, offsetInMinutes: number) {
    var year = balance.year;
    var month = balance.month;
    var day = balance.day;

    if (month == null || month == 0) {
      year++;
    }
    if (day == null || day == 0) {
      month++;
    }

    var date = Utils_.createDate(year, month, day, offsetInMinutes);
    return date;
  }

  private getFuzzyDate_(balance: bkper.BalanceV2Payload): string {
    var year = balance.year * 10000;
    var month = balance.month * 100;
    var day = balance.day;
    var fuzzyDate = year + month + day;
    return fuzzyDate + "";
  }


}