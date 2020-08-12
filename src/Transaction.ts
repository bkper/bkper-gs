/**
 * 
 * This class defines a Transaction between [credit and debit](http://en.wikipedia.org/wiki/Debits_and_credits) [[Accounts]].
 *
 * A Transaction is the main entity on the [Double Entry](http://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) [Bookkeeping](http://en.wikipedia.org/wiki/Bookkeeping) system.
 * 
 * @public
 */
class Transaction {

  wrapped: bkper.Transaction

  book: Book;

  /**
   * @returns The id of the Transaction
   */
  public getId(): string {
    return this.wrapped.id;
  }

  /**
   * @returns True if transaction was already posted to the accounts. False if is still a Draft.
   */
  public isPosted(): boolean {
    return this.wrapped.posted;
  }

  /**
   * @returns True if transaction is checked
   */
  public isChecked(): boolean {
    return this.wrapped.checked;
  }

  /**
   * @returns True if transaction is in trash
   */  
  public isTrashed(): boolean {
    return this.wrapped.trashed;
  }

  /**
   * @returns All #hashtags used on the transaction
   */
  public getTags(): string[] {
    return this.wrapped.tags;
  }

  /**
   * @returns All urls of the transaction
   */
  public getUrls(): string[] {
    return this.wrapped.urls;
  }

  /**
   * @returns The files attached to the transaction
   */
  public getFiles(): File[] {
      if (this.wrapped.files && this.wrapped.files.length > 0) {
        return Utils_.wrapObjects(new File(), this.wrapped.files)
      } else {
        return [];
      }
  }

