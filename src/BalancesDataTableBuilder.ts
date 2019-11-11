

/**
 * A BalancesDataTableBuilder is used to setup and build two-dimensional arrays containing balance information.
 * 
 * @public
 */
class BalancesDataTableBuilder implements BalancesDataTableBuilder {

  private balanceType: BalanceType;
  private balancesContainers: BalancesContainer[];
  private periodicity: Periodicity;
  private balanceCheckedType: BalanceCheckedType;
  private shouldFormatDate: boolean;
  private shouldFormatValue: boolean;
  private book: Book;
  private shouldExpand: boolean;
  private shouldTranspose: boolean

  constructor(book: Book, balancesContainers: BalancesContainer[], periodicity: Periodicity, balanceCheckedType: BalanceCheckedType) {
    this.book = book;
    this.balancesContainers = balancesContainers;
    this.periodicity = periodicity;
    this.balanceCheckedType = balanceCheckedType;
    this.balanceType = BalanceType.TOTAL;
    this.shouldFormatDate = false;
    this.shouldFormatValue = false;
    this.shouldExpand = false;
    this.shouldTranspose = false;
  }

  /**
   * Defines whether the dates should be formatted based on date pattern and periodicity of the [[Book]].
   *
   * @returns This builder with respective formatting option, for chaining.
   */
  public formatDates(format: boolean): BalancesDataTableBuilder {
    this.shouldFormatDate = format;
    return this;
  }

  /**
   * Defines whether the value should be formatted based on decimal separator of the [[Book]].
   * 
   * @returns This builder with respective formatting option, for chaining.
   */
  public formatValues(format: boolean): BalancesDataTableBuilder {
    this.shouldFormatValue = format;
    return this;
  }
  
  /**
   * Defines wheter Groups should expand its child accounts.
   * 
   * @returns This builder with respective expanded option, for chaining.
   */
  public expanded(expanded: boolean): BalancesDataTableBuilder {
    this.shouldExpand = expanded;
    return this;
  }

  /**
   * Fluent method to set the [[BalanceType]] for the builder.
   * 
   * @param type The type of balance for this data table
   * 
   * For **TOTAL** [[BalanceType]], the table format looks like:
   * 
   * ```
   *   _____________________
   *  |    NAME   | AMOUNT  |
   *  | Expenses  | 4568.23 |
   *  | Income    | 5678.93 |
   *  |    ...    |   ...   |
   *  |___________|_________|
   * 
   * ```
   * Two columns, and each [[Group]] | [[Account]] | #hashtag per line.
   * 
   * For **PERIOD** or **CUMULATIVE** [[BalanceType]], the table will be a time table, and the format looks like:
   * 
   * ```
   *  _____________________________________________
   *  |    DATE    | Expenses | Income  |    ...   |
   *  | 15/01/2014 | 2345.23  | 3452.93 |    ...   |
   *  | 15/02/2014 | 2345.93  | 3456.46 |    ...   |
   *  | 15/03/2014 | 2456.45  | 3567.87 |    ...   |
   *  |    ...     |   ...    |   ...   |    ...   |
   *  |___________ |__________|_________|__________|
   * 
   * ```
   * 
   * First column will be the Date column, and one column for each [[Group]], [[Account]] or #hashtag.
   * 
   * @returns This builder with respective balance type, for chaining.
   */
  public type(type: BalanceType): BalancesDataTableBuilder {
    this.balanceType = type;
    return this;
  }

  /**
   * Defines wheter should rows and columns should be transposed.
   * 
   * For **TOTAL** [[BalanceType]], the **transposed** table looks like:
   * 
   * ```
   *   _________________________________________
   *  | NAME      | Expenses | Income  |  ...  | 
   *  | AMOUNT    | 4568.23  | 5678.93 |  ...  |
   *  |___________|__________|_________|_______| 
   * 
   * ```
   * Two rows, and each [[Group]] | [[Account]] | #hashtag per column.
   * 
   * 
   * For **PERIOD** or **CUMULATIVE** [[BalanceType]], the **transposed** table will be a time table, and the format looks like:
   * 
   * ```
   *   _______________________________________________________________
   *  |    NAME    | 15/01/2014 | 15/02/2014 | 15/03/2014 |    ...    |
   *  |  Expenses  |  2345.23   |  2345.93   |  2456.45   |    ...    |
   *  |  Income    |  3452.93   |  3456.46   |  3567.87   |    ...    |
   *  |     ...    |     ...    |     ...    |     ...    |    ...    |
   *  |____________|____________|____________|____________|___________|
   * 
   * ```
   * 
   * First column will be teach [[Group]], [[Account]] or #hashtag, and one column for each Date.
   * 
   * @returns This builder with respective transposed option, for chaining.
   */
  public transposed(transposed: boolean): BalancesDataTableBuilder {
    this.shouldTranspose = transposed;
    return this;
  }  

