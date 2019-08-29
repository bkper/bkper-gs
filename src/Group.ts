
class Group implements GoogleAppsScript.Bkper.Group {

  /**
   * @ignore
   */
  wrapped: bkper.GroupV2Payload

  /**
   * @ignore
   */
  book: Book

  /**
   * @inheritdoc
   */
  getId(): string {
    return this.wrapped.id;
  }

  /**
   * @inheritdoc
   */
  getName(): string {
    return this.wrapped.name;
  }

  /**
   * @inheritdoc
   */
  hasAccounts(): boolean {
    return this.getAccounts().length > 0;
  }


  /**
   * @inheritdoc
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