  /**
   * Check if the transaction has the specified tag
   */
  public hasTag(tag: string): boolean {

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
   * @returns The credit account. The same as origin account.
   */
  public getCreditAccount(): Account {
    return this.wrapped.creditAccount != null ? this.book.getAccount(this.wrapped.creditAccount.id) : null;;
  }

  /**
   * @returns The credit account name.
   */
  public getCreditAccountName(): string {
    if (this.getCreditAccount() != null) {
      return this.getCreditAccount().getName();
    } else {
      return "";
    }
  }  

  /**
   * 
   * Sets the credit/origin Account of the Transaction. Same as from()
   * 
   * @param account Account id, name or object
   * 
   * @returns This Transaction, for chainning
   */
  public setCreditAccount(account: string | Account): Transaction {
    if (typeof account == "string") {
      account = this.book.getAccount(account)
    }
    if (account != null && account.getId() != null) {
      this.wrapped.creditAccount = account.wrapped
    }
    return this;
  }

  /**
   * 
   * Sets the credit/origin Account of the Transaction. Same as setCreditAccount()
   * 
   * @param account Account id, name or object
   * 
   * @returns This Transaction, for chainning
   */
  public from(account: string | Account): Transaction {
    return this.setCreditAccount(account);
  }


  //DESTINATION ACCOUNT
  /**
   * @returns The debit account. The same as destination account.
   * 
   */
  public getDebitAccount(): Account {
    return this.wrapped.debitAccount != null ? this.book.getAccount(this.wrapped.debitAccount.id) : null;
  }

  /**
   * @returns The debit account name.
   */
  public getDebitAccountName(): string {
    if (this.getDebitAccount() != null) {
      return this.getDebitAccount().getName();
    } else {
      return "";
    }
  }

  /**
   * 
   * Sets the debit/origin Account of the Transaction. Same as to()
   * 
   * @param account Account id, name or object
   * 
   * @returns This Transaction, for chainning
   */
  public setDebitAccount(account: string | Account): Transaction {
    if (typeof account == "string") {
      account = this.book.getAccount(account)
    }
    if (account != null && account.getId() != null) {
      this.wrapped.debitAccount = account.wrapped
    }
    return this;
  }

  /**
   * 
   * Sets the debit/origin Account of the Transaction. Same as setDebitAccount()
   * 
   * @param account Account id, name or object
   * 
   * @returns This Transaction, for chainning
   */
  public to(account: string | Account): Transaction {
    return this.setDebitAccount(account);
  }


  //AMOUNT
  /**
   * @returns The amount of the transaction
   */
  public getAmount(): number {
    return this.wrapped.amount != null && this.wrapped.amount.trim() != '' ? +this.wrapped.amount : null;
  }

  /**
   * 
   * Sets the amount of the Transaction.
   * 
   * @returns This Transaction, for chainning
   */
  public setAmount(amount: number): Transaction {
    this.wrapped.amount = amount+'';
    return this;
  }

  /**
   * Get the absolute amount of this transaction if the given account is at the credit side, else null
   * 
   * @param account The account object, id or name
   */
  public getCreditAmount(account: Account | string): number {
    let accountObject = this.getAccount_(account);
    if (this.isCreditOnTransaction_(accountObject)) {
      return this.getAmount();
    }
    return null;
  }

  /**
   * Gets the absolute amount of this transaction if the given account is at the debit side, else null
   * 
   * @param account The account object, id or name
   */
  public getDebitAmount(account: Account | string): number {
    let accountObject = this.getAccount_(account);
    if (this.isDebitOnTransaction_(accountObject)) {
      return this.getAmount();
    }
    return null;
  }

  /**
   * Gets the [[Account]] at the other side of the transaction given the one in one side.
   * 
   * @param account The account object, id or name
   */
  public getOtherAccount(account: Account | string): Account {
    let accountObject = this.getAccount_(account);
    if (this.isCreditOnTransaction_(accountObject)) {
      return this.getDebitAccount();
    }
    if (this.isDebitOnTransaction_(accountObject)) {
      return this.getCreditAccount();
    }
    return null;
  }

  /**
   * 
   * The account name at the other side of the transaction given the one in one side.
   * 
   * @param account The account object, id or name
   */
  public getOtherAccountName(account: string | Account): string {
    var otherAccount = this.getOtherAccount(account);
    if (otherAccount != null) {
      return otherAccount.getName();
    } else {
      return "";
    }
  }

  private getAccount_(account: Account | string): Account {
    if (account == null || account instanceof Account) {
      return account as Account;
    }
    return this.book.getAccount(account);
  }

  private isCreditOnTransaction_(account: Account) {
    return this.getCreditAccount() != null && account != null && this.getCreditAccount().getId() == account.getId();
  }

  private isDebitOnTransaction_(account: Account) {
    return this.getDebitAccount() != null && account != null && this.getDebitAccount().getId() == account.getId();
  }


  //DESCRIPTION
  /**
   * @returns The description of this transaction
   */
  public getDescription(): string {
    if (this.wrapped.description == null) {
      return "";
    }
    return this.wrapped.description;
  }

  /**
   * 
   * Sets the description of the Transaction.
   * 
   * @returns This Transaction, for chainning
   */
  public setDescription(description: string): Transaction {
    this.wrapped.description = description;
    return this;
  }  


  //DATE

  /**
   * @returns The Transaction date, in ISO format yyyy-MM-dd
   */
  public getDate(): string {
    return this.wrapped.date;
  }

  /**
   * 
   * Sets the date of the Transaction, in ISO format yyyy-MM-dd.
   * 
   * @returns This Transaction, for chainning
   */  
  public setDate(date: string): Transaction {
    this.wrapped.date = date;
    return this;
  }

  /**
   * @returns The Transaction Date object, on the time zone of the [[Book]].
   */
  public getDateObject(): Date {
      return Utils_.convertValueToDate(this.getInformedDateValue(), this.book.getTimeZoneOffset());
  }

  /**
   * @returns The Transaction date number, in format YYYYMMDD.
   */
  public getDateValue(): number {
    return this.wrapped.dateValue;
  }
  
  /**
   * @returns The Transaction date, formatted on the date pattern of the [[Book]].
   */
  public getDateFormatted(): string {
    return this.wrapped.dateFormatted;
  }

  /**
   * @returns The date the transaction was created
   */
  public getCreatedAt(): Date {
    return new Date(new Number(this.wrapped.createdAt).valueOf());
  }

  /**
   * @returns The date the transaction was created, formatted according to the date pattern of [[Book]].
   */
  public getCreatedAtFormatted(): string {
      return Utilities.formatDate(this.getCreatedAt(), this.book.getTimeZone(), this.book.getDatePattern() + " HH:mm:ss");
  }




  //EVOLVED BALANCES
  private getCaEvolvedBalance_(): number {
    return this.wrapped.creditAccount != null && this.wrapped.creditAccount.balance != null ? +this.wrapped.creditAccount.balance : null;
  }

  private getDaEvolvedBalance_(): number {
    return this.wrapped.debitAccount != null && this.wrapped.debitAccount.balance != null ? +this.wrapped.debitAccount.balance : null;
  }

  /**
   * Gets the balance that the [[Account]] has at that day, when listing transactions of that Account.
   * 
   * Evolved balances is returned when searching for transactions of a permanent [[Account]].
   * 
   * Only comes with the last posted transaction of the day.
   * 
   * @param raw True to get the raw balance, no matter the credit nature of the [[Account]].
   */
  public getAccountBalance(raw?: boolean): number {
    var accountBalance = this.getCaEvolvedBalance_();
    var isCa = true;
    if (accountBalance == null) {
      accountBalance = this.getDaEvolvedBalance_();
      isCa = false;
    }
    if (accountBalance != null) {
      if (!raw) {
        var account = isCa ? this.getCreditAccount() : this.getDebitAccount();
        accountBalance = Utils_.getRepresentativeValue(accountBalance, account.isCredit());
      }
      return Utils_.round(accountBalance, this.book.getFractionDigits());
    } else {
      return null;
    }
  }

  /**
   * Perform check transaction
   */
  public check(): Transaction {
    let operation = TransactionService_.checkTransaction(this.book.getId(), this.wrapped);
    this.wrapped = operation.transaction;
    this.book.clearAccountsCache();
    return this;
  }

  /**
   * Perform uncheck transaction
   */  
  public uncheck(): Transaction {
    let operation = TransactionService_.uncheckTransaction(this.book.getId(), this.wrapped);
    this.wrapped = operation.transaction;
    this.book.clearAccountsCache();
    return this;
  }  

  /**
   * Perform edit transaction, applying pending changes
   */  
  public edit(): Transaction {
    let operation = TransactionService_.editTransaction(this.book.getId(), this.wrapped);
    this.wrapped = operation.transaction;
    this.book.clearAccountsCache();
    return this;
  }  

  /**
   * Remove the transaction, sending to trash
   */  
  public remove(): Transaction {
    let operation = TransactionService_.removeTransaction(this.book.getId(), this.wrapped);
    this.wrapped = operation.transaction;
    this.book.clearAccountsCache();
    return this;
  }  

  /**
   * Restore the transaction from trash
   */  
  public restore(): Transaction {
    let operation = TransactionService_.restoreTransaction(this.book.getId(), this.wrapped);
    this.wrapped = operation.transaction;
    this.book.clearAccountsCache();
    return this;
  }  


  //DEPRECATED

   /**
   * @returns The date the user informed for this transaction, adjusted to book's time zone
   * 
   * @deprecated Use getDateObject instead
   */
  public getInformedDate(): Date {
    return this.getDateObject();
  }


  /**
   * @returns The date numbe. The number format is YYYYMMDD
   * 
   * @deprecated use getDateValue instead
   */
  public getInformedDateValue(): number {
    return this.getDateValue();
  }

  /**
   * @returns The date the user informed for this transaction, formatted according to the date pattern of [[Book]].
   * 
   * @deprecated use getDateFormatted instead
   */
  public getInformedDateText(): string {
    return this.getDateFormatted();
  }


  /**
   * @returns {Date} The date time user has recorded/posted this transaction
   * 
   * @deprecated use getCreatedAt instead
   */
  public getPostDate(): Date {
    return this.getCreatedAt();
  }

  /**
   * @returns The date time user has recorded/posted this transaction, formatted according to the date pattern of [[Book]].
   * 
   * @deprecated use getCreatedAtFormatted instead
   */
  public getPostDateText(): string {
    return this.getCreatedAtFormatted();
  } 


}