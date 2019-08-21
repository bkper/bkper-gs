/**
 * 
 * This class defines a Transaction between {@link http://en.wikipedia.org/wiki/Debits_and_credits|credit and debit} {@link Account|Accounts}.
 *
 * A Transaction is the main entity on the {@link http://en.wikipedia.org/wiki/Double-entry_bookkeeping_system|Double Entry} {@link http://en.wikipedia.org/wiki/Bookkeeping|Bookkeeping} system.
 *
 * Transactions are also used for {@link http://en.wikipedia.org/wiki/Single-entry_bookkeeping_system|Single Entry process} when using {@link http://en.wikipedia.org/wiki/Hashtag|#hashtags} in its {@link Transaction.getDescription|description}.
 * 
 */
class Transaction {

  /**
   * @ignore
   */
  wrapped: Bkper.TransactionV2Payload

  /**
   * @ignore
   */
  book: Book;

  private creditAccount: Account;
  private debitAccount: Account;
  private informedDate: Date;
  private informedDateValue: number;
  private informedDateText: string;
  private postDate: Date;
  private alreadyPosted: boolean;

  /**
  * @returns The id of this Transaction
  */
  public getId(): string {
    return this.wrapped.id;
  }

  /**
  * @returns True if transaction is already posted. False otherwise.
  */
  public isPosted(): boolean {
    return this.wrapped.posted;
  }

  /**
  * @returns All #hashtags used on this transaction
  */
  public getTags(): string[] {
    return this.wrapped.tags;
  }

  /**
  * @returns All urls used on this transaction
  */
  public getUrls(): string[] {
    return this.wrapped.urls;
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
   * @returns The amount of this transaction
   */
  public getAmount(): number {
    return this.wrapped.amount;
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
   * Gets the account at the other side of the transaction given the one in one side.
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
  * @returns  The description of this transaction
  */
  public getDescription(): string {
    if (this.wrapped.description == null) {
      return "";
    }
    return this.wrapped.description;
  }


  //INFORMED DATE
  /**
  @returns The date the user informed for this transaction, adjusted to book's time zone
  */
  public getInformedDate(): Date {
    if (this.informedDate == null) {
      this.informedDate = Utils_.convertValueToDate(this.getInformedDateValue(), this.book.getTimeZoneOffset());
    }
    return this.informedDate;
  }


  /**
  @returns The date the user informed for this transaction. The number format is YYYYMMDD
  */
  public getInformedDateValue(): number {
    return this.informedDateValue;
  }

  /**
  @returns The date the user informed for this transaction, formatted according to {@link Book.getDatePattern|date pattern of book}
  */
  public getInformedDateText(): string {
    return this.informedDateText;
  }

  //POST DATE
  /**
  @returns {Date} The date time user has recorded/posted this transaction
  */
  public getPostDate(): Date {
    return this.postDate;
  }

  /**
  @returns The date time user has recorded/posted this transaction, formatted according to {@link Book.getDatePattern|date pattern of book}
  */
  public getPostDateText(): string {
    return Utilities.formatDate(this.getPostDate(), this.book.getLocale(), this.book.getDatePattern() + " HH:mm:ss")
  }


  //EVOLVED BALANCES
  /**
  @private
  */
  private getCaEvolvedBalance_(): number {
    return this.wrapped.caBal;
  }

  /**
  @private
  */
  private getDaEvolvedBalance_(): number {
    return this.wrapped.daBal;
  }

  /**
  Gets the balance that the {@link Account} has at that {@link Transaction.getInformedDate|informed date}, when listing transactions of that {@link Account}.
  <br/><br/>
  Evolved balances is returned when {@link Book.search|searching for transactions} of a permanent {@link Account}.
  <br/><br/>
  Only comes with the last posted transaction of the day.

  @param {boolean} [strict] True to strict get the balance, no matter the {@link Account.isCredit|credit nature} of this Account.

  @see {@link Account.isCredit}
  @see {@link Account.isPermanent}
  @see {@link Book.search}
  @see {@link Transaction.getInformedDate}
  */
  public getAccountBalance(strict?: boolean): number {
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

  /**
   * @ignore
   */
  public configure_(): void {
    var creditAccount = this.book.getAccount(this.wrapped.creditAccId);
    var debitAccount = this.book.getAccount(this.wrapped.debitAccId);
    this.creditAccount = creditAccount;
    this.debitAccount = debitAccount;
    this.informedDateValue = this.wrapped.informedDateValue;
    this.informedDateText = this.wrapped.informedDateText;
    this.postDate = new Date(new Number(this.wrapped.postDateMs).valueOf());

    if (this.isPosted()) {
      this.alreadyPosted = true;
    } else {
      this.alreadyPosted = false;
    }
  }

}