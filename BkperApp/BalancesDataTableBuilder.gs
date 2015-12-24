/**
 * Enum that represents balance types.
 * @readonly
 * @enum {string}
 */
var BalanceType = {
  /** Total balance */
  TOTAL: "total",
  /** Period balance */
  PERIOD: "period",
  /** Cumulative balance */
  CUMULATIVE: "cumulative"
}


/**
@class
A BalancesDataTableBuilder is used to setup and build two-dimensional arrays containing balance information.
*/
function BalancesDataTableBuilder(balanceContainerReportArray, periodicity, decimalSeparator, datePattern, fractionDigits, offsetInMinutes, timeZone) {
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

  Logger.log(this.timeZone);

  /**
  Defines whether the dates should be formatted based on {@link Book#getDatePattern|date pattern of book} and periodicity.
  @returns {@link BalancesDataTableBuilder|BalancesDataTableBuilder} the builder with respective formatting option.
  */
  BalancesDataTableBuilder.prototype.formatDate = function() {
    this.shouldFormatDate = true;
    return this;
  }
  /**
  Defines whether the value should be formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
  @returns {@link BalancesDataTableBuilder|BalancesDataTableBuilder} the builder with respective formatting option.
  */
  BalancesDataTableBuilder.prototype.formatValue = function() {
    this.shouldFormatValue = true;
    return this;
  }

  /**
  Sets the {@link BalanceType|BalanceType}.
  @param {BalanceType}
  @returns {@link BalancesDataTableBuilder|BalancesDataTableBuilder} the builder with respective balance type.
  */
  BalancesDataTableBuilder.prototype.setBalanceType = function(balanceType) {
    this.balanceType = balanceType;
    return this;
  }


  /**
  Gets an two-dimensional array with the balances.
  <br/>
  For {@link BalanceType.TOTAL|BalanceType.TOTAL}, the table format looks like:

  <pre>
    _____________________
   |    NAME   | AMOUNT  |
   | Expenses  | 4568.23 |
   | Incomes   | 5678.93 |
   |    ...    |   ...   |
   |___________|_________|

   </pre>
   Two columns, and Each Group|Account|Tag per line.
   <br/>
   <br/>

   For {@link BalanceType.PERIOD|BalanceType.PERIOD},  {@link BalanceType.CUMULATIVE|BalanceType.CUMULATIVE}, the table will be a time table, and the format looks like:

  <pre>
    _____________________________________________
   |    DATE    | Expenses | Incomes |    ...   |
   | 15/01/2014 | 2345.23  | 3452.93 |    ...   |
   | 15/02/2014 | 2345.93  | 3456.46 |    ...   |
   | 15/03/2014 | 2456.45  | 3567.87 |    ...   |
   |    ...     |   ...    |   ...   |    ...   |
   |___________ |__________|_________|__________|

  </pre>

	First column will be the Date column, and one column for each Group|Account|Tag.

    @returns Array[][]
  */
  BalancesDataTableBuilder.prototype.build = function() {
    if (this.balanceType == BalanceType.TOTAL) {
      return this.buildTotalDataTable_();
    } else {
      return this.buildTimeDataTable_();
    }
  }

  /**
  Builds a {@link https://developers.google.com/apps-script/reference/charts/|Chart Services} data table
  <br/>
  The internal structure is the same of {@link BalancesDataTableBuilder#build|build}

  @returns DataTable a Chart Services {@link https://developers.google.com/apps-script/reference/charts/data-table|DataTable}
  */
  BalancesDataTableBuilder.prototype.buildChartDataTable = function() {
    var tempShouldFormatValue = this.shouldFormatValue;
    var tempShouldFormatDate = this.shouldFormatDate;
    this.shouldFormatDate = false;
    this.shouldFormatValue = false;
    var chartDataTable = null;
    if (this.balanceType == BalanceType.TOTAL) {
       chartDataTable = this.buildTotalChartDataTable_(this.buildTotalDataTable_());
    } else {
      chartDataTable = this.buildTimeChartDataTable_(this.buildTimeDataTable_());
    }
    this.shouldFormatDate = tempShouldFormatDate;
    this.shouldFormatValue = tempShouldFormatValue;
    return chartDataTable;
  }

  BalancesDataTableBuilder.prototype.buildTotalChartDataTable_ = function(balancesDataTable) {
    var data = Charts.newDataTable();
    data.addColumn(Charts.ColumnType.STRING, balancesDataTable[0][0]);
    data.addColumn(Charts.ColumnType.NUMBER, balancesDataTable[0][1]);
    for (var i = 1; i < balancesDataTable.length; i++) {
      var row = balancesDataTable[i];
      row[1] = row[1] < 0 ? row[1] * -1 : row[1];
      data.addRow(row);
    }
    return data.build();
  }

  BalancesDataTableBuilder.prototype.buildTimeChartDataTable_ = function(balancesTimeTable) {
    var data = Charts.newDataTable();
    data.addColumn(Charts.ColumnType.DATE, "Date");
    //header
    for (var i = 1; i < balancesTimeTable[0].length; i++) {
      var columnName = balancesTimeTable[0][i];
      data.addColumn(Charts.ColumnType.NUMBER, columnName);
    }
    for (var i = 1; i < balancesTimeTable.length; i++) {
      var row = balancesTimeTable[i];
      data.addRow(row);
    }
    return data.build();
  }


  ///////////////////////


  BalancesDataTableBuilder.prototype.buildTotalDataTable_ = function() {
    var table = new Array();
    var header = ["Name", "Amount"]
    table.push(header);


    if (this.balanceArray != null) {
      this.balanceArray.sort(function(a,b){
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
          var balance = balanceReport.getCumulativeBalance(this.shouldFormatValue);
          line.push(balance);
          table.push(line);
        }
      }
    }


    return table;
  }

  BalancesDataTableBuilder.prototype.buildTimeDataTable_ = function() {
    var table = new Array();
    var dataIndexMap = new Object();
    var cumulativeBalance = this.balanceType == BalanceType.CUMULATIVE;

    var header = new Array();
    header.push("Date");

    for (var i = 0; i < this.balanceArray.length; i++) {
      var balanceReport = this.balanceArray[i];
      header.push(balanceReport.getName());

      var balances = balanceReport.getBalances();

      if (balances != null) {

        //Create a fake zero balance in a previous date if it has only one balance
        if (balances.length == 1) {
          var onlyOneBalance = balances[0];
          var balanceDate = this.getBalanceDate_(onlyOneBalance, this.offsetInMinutes);
          var daysToSubtract = this.getDaysToBasedOnPeriodicity_(this.periodicity);
          balanceDate.setDate(balanceDate.getDate()-daysToSubtract);
          var previousFakeBalance = this.createFakeTimeBalance_(balanceDate, this.periodicity);
          balances.push(previousFakeBalance);
        }

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

    var rows = new Array();
    for (var fuzzy in dataIndexMap) {
      var rowObject = dataIndexMap[fuzzy];
      var row = new Array();
      row.push(rowObject.date);
      for (var i = 0; i < this.balanceArray.length; i++) {
        var balanceReport = this.balanceArray[i];
        var amount = rowObject[balanceReport.getName()];
        if (amount == null) {
          amount = "null_amount";
        }  else {
          amount = Utils_.round(amount);
          if (this.shouldFormatValue) {
            amount = Utils_.formatValue_(amount, this.decimalSeparator, this.fractionDigits);
          }
        }
        row.push(amount);
      }

      rows.push(row);
    }

    rows.sort(function(a,b){return a[0].getTime() - b[0].getTime()});


    var lastRow = null;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (i == 0) {
        //first row, all null values will be 0
        for (var j = 1; j < row.length; j++) {
          var cell = row[j];
          if (cell == "null_amount") {
            var amount = 0;
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
            var amount = 0;
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
      var pattern =  Utils_.getDateFormatterPattern(this.datePattern, this.periodicity);
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

  BalancesDataTableBuilder.prototype.getBalanceDate_ = function(balance, offsetInMinutes) {
    var year = balance.year;
    var month = balance.month;
    var day = balance.day;

    if (month == null || month == 0) {
      year ++;
    }
    if (day == null || day == 0) {
      month++;
    }
    
    var date = Utils_.createDate(year, month, day, offsetInMinutes);
    return date;
  }

  BalancesDataTableBuilder.prototype.getFuzzyDate_ = function(balance) {
    var year = balance.year * 10000;
    var month = balance.month * 100;
    var day = balance.day;
    var fuzzyDate = year + month + day;
    return fuzzyDate + "";
  }

  BalancesDataTableBuilder.prototype.getDaysToBasedOnPeriodicity_ = function(periodicity) {
    if (periodicity == "DAYLY") {
      return 1;
    } else if (periodicity ==  "MONTHLY") {
      return 32;
    } else {
      return 367;
    }
  }


  BalancesDataTableBuilder.prototype.createFakeTimeBalance_ = function(date, periodicity) {
    var balance = new Object();
    balance.totalCredit = 0;
    balance.totalDebit = 0;
    balance.periodBalance = 0;
    balance.cumulativeBalance = 0;

    balance.year = date.getFullYear();
    balance.month = 0;
    balance.day = 0;

    if (periodicity ==  "MONTHLY" || periodicity ==  "DAYLY") {
      balance.month = date.getMonth() + 1;
    }

    if (periodicity == "DAYLY") {
      balance.day = date.getDate();
    }
    return balance;
  }
}