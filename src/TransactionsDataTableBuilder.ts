/**
 * A TransactionsDataTableBuilder is used to setup and build two-dimensional arrays containing transactions.
 * 
 * @public
 */
class TransactionsDataTableBuilder {

  private transactionIterator: TransactionIterator;
  private shouldFormatDates: boolean;
  private shouldFormatValues: boolean;
  private shouldAddUrls: boolean;

  constructor(transactionIterator: TransactionIterator) {
    this.transactionIterator = transactionIterator;
    this.shouldFormatDates = false;
    this.shouldFormatValues = false;
    this.shouldAddUrls = false;
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
   * @returns The account, when filtering by a single account.
   */  
  public getAccount(): Account {
    return this.transactionIterator.getAccount();
  }

  /**
   * @returns A two-dimensional array containing all [[Transactions]].
   */
  public build(): any[][] {
    var account = this.transactionIterator.getAccount();
    var header = new Array();
    var transactions = new Array();
    var finalArray = new Array();
    var headerLine = new Array();

    if (account != null) {

      headerLine.push("Date");
      headerLine.push("Account");
      headerLine.push("Description");
      headerLine.push("Debit");
      headerLine.push("Credit");

      transactions = this.getExtract2DArray_(this.transactionIterator, account);
      if (account.isPermanent()) {
        headerLine.push("Balance");
      }

      headerLine.push("Recorded at");
      if (this.shouldAddUrls) {
        headerLine.push("Attachment");
      }
      header.push(headerLine);
    } else {
      headerLine.push("Date");
      headerLine.push("Origin");
      headerLine.push("Destination");
      headerLine.push("Description");
      headerLine.push("Amount");
      headerLine.push("Recorded at");

      if (this.shouldAddUrls) {
        headerLine.push("Attachment");
      }
      transactions = this.get2DArray_(this.transactionIterator);
      header.push(headerLine);
    }

    if (transactions.length > 0) {
      transactions.splice(0, 0, headerLine);
      transactions = Utils_.convertInMatrix(transactions);
      return transactions;
    } else {
      return [headerLine];
    }
  }

  private get2DArray_(iterator: TransactionIterator) {
    var transactions = new Array();

    while (iterator.hasNext()) {
      var transaction = iterator.next();

      var line = new Array();

      if (this.shouldFormatDates) {
        line.push(transaction.getInformedDateText());
      } else {
        line.push(transaction.getInformedDate());
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
          var decimalSeparator = iterator.getBook().getDecimalSeparator();
          var fractionDigits = iterator.getBook().getFractionDigits();
          line.push(Utils_.formatValue_(transaction.getAmount(), decimalSeparator, fractionDigits));
        } else {
          line.push(transaction.getAmount());
        }
      } else {
        line.push("");
      }

      if (this.shouldFormatDates) {
        line.push(transaction.getPostDateText());
      } else {
        line.push(transaction.getPostDate());
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

      transactions.push(line);
    }

    return transactions;
  }

  private getExtract2DArray_(iterator: TransactionIterator, account: Account): any[][] {
    var transactions = new Array<Array<any>>();

    while (iterator.hasNext()) {
      var transaction = iterator.next();
      var line = new Array();

      if (this.shouldFormatDates) {
        line.push(transaction.getInformedDateText());
      } else {
        line.push(transaction.getInformedDate());
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

        var amount: string | Big = transaction.getAmount();

        if (this.shouldFormatValues) {
          amount = Utils_.formatValue_(transaction.getAmount(), iterator.getBook().getDecimalSeparator(), iterator.getBook().getFractionDigits());
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
          var balance: string | Big = transaction.getAccountBalance();
          if (this.shouldFormatValues) {
            balance = Utils_.formatValue_(balance, iterator.getBook().getDecimalSeparator(), iterator.getBook().getFractionDigits());
          };
          line.push(balance);
        } else {
          line.push("");
        }
      }

      if (this.shouldFormatDates) {
        line.push(transaction.getPostDateText());
      } else {
        line.push(transaction.getPostDate());
      }

      var urls = transaction.getUrls();
      if (this.shouldAddUrls && urls != null && urls.length > 0) {
        for (var i = 0; i < urls.length; i++) {
          line.push(urls[i]);
        }
      } else if (this.shouldAddUrls) {
        line.push("");
      }

      transactions.push(line);
    }
    return transactions;
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