  /**
   * 
   * Builds an two-dimensional array with the balances.
   * 
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

    if (this.balancesContainers == null) {
      return table;
    }

    this.balancesContainers.sort((a, b) => {
      if (a != null && b != null) {
        if (this.balanceCheckedType == BalanceCheckedType.FULL_BALANCE) {
          return b.getCumulativeBalance() - a.getCumulativeBalance();
        } else if (this.balanceCheckedType == BalanceCheckedType.CHECKED_BALANCE) {
          return b.getCheckedCumulativeBalance() - a.getCheckedCumulativeBalance();
        } else {
          return b.getUncheckedCumulativeBalance() - a.getUncheckedCumulativeBalance();
        }
      }
      return -1;
    });

    let containers = new Array<BalancesContainer>();
    this.balancesContainers.forEach(container => {
      if (this.shouldExpand && container instanceof GroupBalancesContainer) {
        let subContainers = container.getBalancesContainers();
        if (subContainers != null) {
          subContainers.sort((a, b) => {
            if (a != null && b != null) {
              if (this.balanceCheckedType == BalanceCheckedType.CHECKED_BALANCE) {
                return b.getCheckedCumulativeBalance() - a.getCheckedCumulativeBalance();
              } else if (this.balanceCheckedType == BalanceCheckedType.UNCHECKED_BALANCE) {
                return b.getUncheckedCumulativeBalance() - a.getUncheckedCumulativeBalance();
              } else {
                return b.getCumulativeBalance() - a.getCumulativeBalance();
              }              
            }
            return -1;
          });
          subContainers.forEach(subContainer => {
            containers.push(subContainer);
          })
        }
      } else {
        containers.push(container);
      }
    });

    for (var i = 0; i < containers.length; i++) {
      var balances = containers[i];
      if (balances != null) {
        var line = new Array();
        var name = balances.getName();
        line.push(name);
        var amount;
        if (this.shouldFormatValue) {
          if (this.balanceCheckedType == BalanceCheckedType.CHECKED_BALANCE) {
            amount = balances.getCheckedCumulativeBalanceText();
          } else if (this.balanceCheckedType == BalanceCheckedType.UNCHECKED_BALANCE) {
            amount = balances.getUncheckedCumulativeBalanceText();
          } else {
            amount = balances.getCumulativeBalanceText();
          }
        } else {
            if (this.balanceCheckedType == BalanceCheckedType.CHECKED_BALANCE) {
              amount = balances.getCheckedCumulativeBalance();
            } else if (this.balanceCheckedType == BalanceCheckedType.UNCHECKED_BALANCE) {
              amount = balances.getUncheckedCumulativeBalance();
            } else {
              amount = balances.getCumulativeBalance();
            }
        }
        line.push(amount);
        table.push(line);
      }
    }

    if (this.shouldTranspose) {
      table = table[0].map((col: any, i: number) => table.map(row => row[i]));
    }

    return table;
  }

  private buildTimeDataTable_() {
    var table = new Array<Array<any>>();
    var dataIndexMap: any = new Object();
    var cumulativeBalance = this.balanceType == BalanceType.CUMULATIVE;

    var header = new Array();
    header.push("Date");

    if (this.balancesContainers == null) {
      return table;
    }

    let containers = new Array<BalancesContainer>();
    this.balancesContainers.forEach(container => {
      if (this.shouldExpand && container instanceof GroupBalancesContainer) {
        let subContainers = container.getBalancesContainers();
        if (subContainers != null) {
          subContainers.forEach(subContainer => {
            containers.push(subContainer);
          })
        }
      } else {
        containers.push(container);
      }

    });


    for (var i = 0; i < containers.length; i++) {
      var balancesContainer = containers[i];
      header.push(balancesContainer.getName());

      var balances = balancesContainer.getBalances();

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
          var amount;
          if (cumulativeBalance) {
            if (this.balanceCheckedType == BalanceCheckedType.CHECKED_BALANCE) {
              amount = balance.getCheckedCumulativeBalance();
            } else if (this.balanceCheckedType == BalanceCheckedType.UNCHECKED_BALANCE) {
              amount = balance.getUncheckedCumulativeBalance();
            } else {
              amount = balance.getCumulativeBalance();
            }            
          } else {
            if (this.balanceCheckedType == BalanceCheckedType.CHECKED_BALANCE) {
              amount = balance.getCheckedPeriodBalance();
            } else if (this.balanceCheckedType == BalanceCheckedType.UNCHECKED_BALANCE) {
              amount = balance.getUncheckedPeriodBalance();
            } else {
              amount = balance.getPeriodBalance();
            }            
          }
          indexEntry[balancesContainer.getName()] = Utils_.getRepresentativeValue(amount, balancesContainer.isCredit());
        }

      }
    }

    table.push(header);

    var rows = new Array<Array<any>>();
    for (var fuzzy in dataIndexMap) {
      var rowObject = dataIndexMap[fuzzy];
      var row = new Array();
      row.push(rowObject.date);
      for (var i = 0; i < containers.length; i++) {
        var balancesContainer = containers[i];
        var amount = rowObject[balancesContainer.getName()];
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

    if (this.shouldTranspose) {
      table = table[0].map((col: any, i: number) => table.map(row => row[i]));
    }

    return table;
  }






/******************* DEPRECATED METHODS *******************/

  /**
   * @deprecated
   */
  formatDate(): BalancesDataTableBuilder {
    return this.formatDates(true);
  }  

  /**
   * @deprecated
   */
  formatValue(): BalancesDataTableBuilder {
    return this.formatValues(true);
  }  

  /**
   * @deprecated
   */
  expandGroups(): BalancesDataTableBuilder {
    return this.expanded(true);
  }  

  /**
   * @deprecated
   */
  setBalanceType(balanceType: BalanceType): BalancesDataTableBuilder {
    return this.type(balanceType);
  }

  /**
   * @deprecated
   */
  transpose(): BalancesDataTableBuilder {
    return this.transposed(true);
  }  

}