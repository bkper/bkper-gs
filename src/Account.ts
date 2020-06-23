
/**
 * 
 * This class defines an [Account](https://en.wikipedia.org/wiki/Account_(bookkeeping)) of a [[Book]].
 * 
 * It mantains a balance of all amount [credited and debited](http://en.wikipedia.org/wiki/Debits_and_credits) in it by [[Transactions]].
 * 
 * An Account can be grouped by [[Groups]].
 * 
 * @public
 */
class Account {

  wrapped: bkper.AccountV2Payload;

  book: Book;

  private normalizedName: string;

  /**
   * Gets the account internal id
   */
  public getId(): string {
    return this.wrapped.id;
  }

  /**
   * Gets the account name
   */
  public getName(): string {
    return this.wrapped.name;
  }

  /**
   * Gets the account description
   */
  public getDescription(): string {
    return this.wrapped.description;
  }
  /**
   * @returns The name of this account without spaces and special characters
   */
  public getNormalizedName(): string {
    if (this.normalizedName == null) {
      this.normalizedName = normalizeName(this.getName());
    }
    return this.normalizedName;
  }


  /**
   * Gets the custom properties stored in this Account
   */  
  public getProperties(): any {
    return this.wrapped.properties != null ?  this.wrapped.properties : {};
  }

  /**
   * Gets the property value for given keys. First property found will be retrieved
   * 
   * @param keys The property key
   */
  public getProperty(...keys: string[]): string {
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let value = this.wrapped.properties != null ?  this.wrapped.properties[key] : null 
      if (value != null && value.trim() != '') {
        return value;
      }
    }
    return null;
  }

  /**
   * Gets the balance based on credit nature of this Account
   *  
   * @param raw True to get the raw balance, no matter the credit nature of this Account.
   * 
   * @returns The balance of this account
   */
  public getBalance(raw?: boolean): number {
    var balance = 0;
    if (this.wrapped.balance != null) {
      balance = Utils_.round(this.wrapped.balance, this.book.getFractionDigits());
    }

    if (raw) {
      return balance;
    } else {
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }
  }

  /**
   * Gets the checked balance based on credit nature of this Account
   * 
   * @param raw True to get the raw balance, no matter the credit nature of this Account.
   * 
   * @returns The checked balance of this Account
   */
  public getCheckedBalance(raw?: boolean): number {
    var balance = 0;
    if (this.wrapped.balance != null) {
      balance = Utils_.round(this.wrapped.checkedBalance, this.book.getFractionDigits());
    }

    if (raw) {
      return balance;
    } else {
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }
  }
  
  /**
   * Tell if this account is Active or otherwise Archived
   */
  public isActive(): boolean {
    return this.wrapped.active;
  };

  /**
   * 
   * Tell if the account is permanent.
   * 
   * Permanent Accounts are the ones which final balance is relevant and keep its balances over time.
   *  
   * They are also called [Real Accounts](http://en.wikipedia.org/wiki/Account_(accountancy)#Based_on_periodicity_of_flow)
   * 
   * Usually represents assets or tangibles, capable of being perceived by the senses or the mind, like bank accounts, money, debts and so on.
   * 
   * @returns True if its a permanent Account
   */
  public isPermanent(): boolean {
    return this.wrapped.permanent;
  }

  /**
   * Tell if the account has a Credit nature or Debit otherwise
   * 
   * Credit accounts are just for representation purposes. It increase or decrease the absolute balance. It doesn't affect the overall balance or the behavior of the system.
   * 
   * The absolute balance of credit accounts increase when it participate as a credit/origin in a transaction. Its usually for Accounts that increase the balance of the assets, like revenue accounts.
   * 
   * ```
   *         Crediting a credit
   *   Thus ---------------------> account increases its absolute balance
   *         Debiting a debit
   * 
   * 
   *         Debiting a credit
   *   Thus ---------------------> account decreases its absolute balance
   *         Crediting a debit
   * ```
   * 
   * As a rule of thumb, and for simple understanding, almost all accounts are Debit nature (NOT credit), except the ones that "offers" amount for the books, like revenue accounts.
   */
  public isCredit(): boolean {
    return this.wrapped.credit;
  }


  /**
   * Get the [[Groups]] of this account.
   */  
  public getGroups(): Group[] {
    let groups = new Array<Group>();
    for (var i = 0; i < this.wrapped.groupsIds.length; i++) {
      let groupId = this.wrapped.groupsIds[i];
      let group = this.book.getGroup(groupId);
      groups.push(group);
    }
    return groups;
  }  

  /**
   * Tell if this account is in the [[Group]]
   * 
   * @param  group The Group name, id or object
   */
  public isInGroup(group: string | Group): boolean {
    if (group == null) {
      return false;
    }

    //Group object
    if (group instanceof Group) {
      return this.isInGroupObject_(group);
    }

    //id or name
    var foundGroup = this.book.getGroup(group);
    if (foundGroup == null) {
      return false;
    }
    return this.isInGroupObject_(foundGroup);
  }

  private isInGroupObject_(group: Group): boolean {
    if (this.wrapped.groupsIds == null) {
      return false;
    }

    for (var i = 0; i < this.wrapped.groupsIds.length; i++) {
      if (this.wrapped.groupsIds[i] == group.getId()) {
        return true;
      }
    }
    return false;
  }




}
