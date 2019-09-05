

/**
 * A BalancesDataTableBuilder is used to setup and build two-dimensional arrays containing balance information.
 */
class BalancesDataTableBuilder implements GoogleAppsScript.Bkper.BalancesDataTableBuilder {

  private balanceType: BalanceType;
  private balanceArray: GoogleAppsScript.Bkper.BalancesContainer[];
  private periodicity: Periodicity;
  private shouldFormatDate: boolean;
  private shouldFormatValue: boolean;
  private book: GoogleAppsScript.Bkper.Book;

  /**
   * @ignore
   */
  constructor(book: GoogleAppsScript.Bkper.Book, balancesContainers: GoogleAppsScript.Bkper.BalancesContainer[], periodicity: Periodicity) {
    this.book = book;
    this.balanceArray = balancesContainers;
    this.periodicity = periodicity;
    
    this.balanceType = BalanceType.TOTAL;
    this.shouldFormatDate = false;
    this.shouldFormatValue = false;
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
   * @inheritdoc
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


  ////////////////////////


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
          var fuzzyDate = balance.getFuzzyDate();
          var indexEntry = dataIndexMap[fuzzyDate];
          if (indexEntry == null) {
            indexEntry = new Object();
            indexEntry.date = balance.getDate();
            dataIndexMap[fuzzyDate] = indexEntry;
          }
          var bal = cumulativeBalance ? balance.getCumulativeBalance() : balance.getPeriodBalance();
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
            amount = Utils_.formatValue_(amount, this.book.getDecimalSeparator(), this.book.getFractionDigits());
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
              amount = Utils_.formatValue_(amount, this.book.getDecimalSeparator(), this.book.getFractionDigits());
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
              amount = Utils_.formatValue_(amount, this.book.getDecimalSeparator(), this.book.getFractionDigits());
            }
            row[j] = amount;
          }
        }

      }
      lastRow = row;
      table.push(row);
    }

    if (this.shouldFormatDate && table.length > 0) {
      var pattern = Utils_.getDateFormatterPattern(this.book.getDatePattern(), this.periodicity);
      for (var j = 1; j < table.length; j++) {
        var row = table[j];
        if (row.length > 0) {
          //first column
          row[0] = Utils_.formatDate(row[0], pattern, this.book.getTimeZone());
        }
      }

    }

    return table;
  }

}