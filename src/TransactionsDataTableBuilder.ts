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
  private shouldAddIds: boolean;
  private transactionIterator: TransactionIterator;
  private transactions: Array<Transaction>;
  private book: Book;
  private propertyKeys: string[];
  private attachmentHeaders: string[];
  private remoteIdHeaders: string[];

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
   * @returns This builder with respective include attachment option, for chaining.
   */
  public includeUrls(include: boolean): TransactionsDataTableBuilder {
    this.shouldAddUrls = include;
    return this;
  }

  /**
   * Defines whether include custom transaction properties.
   * 
   * @returns This builder with respective include properties option, for chaining.
   */
  public includeProperties(include: boolean): TransactionsDataTableBuilder {
    this.shouldAddProperties = include;
    return this;
  }

  /**
   * Defines whether include transaction ids.
   * 
   * @returns This builder with respective include ids option, for chaining.
   */
  public includeIds(include: boolean): TransactionsDataTableBuilder {
    this.shouldAddIds = include;
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

  private getHeaderLine(): string[] {
    var headerLine: string[] = [];

    if (this.getAccount() != null) {

      if (this.shouldAddIds) {
        headerLine.push("Id");
      }

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

      if (this.shouldAddIds) {
        for (const remoteIdHeader of this.getRemoteIdHeaders()) {
          headerLine.push(remoteIdHeader)
        }
      }

      if (this.shouldAddUrls) {
        for (const attachmentHeader of this.getAttachmentHeaders()) {
          headerLine.push(attachmentHeader)
        }
      }
    } else {

      if (this.shouldAddIds) {
        headerLine.push("Id");
      }

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
      
      if (this.shouldAddIds) {
        for (const remoteIdHeader of this.getRemoteIdHeaders()) {
          headerLine.push(remoteIdHeader)
        }
      }      

      if (this.shouldAddUrls) {
        for (const attachmentHeader of this.getAttachmentHeaders()) {
          headerLine.push(attachmentHeader)
        }
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

  private getAttachmentHeaders(): string[] {
    if (this.attachmentHeaders == null) {
      this.attachmentHeaders = []
      for (const transaction of this.getTransactions()) {
        let urls = this.getUrls(transaction);
        if (urls.length > this.attachmentHeaders.length) {
          this.attachmentHeaders = [];
          urls.forEach(url => this.attachmentHeaders.push("Attachment"))
        }
      }
    }
    return this.attachmentHeaders;
  }
  private getRemoteIdHeaders(): string[] {
    if (this.remoteIdHeaders == null) {
      this.remoteIdHeaders = []
      for (const transaction of this.getTransactions()) {
        let remoteIds = transaction.getRemoteIds();
        if (remoteIds && remoteIds.length > this.remoteIdHeaders.length) {
          this.remoteIdHeaders = [];
          remoteIds.forEach(remoteId => this.remoteIdHeaders.push("Remote Id"))
        }
      }
    }
    return this.remoteIdHeaders;
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

      if (this.shouldAddIds) {
        line.push(transaction.getId());
      }      

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

      if (this.shouldAddIds) {
        this.addRemoteIdsToLine(line, transaction);
      }

      if (this.shouldAddUrls) {
        this.addUrlsToLine(line, transaction);
      }

      dataTable.push(line);
    }

    return dataTable;
  }

  private getExtract2DArray_(account: Account): any[][] {

    var dataTable = new Array<Array<any>>();

    for (const transaction of this.getTransactions()) {

      var line = new Array();

      if (this.shouldAddIds) {
        line.push(transaction.getId());
      }

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

        var amount: string | number | Amount = transaction.getAmount();

        if (this.shouldFormatValues) {
          amount = Utils_.formatValue_(transaction.getAmount(), this.book.getDecimalSeparator(), this.book.getFractionDigits());
        } else {
          amount = amount.toNumber()
        }

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
          var balance: string | number | Amount = transaction.getAccountBalance();
          if (this.shouldFormatValues) {
            balance = Utils_.formatValue_(balance, this.book.getDecimalSeparator(), this.book.getFractionDigits());
          } else {
            balance = balance.toNumber()
          }
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

      if (this.shouldAddIds) {
        this.addRemoteIdsToLine(line, transaction);
      }

      if (this.shouldAddUrls) {
        this.addUrlsToLine(line, transaction);
      }

      dataTable.push(line);
    }
    return dataTable;
  }

  private addUrlsToLine(line: any[], transaction: Transaction) {
    let lineLength = line.length;
    for (const key of this.getAttachmentHeaders()) {
      line.push("");
    }
    let urls = this.getUrls(transaction);
    for (let index = lineLength; index < lineLength+urls.length; index++) {
      line[index] = urls[index-lineLength];
    }
  }

  private addRemoteIdsToLine(line: any[], transaction: Transaction) {
    let lineLength = line.length;
    for (const key of this.getRemoteIdHeaders()) {
      line.push("");
    }
    if (transaction.getRemoteIds()) {
      for (let index = lineLength; index < lineLength+transaction.getRemoteIds().length; index++) {
        line[index] = transaction.getRemoteIds()[index-lineLength];
      }
    }
  }


  private isCreditOnTransaction_(transaction: Transaction, account: Account) {
    if (transaction.getCreditAccount() == null) {
      return false;
    }
    return transaction.getCreditAccount().getId() == account.getId();
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


  private getUrls(transaction: Transaction):  string[] {
    var urls = transaction.getUrls();
    if (urls == null) {
      urls = [];
    }
    let files = transaction.getFiles();
    if (files != null) {
      urls = urls.concat(files.map(f => f.getUrl()))
    }
    return urls;
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

