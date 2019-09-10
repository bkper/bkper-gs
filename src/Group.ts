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
   * 
   * @public
   */
  getId(): string {
    return this.wrapped.id;
  }

  /**
   * @returns The name of this Group
   * 
   * @public
   */
  getName(): string {
    return this.wrapped.name;
  }

  /**
   * @returns True if this group has any account in it
   * 
   * @public
   */
  hasAccounts(): boolean {
    return this.getAccounts().length > 0;
  }


  /**
   * @returns All Accounts of this group.
   * 
   * @public
   */
  getAccounts(): Account[] {
    var accounts = [];
    var accs = this.book.getAccounts();
    for (var i = 0; i < accs.length; i++) {
      if (accs[i].isInGroup(this)) {
        accounts.push(accs[i]);
      }
    }
    return accounts;
  }


}
