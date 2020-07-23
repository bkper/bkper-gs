/**
 * This class defines a Group of [[Accounts]].
 * 
 * Accounts can be grouped by different meaning, like Expenses, Revenue, Assets, Liabilities and so on
 * 
 * Its useful to keep organized and for high level analysis.
 * 
 * @public
 */
class Group {

  wrapped: bkper.GroupV2Payload

  book: Book

  /**
   * @returns The id of this Group
   */
  public getId(): string {
    return this.wrapped.id;
  }

  /**
   * @returns The name of this Group
   */
  public getName(): string {
    return this.wrapped.name;
  }

  /**
   * @returns The name of this group without spaces and special characters
   */
  public getNormalizedName(): string {
    return this.wrapped.normalizedName;
  }


  /**
   * @returns True if this group has any account in it
   */
  public hasAccounts(): boolean {
    return this.getAccounts().length > 0;
  }


  /**
   * @returns All Accounts of this group.
   */
  public getAccounts(): Account[] {
    var accounts = [];
    var accs = this.book.getAccounts();
    for (var i = 0; i < accs.length; i++) {
      if (accs[i].isInGroup(this)) {
        accounts.push(accs[i]);
      }
    }
    return accounts;
  }



  /**
   * Gets the custom properties stored in this Group
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
  
}
