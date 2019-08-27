
class Transaction implements bkper.Transaction {

  /**
   * @ignore
   */
  wrapped: bkper.TransactionV2Payload

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
   * @inheritdoc
   */
  public getId(): string {
    return this.wrapped.id;
  }

  /**
   * @inheritdoc
   */
  public isPosted(): boolean {
    return this.wrapped.posted;
  }

  /**
   * @inheritdoc
   */
  public getTags(): string[] {
    return this.wrapped.tags;
  }

  /**
   * @inheritdoc
   */
  public getUrls(): string[] {
    return this.wrapped.urls;
  }

  /**
   * @inheritdoc
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
   * @inheritdoc
   */
  public getCreditAccount(): Account {
    return this.creditAccount;
  }

  /**
   * @inheritdoc
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
   * @inheritdoc
   */
  public getDebitAccount(): Account {
    return this.debitAccount;
  }

  /**
   * @inheritdoc
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
   * @inheritdoc
   */
  public getAmount(): number {
    return this.wrapped.amount;
  }

  /**
   * @inheritdoc
   */
  public getCreditAmount(account: Account | string): number {
    let accountObject = this.getAccount_(account);
    if (this.isCreditOnTransaction_(accountObject)) {
      return this.getAmount();
    }
    return null;
  }

  /**
   * @inheritdoc
   */
  public getDebitAmount(account: Account | string): number {
    let accountObject = this.getAccount_(account);
    if (this.isDebitOnTransaction_(accountObject)) {
      return this.getAmount();
    }
    return null;
  }

  /**
   * @inheritdoc
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
   * @inheritdoc
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
   * @inheritdoc
   */
  public getDescription(): string {
    if (this.wrapped.description == null) {
      return "";
    }
    return this.wrapped.description;
  }


  //INFORMED DATE
  /**
   * @inheritdoc
   */
  public getInformedDate(): Date {
    if (this.informedDate == null) {
      this.informedDate = Utils_.convertValueToDate(this.getInformedDateValue(), this.book.getTimeZoneOffset());
    }
    return this.informedDate;
  }


  /**
   * @inheritdoc
   */
  public getInformedDateValue(): number {
    return this.informedDateValue;
  }

  /**
   * @inheritdoc
   */
  public getInformedDateText(): string {
    return this.informedDateText;
  }

  //POST DATE
  /**
   * @inheritdoc
   */
  public getPostDate(): Date {
    return this.postDate;
  }

  /**
   * @inheritdoc
   */
  public getPostDateText(): string {
    return Utilities.formatDate(this.getPostDate(), this.book.getLocale(), this.book.getDatePattern() + " HH:mm:ss")
  }


  //EVOLVED BALANCES
  /**
   * @private
   */
  private getCaEvolvedBalance_(): number {
    return this.wrapped.caBal;
  }

  /**
   * @private
   */
  private getDaEvolvedBalance_(): number {
    return this.wrapped.daBal;
  }

  /**
   * @inheritdoc
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