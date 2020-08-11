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

  private creditAccount: Account;
  private debitAccount: Account;
  private files: File[];
  private informedDate: Date;
  private informedDateValue: number;
  private informedDateText: string;
  private postDate: Date;

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

  public getFiles(): File[] {
    if (this.files == null) {
      if (this.wrapped.files && this.wrapped.files.length > 0) {
        this.files = Utils_.wrapObjects(new File(), this.wrapped.files)
      } else {
        this.files = [];
      }
    }
    return this.files;
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
    return this.creditAccount;
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

  //DESTINATION ACCOUNT
  /**
   * @returns The debit account. The same as destination account.
   */
  public getDebitAccount(): Account {
    return this.debitAccount;
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


  //AMOUNT
  /**
   * @returns The amount of the transaction
   */
  public getAmount(): number {
    return this.wrapped.amount != null && this.wrapped.amount.trim() != '' ? +this.wrapped.amount : null;
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


  //INFORMED DATE
  /**
   * @returns The date the user informed for this transaction, adjusted to book's time zone
   */
  public getInformedDate(): Date {
    if (this.informedDate == null) {
      this.informedDate = Utils_.convertValueToDate(this.getInformedDateValue(), this.book.getTimeZoneOffset());
    }
    return this.informedDate;
  }


  /**
   * @returns The date the user informed for this transaction. The number format is YYYYMMDD
   */
  public getInformedDateValue(): number {
    return this.informedDateValue;
  }

  /**
   * @returns The date the user informed for this transaction, formatted according to the date pattern of [[Book]].
   */
  public getInformedDateText(): string {
    return this.informedDateText;
  }

  //POST DATE
  /**
   * @returns {Date} The date time user has recorded/posted this transaction
   */
  public getPostDate(): Date {
    return this.postDate;
  }

  /**
   * @returns The date time user has recorded/posted this transaction, formatted according to the date pattern of [[Book]].
   */
  public getPostDateText(): string {
    return Utilities.formatDate(this.getPostDate(), this.book.getTimeZone(), this.book.getDatePattern() + " HH:mm:ss")
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

  configure_(): void {
    var creditAccount = this.wrapped.creditAccount != null ? this.book.getAccount(this.wrapped.creditAccount.id) : null;
    var debitAccount = this.wrapped.debitAccount != null ? this.book.getAccount(this.wrapped.debitAccount.id) : null;
    this.creditAccount = creditAccount;
    this.debitAccount = debitAccount;
    this.informedDateValue = this.wrapped.dateValue;
    this.informedDateText = this.wrapped.dateFormatted;
    this.postDate = new Date(new Number(this.wrapped.createdAt).valueOf());
  }

  check(): Transaction {
    let operation = TransactionService_.checkTransaction(this.book.getId(), this.wrapped);
    this.wrapped = operation.transaction;
    this.book.clearAccountsCache();
    return this;
  }

  uncheck(): Transaction {
    let operation = TransactionService_.uncheckTransaction(this.book.getId(), this.wrapped);
    this.wrapped = operation.transaction;
    this.book.clearAccountsCache();
    return this;
  }

}