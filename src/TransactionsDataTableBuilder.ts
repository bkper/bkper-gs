/**
 * A TransactionsDataTableBuilder is used to setup and build two-dimensional arrays containing transactions.
 * 
 * @public
 */
class TransactionsDataTableBuilder {

  private shouldFormatDates: boolean;
  private shouldFormatValues: boolean;
  private shouldAddUrls: boolean;
  private shouldAddProperties: boolean;
  private transactionIterator: TransactionIterator;
  private transactions: Array<Transaction>;
  private book: Book;
  private propertyKeys: string[];

  constructor(transactionIterator: TransactionIterator) {
    this.transactionIterator = transactionIterator;
    this.book = transactionIterator.getBook();
    this.shouldFormatDates = false;
    this.shouldFormatValues = false;
    this.shouldAddUrls = false;
    this.shouldAddProperties = false;
  }

  /**
   * Defines whether the dates should be formatted, based on date patter of the [[Book]]
   * 
   * @returns This builder with respective formatting option, for chaining.
   */
  public formatDates(format: boolean): TransactionsDataTableBuilder {
    this.shouldFormatDates = format;
    return this;
  }
  
  /**
   * Defines whether amounts should be formatted based on [[DecimalSeparator]] of the [[Book]]
   *
   * @returns This builder with respective formatting option, for chaining.
   */
  public formatValues(format: boolean): TransactionsDataTableBuilder {
    this.shouldFormatValues = format;
    return this;
  }

  /**
   * Defines whether include attachments and url links.
   * 
   * @returns This builder with respective add attachment option, for chaining.
   */
  public includeUrls(include: boolean): TransactionsDataTableBuilder {
    this.shouldAddUrls = include;
    return this;
  }

  /**
   * Defines whether include custom transaction properties.
   * 
   * @returns This builder with respective add attachment option, for chaining.
   */
  public includeProperties(include: boolean): TransactionsDataTableBuilder {
    this.shouldAddProperties = include;
    return this;
  }

  /**
   * @returns The account, when filtering by a single account.
   */  
  public getAccount(): Account {
    return this.transactionIterator.getAccount();
  }

  private getTransactions(): Array<Transaction> {
    if (this.transactions == null) {
      this.transactions = [];
      while (this.transactionIterator.hasNext()) {
        this.transactions.push(this.transactionIterator.next());
      }
    }
    return this.transactions;
  }

  public getHeaderLine(): string[] {
    var headerLine: string[] = [];

    if (this.getAccount() != null) {

      headerLine.push("Date");
      headerLine.push("Account");
      headerLine.push("Description");
      headerLine.push("Debit");
      headerLine.push("Credit");

      if (this.getAccount().isPermanent()) {
        headerLine.push("Balance");
      }

      headerLine.push("Recorded at");

      if (this.shouldAddProperties) {
        for (const key of this.getPropertyKeys()) {
          headerLine.push(key)
        }
      }

      if (this.shouldAddUrls) {
        headerLine.push("Attachment");
      }
    } else {
      headerLine.push("Date");
      headerLine.push("Origin");
      headerLine.push("Destination");
      headerLine.push("Description");
      headerLine.push("Amount");
      headerLine.push("Recorded at");

      if (this.shouldAddProperties) {
        for (const key of this.getPropertyKeys()) {
          headerLine.push(key)
        }
      }      

      if (this.shouldAddUrls) {
        headerLine.push("Attachment");
      }
    }
    return headerLine;
  }


  /**
   * @returns A two-dimensional array containing all [[Transactions]].
   */
  public build(): any[][] {
    var header = new Array();
    var dataTable = new Array();
    let headerLine = this.getHeaderLine();

    if (this.getAccount() != null) {
      dataTable = this.getExtract2DArray_(this.getAccount());
    } else {
      dataTable = this.get2DArray_();
    }

    header.push(headerLine);

    if (dataTable.length > 0) {
      dataTable.splice(0, 0, headerLine);
      dataTable = Utils_.convertInMatrix(dataTable);
      return dataTable;
    } else {
      return [headerLine];
    }
  }

  private getPropertyKeys(): string[] {
    if (this.propertyKeys == null) {
      this.propertyKeys = []
      for (const transaction of this.getTransactions()) {
        for (const key of transaction.getPropertyKeys()) {
          if (this.propertyKeys.indexOf(key) <= -1) {
            // does not contain
            this.propertyKeys.push(key)
          }
        }
      }
      this.propertyKeys = this.propertyKeys.sort();
    }
    return this.propertyKeys;
  }

