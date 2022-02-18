

/**
 * A BalancesDataTableBuilder is used to setup and build two-dimensional arrays containing balance information.
 * 
 * @public
 */
class BalancesDataTableBuilder implements BalancesDataTableBuilder {

  private balanceType: BalanceType;
  private balancesContainers: BalancesContainer[];
  private periodicity: Periodicity;
  private shouldFormatDate: boolean;
  private shouldHideDates: boolean;
  private shouldHideNames: boolean;
  private shouldFormatValue: boolean;
  private book: Book;
  private shouldExpand: boolean;
  private shouldTranspose: boolean;
  private shouldTrial: boolean;
  private shouldPeriod: boolean;
  private shouldRaw = false;

  constructor(book: Book, balancesContainers: BalancesContainer[], periodicity: Periodicity) {
    this.book = book;
    this.balancesContainers = balancesContainers;
    this.periodicity = periodicity;
    this.balanceType = BalanceType.TOTAL;
    this.shouldFormatDate = false;
    this.shouldHideDates = false;
    this.shouldHideNames = false;
    this.shouldFormatValue = false;
    this.shouldExpand = false;
    this.shouldTranspose = false;
    this.shouldTrial = false;
    this.shouldPeriod = false;
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
   * Defines whether Groups should expand its child accounts.
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
   *  | Expenses  | 4568.23 |
   *  | Income    | 5678.93 |
   *  |    ...    |   ...   |
   *  |___________|_________|
   * 
   * ```
   * Two columns, and each [[Account]] or [[Group]] per line.
   * 
   * For **PERIOD** or **CUMULATIVE** [[BalanceType]], the table will be a time table, and the format looks like:
   * 
   * ```
   *  _____________________________________________
   *  |            | Expenses | Income  |    ...   |
   *  | 15/01/2014 | 2345.23  | 3452.93 |    ...   |
   *  | 15/02/2014 | 2345.93  | 3456.46 |    ...   |
   *  | 15/03/2014 | 2456.45  | 3567.87 |    ...   |
   *  |    ...     |   ...    |   ...   |    ...   |
   *  |___________ |__________|_________|__________|
   * 
   * ```
   * 
   * First column will be the Date column, and one column for each [[Account]] or [[Group]].
   * 
   * @returns This builder with respective balance type, for chaining.
   */
  public type(type: BalanceType): BalancesDataTableBuilder {
    this.balanceType = type;
    return this;
  }

  /**
   * Defines whether should rows and columns should be transposed.
   * 
   * For **TOTAL** [[BalanceType]], the **transposed** table looks like:
   * 
   * ```
   *   _____________________________
   *  | Expenses | Income  |  ...  | 
   *  | 4568.23  | 5678.93 |  ...  |
   *  |__________|_________|_______| 
   * 
   * ```
   * Two rows, and each [[Account]] or [[Group]] per column.
   * 
   * 
   * For **PERIOD** or **CUMULATIVE** [[BalanceType]], the **transposed** table will be a time table, and the format looks like:
   * 
   * ```
   *   _______________________________________________________________
   *  |            | 15/01/2014 | 15/02/2014 | 15/03/2014 |    ...    |
   *  |  Expenses  |  2345.23   |  2345.93   |  2456.45   |    ...    |
   *  |  Income    |  3452.93   |  3456.46   |  3567.87   |    ...    |
   *  |     ...    |     ...    |     ...    |     ...    |    ...    |
   *  |____________|____________|____________|____________|___________|
   * 
   * ```
   * 
   * First column will be each [[Account]] or [[Group]], and one column for each Date.
   * 
   * @returns This builder with respective transposed option, for chaining.
   */
  public transposed(transposed: boolean): BalancesDataTableBuilder {
    this.shouldTranspose = transposed;
    return this;
  }

  /**
   * Defines whether the dates should be hidden for **PERIOD** or **CUMULATIVE** [[BalanceType]].
   *
   * @returns This builder with respective hide dates option, for chaining.
   */  
  public hideDates(hide: boolean): BalancesDataTableBuilder {
    this.shouldHideDates = hide;
    return this;
  }

  /**
   * Defines whether the [[Accounts]] and [[Groups]] names should be hidden.
   *
   * @returns This builder with respective hide names option, for chaining.
   */    
  public hideNames(hide: boolean): BalancesDataTableBuilder {
    this.shouldHideNames = hide;
    return this;
  }

  
  /**
   * Defines whether should split **TOTAL** [[BalanceType]] into debit and credit.
   * 
   * @returns This builder with respective trial option, for chaining.
   */
   public trial(trial: boolean): BalancesDataTableBuilder {
    this.shouldTrial = trial;
    return this;
  }  
  
  /**
   * Defines whether should force use of period balances for **TOTAL** [[BalanceType]].
   * 
   * @returns This builder with respective trial option, for chaining.
   */
   public period(period: boolean): BalancesDataTableBuilder {
    this.shouldPeriod = period;
    return this;
  }  

  /**
   * Defines whether should show raw balances, no matter the credit nature of the Account or Group.
   * 
   * @returns This builder with respective trial option, for chaining.
   */
   public raw(raw: boolean): BalancesDataTableBuilder {
    this.shouldRaw = raw;
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

    if (this.balancesContainers == null) {
      return table;
    }

    this.balancesContainers.sort((a, b) => {
      if (a != null && b != null) {
        return a.getName().toLowerCase().localeCompare(b.getName().toLowerCase());
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
              return a.getName().toLowerCase().localeCompare(b.getName().toLowerCase());
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
        if (this.shouldTrial) {
          if (this.shouldFormatValue) {
            if (this.shouldPeriod) {
              line.push(balances.getPeriodDebitText());
              line.push(balances.getPeriodCreditText());
            } else {
              line.push(balances.getCumulativeDebitText());
              line.push(balances.getCumulativeCreditText());
            }
          } else {
            if (this.shouldPeriod) {
              line.push(balances.getPeriodDebit().toNumber());
              line.push(balances.getPeriodCredit().toNumber());
            } else {
              line.push(balances.getCumulativeDebit().toNumber());
              line.push(balances.getCumulativeCredit().toNumber());
            }
          }
        } else {
          if (this.shouldFormatValue) {
            if (this.shouldPeriod) {
              if (this.shouldRaw) {
                line.push(balances.getPeriodBalanceRawText());
              } else {
                line.push(balances.getPeriodBalanceText());
              }
            } else {
              if (this.shouldRaw) {
                line.push(balances.getCumulativeBalanceRawText());
              } else {
                line.push(balances.getCumulativeBalanceText());
              }
            }
          } else {
            if (this.shouldPeriod) {
              if (this.shouldRaw) {
                line.push(balances.getPeriodBalanceRaw().toNumber());
              } else {
                line.push(balances.getPeriodBalance().toNumber());
              }
            } else {
              if (this.shouldRaw) {
                line.push(balances.getCumulativeBalanceRaw().toNumber());
              } else {
                line.push(balances.getCumulativeBalance().toNumber());
              }

            }
          }
        }
        table.push(line);
      }
    }

    if (this.shouldHideNames) {
      table = table.map(row => row.slice(1));
    }

    if (this.shouldTranspose && table.length > 0) {
      table = table[0].map((col: any, i: number) => table.map(row => row[i]));
    }

    return table;
  }

  private buildTimeDataTable_() {
    var table = new Array<Array<any>>();
    var dataIndexMap: any = new Object();
    var cumulativeBalance = this.balanceType == BalanceType.CUMULATIVE;

    var header = new Array();
    header.push("");

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
            amount = balance.getCumulativeBalance();
          } else {
            amount = balance.getPeriodBalance();
          }
          indexEntry[balancesContainer.getName()] = this.shouldRaw ? amount : Utils_.getRepresentativeValue(amount, balancesContainer.isPermanent());
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
          amount = new Amount(amount);
          if (this.shouldFormatValue) {
            amount = Utils_.formatValue_(amount, this.book.getDecimalSeparator(), this.book.getFractionDigits());
          } else {
            amount = amount.toNumber();
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
            var amount: any = new Amount(0);
            if (this.shouldFormatValue) {
              amount = Utils_.formatValue_(amount, this.book.getDecimalSeparator(), this.book.getFractionDigits());
            } else {
              amount = amount.toNumber();
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
            var amount: any = new Amount(0);
            if (this.shouldFormatValue) {
              amount = Utils_.formatValue_(amount, this.book.getDecimalSeparator(), this.book.getFractionDigits());
            } else {
              amount = amount.toNumber();
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

    if (this.shouldHideNames) {
      table.shift();
    }

    if (this.shouldHideDates) {
      table = table.map(row => row.slice(1));
    }

    if (this.shouldTranspose && table.length > 0) {
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