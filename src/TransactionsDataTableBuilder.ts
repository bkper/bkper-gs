
class TransactionsDataTableBuilder implements GoogleAppsScript.Bkper.TransactionsDataTableBuilder {

  private transactionIterator: TransactionIterator;
  private shouldFormatDate: boolean;
  private shouldFormatValue: boolean;
  private shouldAddUrls: boolean;

  /**
   * @ignore
   */
  constructor(transactionIterator: TransactionIterator) {
    this.transactionIterator = transactionIterator;
    this.shouldFormatDate = false;
    this.shouldFormatValue = false;
    this.shouldAddUrls = false;
  }

  /**
   * @inheritdoc
   */
  public formatDate(): TransactionsDataTableBuilder {
    this.shouldFormatDate = true;
    return this;
  }

  /**
   * @inheritdoc
   */
  public formatValue(): TransactionsDataTableBuilder {
    this.shouldFormatValue = true;
    return this;
  }

  /**
   * @inheritdoc
   */
  public addUrls(): TransactionsDataTableBuilder {
    this.shouldAddUrls = true;
    return this;
  }

  /**
   * @inheritdoc
   */
  public build(): any[][] {
    var filteredByAccount = this.transactionIterator.getFilteredByAccount();
    var header = new Array();
    var transactions = new Array();
    var finalArray = new Array();
    var headerLine = new Array();

    if (filteredByAccount != null) {

      headerLine.push("Date");
      headerLine.push("Account");
      headerLine.push("Description");
      headerLine.push("Debit");
      headerLine.push("Credit");

      transactions = this.getExtract2DArray_(this.transactionIterator, filteredByAccount);
      if (filteredByAccount.isPermanent()) {
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
      //@ts-ignore
      transactions = BkperUtils.convertInMatrix(transactions);
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

      if (this.shouldFormatDate) {
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
        if (this.shouldFormatValue) {
          var decimalSeparator = iterator.getBook().getDecimalSeparator();
          var fractionDigits = iterator.getBook().getFractionDigits();
          line.push(Utils_.formatValue_(transaction.getAmount(), decimalSeparator, fractionDigits));
        } else {
          line.push(transaction.getAmount());
        }
      } else {
        line.push("");
      }

      if (this.shouldFormatDate) {
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

  private getExtract2DArray_(iterator: TransactionIterator, account: Account): any[][] {
    var transactions = new Array<Array<any>>();

    while (iterator.hasNext()) {
      var transaction = iterator.next();
      var line = new Array();

      if (this.shouldFormatDate) {
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

        var amount: string | number = transaction.getAmount();

        if (this.shouldFormatValue) {
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
          var balance: string | number = transaction.getAccountBalance();
          if (this.shouldFormatValue) {
            balance = Utils_.formatValue_(balance, iterator.getBook().getDecimalSeparator(), iterator.getBook().getFractionDigits());
          };
          line.push(balance);
        } else {
          line.push("");
        }
      }

      if (this.shouldFormatDate) {
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

}

