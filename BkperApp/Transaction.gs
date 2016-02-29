/**

@classdesc
This class defines a Transaction between {@link http://en.wikipedia.org/wiki/Debits_and_credits|credit and debit} {@link Account|Accounts}.
<br/>
<br/>
A Transaction is the main entity on the {@link http://en.wikipedia.org/wiki/Double-entry_bookkeeping_system|Double Entry} {@link http://en.wikipedia.org/wiki/Bookkeeping|Bookkeeping} system.
<br/>
Transactions are also used for {@link http://en.wikipedia.org/wiki/Single-entry_bookkeeping_system|Single Entry process} when using {@link http://en.wikipedia.org/wiki/Hashtag|#hashtags} in its {@link Transaction#setDescription|description}.
@constructor

*/
function Transaction() {

  /**
  @returns {string} The id of this Transaction
  */
  Transaction.prototype.getId = function() {
    return this.wrapped.id;
  }

  /**
  @returns {boolean} True if transaction is already posted. False otherwise.
  */
  Transaction.prototype.isPosted = function() {
    return this.wrapped.posted;
  }

  /**
  @returns {Array<String>} All #hashtags used on this transaction
  */
  Transaction.prototype.getTags = function() {
    return this.wrapped.tags;
  }
  
  /**
  @returns {Array<String>} All urls used on this transaction
  */
  Transaction.prototype.getUrls = function() {
    return this.wrapped.urls;
  }  

  /**
  @param {string} tag The #hashtag to check
  @returns {boolean} true if has this tag
  */
  Transaction.prototype.hasTag = function(tag) {

    var tags = this.getTags();

    for (var i = 0; i < tags.length; i++) {
      if (tags[i] == tag) {
        return true;
      }
    }

    return false;
  }





  //ORIGIN ACCOUNT
  /**
  @returns {Account} The credit account. The same as origin account.
  */
  Transaction.prototype.getCreditAccount = function() {
    return this.creditAccount;
  }

  /**
  @returns {string} The credit account name.
  */
  Transaction.prototype.getCreditAccountName = function() {
    if (this.getCreditAccount() != null) {
      return this.getCreditAccount().getName();
    } else{
      return "";
    }
  }



  //DESTINATION ACCOUNT
  /**
  @returns {Account} The debit account. The same as destination account.
  */
  Transaction.prototype.getDebitAccount = function() {
    return this.debitAccount;
  }

  /**
  @returns {string} The debit account name.
  */
  Transaction.prototype.getDebitAccountName = function() {
    if (this.getDebitAccount() != null) {
      return this.getDebitAccount().getName();
    } else{
      return "";
    }
  }


  //AMOUNT
  /**
  @param {boolean} format Formats the amount according to {@link Book#getDecimalSeparator|decimal separator of book}
  @returns {number} The amount of this transaction
  */
  Transaction.prototype.getAmount = function(format) {
    if (format) {
      return this.book.formatValue(this.wrapped.amount);
    }
    return this.wrapped.amount;
  }

  /**
  @param {Account|string} account The account object, id or name
  @returns {number} The absolute amount of this transaction if the given account is at the credit side, else null
  */
  Transaction.prototype.getCreditAmount = function(account) {
    account = this.getAccount_(account);
    if (this.isCreditOnTransaction_(account)) {
      return this.getAmount();
    }
    return null;
  }

  /**
  @param {Account|string} account The account object, id or name
  @returns {number} The absolute amount of this transaction if the given account is at the debit side, else null
  */
  Transaction.prototype.getDebitAmount = function(account) {
    account = this.getAccount_(account);
    if (this.isDebitOnTransaction_(account)) {
      return this.getAmount();
    }
    return null;
  }

  /**
  @param {Account|string} account The account object, id or name
  @returns {Account} The account at the other side of the transaction given one side.
  */
  Transaction.prototype.getOtherAccount = function(account) {
    account = this.getAccount_(account);
    if (this.isCreditOnTransaction_(account)) {
      return this.getDebitAccount();
    }
    if (this.isDebitOnTransaction_(account)) {
      return this.getCreditAccount();
    }
    return null;
  }


  /**
  @param {Account|string} account The account object, id or name
  @returns {Account} The account name at the other side of the transaction given one side.
  */
  Transaction.prototype.getOtherAccountName = function(account) {
    var otherAccount = this.getOtherAccount(account);
    if (otherAccount != null) {
      return otherAccount.getName();
    } else {
      return "";
    }
  }

  Transaction.prototype.getAccount_ = function(account) {
    if (account == null || account.getId) {
      return account;
    }
    return this.book.getAccount(account);
  }

  Transaction.prototype.isCreditOnTransaction_ = function(account) {
    return this.getCreditAccount() != null && account != null && this.getCreditAccount().getId() == account.getId();
  }

  Transaction.prototype.isDebitOnTransaction_ = function(account) {
    return this.getDebitAccount() != null && account != null && this.getDebitAccount().getId() == account.getId();
  }




  //DESCRIPTION
  /**
  @returns {string} The description of this transaction
  @see {Transaction#setDescription}
  */
  Transaction.prototype.getDescription = function() {
    if (this.wrapped.description == null) {
      return "";
    }
    return this.wrapped.description;
  }



  //INFORMED DATE
  /**
  @returns {Date} The date the user informed for this transaction, adjusted to book's time zone
  */
  Transaction.prototype.getInformedDate = function() {
    if (this.informedDate == null) {
      this.informedDate = Utils_.convertValueToDate(this.getInformedDateValue(), this.book.getTimeZoneOffset());
    }
    return this.informedDate;
  }


  /**
  @returns {number} The date the user informed for this transaction. The number format is YYYYMMDD
  */
  Transaction.prototype.getInformedDateValue = function() {
      return this.informedDateValue;
  }

  /**
  @returns {string} The date the user informed for this transaction, formatted according to {@link Book#getDatePattern|date pattern of book}
  */
  Transaction.prototype.getInformedDateText = function() {
      return this.informedDateText;
  }

  //POST DATE
  /**
  @returns {Date} The date time user has recorded/posted this transaction
  */
  Transaction.prototype.getPostDate = function() {
    return this.postDate;
  }


  //EVOLVED BALANCES
  /**
  @private
  */
  Transaction.prototype.getCaEvolvedBalance_ = function() {
    return this.wrapped.caBal;
  }

  /**
  @private
  */
  Transaction.prototype.getDaEvolvedBalance_ = function() {
    return this.wrapped.daBal;
  }

  /**
  Gets the balance that the {@link Account} has at that {@link Transaction#getInformedDate|informed date}, when listing transactions of that {@link Account}.
  <br/><br/>
  Evolved balances is returned when {@link Book#search|searching for transactions} of a permanent {@link Account}.
  <br/><br/>
  Only comes with the last posted transaction of the day.

  @param {boolean} [strict] True to strict get the balance, no matter the {@link Account#isCredit|credit nature} of this Account.

  @see {@link Account#isCredit}
  @see {@link Account#isPermanent}
  @see {@link Book#search}
  @see {@link Transaction#getInformedDate}
  */
  Transaction.prototype.getAccountBalance = function(strict) {
    var accountBalance = this.getCaEvolvedBalance_();
    var isCa = true;
    if (accountBalance == null) {
      accountBalance = this.getDaEvolvedBalance_();
      isCa = false;
    }
    if (accountBalance != null) {
      if (!strict) {
        var account = isCa ? this.getCreditAccount() : this.getDebitAccount();
        accountBalance = Utils_.getRepresentativeValue(accountBalance, account.isCredit());
      }
      return Utils_.round(accountBalance);
    } else {
      return null;
    }
  }


  Transaction.prototype.configure_ = function() {
    var creditAccount = this.book.getAccount(this.wrapped.creditAccId);
    var debitAccount = this.book.getAccount(this.wrapped.debitAccId);
    this.creditAccount = creditAccount;
    this.debitAccount = debitAccount;
    this.informedDateValue = this.wrapped.informedDateValue;
    this.informedDateText = this.wrapped.informedDateText;
    this.postDate = new Date(new Number(this.wrapped.postDateMs));

    if (this.isPosted()) {
      this.alreadyPosted = true;
    } else {
      this.alreadyPosted = false;
    }
  }

}