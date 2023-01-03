
type IndexEntry = {
    date?: Date;
    amount?:  Amount;
    property?: string;
}
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
  private shouldTranspose: boolean;
  private shouldTrial: boolean;
  private shouldPeriod: boolean;
  private shouldRaw: boolean;
  private shouldAddProperties: boolean;
  private maxDepth = 0;
  private expandAllAccounts = false;
  private expandAllGroups = false;
  private skipRoot = false;


  constructor(book: Book, balancesContainers: BalancesContainer[], periodicity: Periodicity) {
    this.book = book;
    this.balancesContainers = balancesContainers;
    this.periodicity = periodicity;
    this.balanceType = BalanceType.TOTAL;
    this.shouldFormatDate = false;
    this.shouldHideDates = false;
    this.shouldHideNames = false;
    this.shouldFormatValue = false;
    this.shouldTranspose = false;
    this.shouldTrial = false;
    this.shouldPeriod = false;
    this.shouldRaw = false;
    this.shouldAddProperties = false;
  }

  private getBalance(balance: Amount, permanent: boolean): number {
    return this.getRepresentativeBalance(balance, permanent).toNumber();
  }
  private getRepresentativeBalance(balance: Amount, permanent: boolean): Amount {

    if (balance == null) {
      return new Amount(0);
    }
  
    if (permanent) {
      return balance.times(-1);
    }

    return balance;
  }

  private getBalanceText(balance: Amount, permanent: boolean): string {
    return this.book.formatAmount(this.getRepresentativeBalance(balance, permanent));
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
   * Defines whether Groups should expand its child accounts. true to expand itself, -1 to expand all subgroups. -2 to expand all accounts.
   * 
   * 
   * @returns This builder with respective expanded option, for chaining.
   */
  public expanded(expanded: boolean|number): BalancesDataTableBuilder {
    if (typeof expanded == "boolean" && expanded == true) {
        this.maxDepth = 1;
        this.skipRoot = true;
    } else if (expanded == -1) {
        this.expandAllGroups = true;
    } else if (expanded == -2) {
        this.expandAllAccounts = true;
    } else if (typeof expanded == "number" && expanded > 0) {
        this.maxDepth = expanded;
    }
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
   *  | Expenses  | -4568.23 |
   *  | Income    |  5678.93 |
   *  |    ...    |    ...   |
   *  |___________|__________|
   * 
   * ```
   * Two columns, and each [[Account]] or [[Group]] per line.
   * 
   * For **PERIOD** or **CUMULATIVE** [[BalanceType]], the table will be a time table, and the format looks like:
   * 
   * ```
   *  _____________________________________________
   *  |            |  Expenses | Income  |    ...   |
   *  | 15/01/2014 | -2345.23  | 3452.93 |    ...   |
   *  | 15/02/2014 | -2345.93  | 3456.46 |    ...   |
   *  | 15/03/2014 | -2456.45  | 3567.87 |    ...   |
   *  |    ...     |    ...    |   ...   |    ...   |
   *  |____________|___________|_________|__________|
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
   *  |  Expenses | Income  |  ...  | 
   *  | -4568.23  | 5678.93 |  ...  |
   *  |___________|_________|_______| 
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
   *  |  Expenses  | -2345.23   | -2345.93   | -2456.45   |    ...    |
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
     * Defines whether include custom [[Accounts]] and [[Groups]] properties.
     * 
     * @returns This builder with respective include properties option, for chaining.
     */
    public properties(include: boolean): BalancesDataTableBuilder {
        this.shouldAddProperties = include;
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

    private addPropertyKeys(propertyKeys: string[], container: BalancesContainer) {
        for (const key of container.getPropertyKeys()) {
            if (propertyKeys.indexOf(key) <= -1) {
                propertyKeys.push(key);
            }
        }
    }

    private flattenContainers(containersFlat: BalancesContainer[], propertyKeys: string[]): void {
        for (const container of this.balancesContainers) {
            if (this.expandAllAccounts) {
                this.flattenAllAccounts(container, containersFlat, propertyKeys);
                containersFlat.sort(this.sortContainersFunction);
            } else if (this.expandAllGroups) {
                this.flattenAllGroups(container, containersFlat, propertyKeys)
            } else {
                this.flattenMaxDepth(container, containersFlat, propertyKeys)
            }
        }
    }

    private flattenAllAccounts(container: BalancesContainer, containersFlat: BalancesContainer[], propertyKeys: string[]): void {
        if (container.isFromGroup()) {
            for (const child of container.getBalancesContainers()) {
                this.flattenAllAccounts(child, containersFlat, propertyKeys)
            }
        } else {
            containersFlat.push(container);
            if (this.shouldAddProperties) {
                this.addPropertyKeys(propertyKeys, container)
            } 
        }
    }
    
    private sortContainersFunction(a: BalancesContainer, b: BalancesContainer) {
        let ret = 0;
        if (a.isPermanent() && !b.isPermanent()) {
            ret = -1
        } else if (!a.isPermanent() && b.isPermanent()) {
            ret = 1
        }
        if (ret == 0) {
            if (a.getParent() && !b.getParent()) {
                ret = -1
            } else if (!a.getParent() && b.getParent()) {
                ret = 1
            }
        }
        if (ret == 0) {
            ret = getBalanceTypeOrdinal(a) - getBalanceTypeOrdinal(b);
        }
        if (ret == 0) {
            ret = a.getName().toLowerCase().localeCompare(b.getName().toLowerCase());
        }

        function getBalanceTypeOrdinal(bc: BalancesContainer): number {
            // ASSET(true, false, "asset"),
            if (bc.isPermanent() && !bc.isCredit()) {
                return 0;
            }
            // LIABILITY(true, true, "liability"),
            if (bc.isPermanent() && bc.isCredit()) {
                return 1;
            }
    
            // INCOMING(false, true, "incoming"),
            if (!bc.isPermanent() && bc.isCredit()) {
                return 2;
            }
            if (!bc.isPermanent() && !bc.isCredit()) {
                return 3;
            }
            return 4;
        }

        return ret;
    }


    private flattenMaxDepth(container: BalancesContainer, containersFlat: BalancesContainer[], propertyKeys: string[]): void {
        let depth = container.getDepth();

        if (depth <= this.maxDepth) {
            
            if (!this.skipRoot) {
                //@ts-ignore
                container.json.name = Utils_.repeatString(" ", depth * 4) + container.json.name;
            }
            if (!this.skipRoot || depth != 0) {
                containersFlat.push(container);
                if (this.shouldAddProperties) {
                    this.addPropertyKeys(propertyKeys, container)
                } 
            }
            const children = container.getBalancesContainers();
            if (children && children.length > 0) {
                children.sort(this.sortContainersFunction);
                for (const child of children) {
                    this.flattenMaxDepth(child, containersFlat, propertyKeys)
                }
            }
        }
    }    

    private flattenAllGroups(container: BalancesContainer, containersFlat: BalancesContainer[], propertyKeys: string[]): void {
        if (container.isFromGroup()) {
            let depth = container.getDepth();
            //@ts-ignore
            container.json.name = Utils_.repeatString(" ", depth * 4) + container.json.name;
            containersFlat.push(container);
            if (this.shouldAddProperties) {
                this.addPropertyKeys(propertyKeys, container)
            } 
            if (container.hasGroupBalances()) {
                const children = container.getBalancesContainers();
                children.sort(this.sortContainersFunction);
                for (const child of children) {
                    this.flattenAllGroups(child, containersFlat, propertyKeys)
                }
            }
        }
    }    
    


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

    let propertyKeys: string[] = [];

    let containers = new Array<BalancesContainer>();
    this.flattenContainers(containers, propertyKeys)

    if (this.shouldAddProperties) {
        propertyKeys.sort();
        let header = [ 'name', 'balance'];
        for (const key of propertyKeys) {
            header.push(key);
        }
        table.push(header);
    }

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
                line.push(this.getBalanceText(balances.getPeriodBalanceRaw(), balances.isPermanent()));
              }
            } else {
              if (this.shouldRaw) {
                line.push(balances.getCumulativeBalanceRawText());
              } else {
                line.push(this.getBalanceText(balances.getCumulativeBalanceRaw(), balances.isPermanent()));
              }
            }
          } else {
            if (this.shouldPeriod) {
              if (this.shouldRaw) {
                line.push(balances.getPeriodBalanceRaw().toNumber());
              } else {
                line.push(this.getBalance(balances.getPeriodBalanceRaw(), balances.isPermanent()));
              }
            } else {
              if (this.shouldRaw) {
                line.push(balances.getCumulativeBalanceRaw().toNumber());
              } else {
                line.push(this.getBalance(balances.getCumulativeBalanceRaw(), balances.isPermanent()));
              }

            }
          }
        }

        if (this.shouldAddProperties) {
            const properties = balances.getProperties();
            for (const key of propertyKeys) {
              let propertyValue = properties[key];
              if (propertyValue) {
                line.push(propertyValue);
                continue;
              }
              line.push('');
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
    let propertyKeys: string[] = [];
    let containers = new Array<BalancesContainer>();

    this.flattenContainers(containers, propertyKeys);

    for (const container of containers) {
      header.push(container.getName());

      var balances = container.getBalances();

      if (balances != null) {
        for (const balance of balances) {
          var fuzzyDate = balance.getFuzzyDate();
          var indexEntry = dataIndexMap[fuzzyDate];
          if (indexEntry == null) {
            indexEntry = {};
            indexEntry.date = balance.getDate();
            dataIndexMap[fuzzyDate] = indexEntry;
          }
          var amount;
          if (cumulativeBalance) {
            amount = balance.getCumulativeBalanceRaw();
          } else {
            amount = balance.getPeriodBalanceRaw();
          }
          indexEntry[container.getName()] = this.shouldRaw ? amount : this.getRepresentativeBalance(amount, container.isPermanent());
        }
      }
    }
    

    table.push(header);

    var rows = new Array<Array<any>>();
    for (var fuzzy in dataIndexMap) {
      var rowObject = dataIndexMap[fuzzy];
      var row = new Array();
      row.push(rowObject.date);
      for (const container of containers) {
        var amount = rowObject[container.getName()];
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

    if (this.shouldAddProperties) {
        propertyKeys.sort();
        for (const key of propertyKeys) {
            var propertyRow: string[] = [key];
            for (const container of containers) {
                propertyRow.push(container.getProperty(key))
            }
            table.push(propertyRow);
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