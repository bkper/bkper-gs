/**
@class
A TransactionsDataTableBuilder is used to setup and build two-dimensional arrays containing transactions.
*/
function TransactionsDataTableBuilder(transactionIterator) {
  this.transactionIterator = transactionIterator;
  this.shouldFormatDate = false;
  this.shouldFormatValue = false;
  this.timeZone;

  /**
  Defines whether the dates should be formatted based on {@link Book#getDatePattern|date pattern of book}
  @param {string} [timeZone] The time zone to format dates.
  @returns {@link TransactionsDataTableBuilder|TransactionsDataTableBuilder} the builder with respective formatting option.
  */
  TransactionsDataTableBuilder.prototype.formatDate = function(timeZone) {
    this.shouldFormatDate = true;
    if (timeZone == null) {
      timeZone = Session.getScriptTimeZone();
    }
    this.timeZone = timeZone;
    return this;
  }
  /**
  Defines whether the value should be formatted based on {@link Book#getDecimalSeparator|decimal separator of book}
  @returns {@link TransactionsDataTableBuilder|TransactionsDataTableBuilder} the builder with respective formatting option.
  */
  TransactionsDataTableBuilder.prototype.formatValue = function() {
    this.shouldFormatValue = true;
    return this;
  }
  /**
  @returns {Array} an two-dimensional array containing all {@link Transaction|transactions}.
  */
  TransactionsDataTableBuilder.prototype.build = function() {
    var filteredByAccount = transactionIterator.getFilteredByAccount();

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

      transactions = this.getExtract2DArray_(transactionIterator, filteredByAccount);
      if (filteredByAccount.isPermanent()) {
        numOfCoulmns = 6;
        headerLine.push("Balance");
      }
      header.push(headerLine);
    } else {
      headerLine.push("Date");
      headerLine.push("Origin");
      headerLine.push("Destination");
      headerLine.push("Description");
      headerLine.push("Amount");
      transactions = this.get2DArray_(transactionIterator);
      header.push(headerLine);
    }

    if (transactions.length > 0) {
      transactions.splice(0, 0, headerLine);
      return transactions;
    } else {
      return [headerLine];
    }
  }

  TransactionsDataTableBuilder.prototype.get2DArray_ = function(iterator) {
    var transactions = new Array();

    while (iterator.hasNext()) {
      var transaction = iterator.next();

      var line = new Array();

      if (this.shouldFormatDate) {
        var pattern = iterator.book.getDatePattern();
        line.push(Utils_.formatDate(transaction.getInformedDate(), pattern, this.timeZone));
      } else {
        line.push(transaction.getInformedDate());
      }

      line.push(transaction.getCreditAccountName());
      line.push(transaction.getDebitAccountName());

      if (transaction.getDescription() != null) {
        line.push(transaction.getDescription());
      } else{
        line.push("");
      }
      if (transaction.getAmount() != null) {
        if (this.shouldFormatValue) {
          var decimalSeparator = iterator.book.getDecimalSeparator();
          var fractionDigits = iterator.book.getFractionDigits();
          line.push(Utils_.formatValue_(transaction.getAmount(), decimalSeparator, fractionDigits));
        } else {
          line.push(transaction.getAmount());
        }
      } else{
        line.push("");
      }

      transactions.push(line);
    }

    return transactions;
  }

  TransactionsDataTableBuilder.prototype.getExtract2DArray_ = function(iterator, account) {
    var transactions = new Array();

    while (iterator.hasNext()) {
      var transaction = iterator.next();
      var line = new Array();

      if (this.shouldFormatDate) {
        line.push(Utils_.formatDate(transaction.getInformedDate(), iterator.book.getDatePattern(), this.timeZone));
      } else {
        line.push(transaction.getInformedDate());
      }

      if (transaction.getCreditAccount() != null && transaction.getDebitAccount() != null) {

        if (this.isCreditOnTransaction_(transaction, account)) {
          line.push(transaction.getDebitAccount().getName());
        } else {
          line.push(transaction.getCreditAccount().getName());
        }

      } else{
        line.push("");
      }
      if (transaction.getDescription() != null) {
        line.push(transaction.getDescription());
      } else{
        line.push("");
      }
      

      if (transaction.getAmount() != null) {

        var amount = transaction.getAmount();

        if (this.shouldFormatValue) {
          amount = Utils_.formatValue_(transaction.getAmount(), iterator.book.getDecimalSeparator(), iterator.book.getFractionDigits());
        };

        if (this.isCreditOnTransaction_(transaction, account)) {
          line.push("");
          line.push(amount);
        } else {
          line.push(amount);
          line.push("");
        }
      } else{
        line.push("");
        line.push("");
      }

      if (account.isPermanent()) {
        if (transaction.getAccountBalance() != null) {
          var balance = transaction.getAccountBalance();
          if (this.shouldFormatValue) {
            balance = Utils_.formatValue_(balance, iterator.book.getDecimalSeparator(), iterator.book.getFractionDigits());
          };
          line.push(balance);
        } else{
          line.push("");
        }
      }

      transactions.push(line);
    }

    return transactions;
  }

  TransactionsDataTableBuilder.prototype.isCreditOnTransaction_ = function(transaction, account) {
    if (transaction.getCreditAccount() == null) {
      return false;
    }
    return transaction.getCreditAccount().getId() == account.getId();
  }

}