  private get2DArray_() {

    var dataTable = new Array();

    for (const transaction of this.getTransactions()) {
      
      var line = new Array();

      if (this.shouldFormatDates) {
        line.push(transaction.getDateFormatted());
      } else {
        line.push(transaction.getDateObject());
      }

      line.push(transaction.getCreditAccountName());
      line.push(transaction.getDebitAccountName());

      if (transaction.getDescription() != null) {
        line.push(transaction.getDescription());
      } else {
        line.push("");
      }
      if (transaction.getAmount() != null) {
        if (this.shouldFormatValues) {
          var decimalSeparator = this.book.getDecimalSeparator();
          var fractionDigits = this.book.getFractionDigits();
          line.push(Utils_.formatValue_(transaction.getAmount(), decimalSeparator, fractionDigits));
        } else {
          line.push(transaction.getAmount().toNumber());
        }
      } else {
        line.push("");
      }

      if (this.shouldFormatDates) {
        line.push(transaction.getCreatedAtFormatted());
      } else {
        line.push(transaction.getCreatedAt());
      }


      if (this.shouldAddProperties) {
        this.addPropertiesToLine(line, transaction);
      }      


      var urls = transaction.getUrls();

      if (urls == null) {
        urls = [];
      }
      let files = transaction.getFiles();
      if (files != null) {
        urls = urls.concat(files.map(f => f.getUrl()))
      }

      if (this.shouldAddUrls && urls != null && urls.length > 0) {
        for (var i = 0; i < urls.length; i++) {
          line.push(urls[i]);
        }
      } else if (this.shouldAddUrls) {
        line.push("");
      }

      dataTable.push(line);
    }

    return dataTable;
  }

  private addPropertiesToLine(line: any[], transaction: Transaction) {
    let lineLength = line.length;
    for (const key of this.getPropertyKeys()) {
      line.push("");
    }
    for (const key of transaction.getPropertyKeys()) {
      let index = this.getPropertyKeys().indexOf(key) + lineLength;
      line[index] = transaction.getProperty(key);
    }
  }

  private getExtract2DArray_(account: Account): any[][] {

    var dataTable = new Array<Array<any>>();

    for (const transaction of this.getTransactions()) {

      var line = new Array();

      if (this.shouldFormatDates) {
        line.push(transaction.getDateFormatted());
      } else {
        line.push(transaction.getDateObject());
      }

      if (transaction.getCreditAccount() != null && transaction.getDebitAccount() != null) {

        if (this.isCreditOnTransaction_(transaction, account)) {
          line.push(transaction.getDebitAccount().getName());
        } else {
          line.push(transaction.getCreditAccount().getName());
        }

      } else {
        line.push("");
      }
      if (transaction.getDescription() != null) {
        line.push(transaction.getDescription());
      } else {
        line.push("");
      }


      if (transaction.getAmount() != null) {

        var amount: string | Amount = transaction.getAmount();

        if (this.shouldFormatValues) {
          amount = Utils_.formatValue_(transaction.getAmount(), this.book.getDecimalSeparator(), this.book.getFractionDigits());
        };

        if (this.isCreditOnTransaction_(transaction, account)) {
          line.push("");
          line.push(amount);
        } else {
          line.push(amount);
          line.push("");
        }
      } else {
        line.push("");
        line.push("");
      }

      if (account.isPermanent()) {
        if (transaction.getAccountBalance() != null) {
          var balance: string | Amount = transaction.getAccountBalance();
          if (this.shouldFormatValues) {
            balance = Utils_.formatValue_(balance, this.book.getDecimalSeparator(), this.book.getFractionDigits());
          };
          line.push(balance);
        } else {
          line.push("");
        }
      }

      if (this.shouldFormatDates) {
        line.push(transaction.getCreatedAtFormatted());
      } else {
        line.push(transaction.getCreatedAt());
      }

      if (this.shouldAddProperties) {
        this.addPropertiesToLine(line, transaction);
      }  

      var urls = transaction.getUrls();
      if (this.shouldAddUrls && urls != null && urls.length > 0) {
        for (var i = 0; i < urls.length; i++) {
          line.push(urls[i]);
        }
      } else if (this.shouldAddUrls) {
        line.push("");
      }

      dataTable.push(line);
    }
    return dataTable;
  }

  private isCreditOnTransaction_(transaction: Transaction, account: Account) {
    if (transaction.getCreditAccount() == null) {
      return false;
    }
    return transaction.getCreditAccount().getId() == account.getId();
  }




/******************* DEPRECATED METHODS *******************/


  /**
   * @deprecated
   */
  getFilteredByAccount(): Account {
    return this.getAccount();
  }  
  
  /**
   * @deprecated
   */
  formatDate(): TransactionsDataTableBuilder {
    return this.formatDates(true);
  }
  
  /**
   * @deprecated
   */
  formatValue(): TransactionsDataTableBuilder {
    return this.formatValues(true);
  }
  
  /**
   * @deprecated
   */
  addUrls(): TransactionsDataTableBuilder {
    return this.includeUrls(true);
  }

}

