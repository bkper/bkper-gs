
/**
 * 
 * This class defines an [Account](https://en.wikipedia.org/wiki/Account_(bookkeeping)) of a [[Book]].
 * 
 * It mantains a balance of all amount [credited and debited](http://en.wikipedia.org/wiki/Debits_and_credits) in it by [[Transaction]]s.
 * 
 * An Account can be grouped by [[Group]]s.
 * 
 */
class Account implements Bkper.Account {

  /**
   * @ignore
   */
  wrapped: Bkper.AccountV2Payload;

  /**
   * @ignore
   */
  book: Book;

  private normalizedName: string;

  public getId(): string {
    return this.wrapped.id;
  }

  public getName(): string {
    return this.wrapped.name;
  }

  public getDescription(): string {
    return this.wrapped.description;
  }

  /**
   * @inheritDoc
   */
  public getNormalizedName(): string {
    if (this.normalizedName == null) {
      this.normalizedName = normalizeName(this.getName());
    }
    return this.normalizedName;
  }

  /**
   * @inheritdoc
   */
  public getBalance(raw?: boolean): number {
    var balance = 0;
    if (this.wrapped.balance != null) {
      balance = Utils_.round(this.wrapped.balance);
    }

    if (raw) {
      return balance;
    } else {
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }
  }

  /**
   * @inheritdoc
   */
  public getCheckedBalance(raw?: boolean): number {
    var balance = 0;
    if (this.wrapped.balance != null) {
      balance = Utils_.round(this.wrapped.checkedBalance);
    }

    if (raw) {
      return balance;
    } else {
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }
  }

  public isActive = function (): boolean {
    return this.wrapped.active;
  };

  /**
   * @inheritdoc
   */
  public isPermanent(): boolean {
    return this.wrapped.permanent;
  }

  /**
   * @inheritdoc
   */
  public isCredit(): boolean {
    return this.wrapped.credit;
  }

  /**
   * @inheritdoc
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
