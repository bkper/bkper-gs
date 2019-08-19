/**
@classdesc
This class defines a Group of {@link Account|Accounts}.
<br/>
<br/>
{@link Account|Accounts} can be grouped by different meaning, like Expenses, Revenue, Assets, Liabilities and so on.
<br/>
Its useful to keep {@link Account|Accounts} organized and for high level analysis.
@constructor
*/
class Group {

  wrapped: Bkper.GroupV2Payload
  book: Book

  /**
  @returns The id of this Group
  */
  getId(): string {
    return this.wrapped.id;
  }

  /**
  @returns The name of this Group
  */
  getName(): string {
    return this.wrapped.name;
  }

  /**
  @returns Check if this group has accounts
  */
  hasAccounts(): boolean {
    return this.getAccounts().length > 0;
  }


  /**
  @returns {Array<Account>} All Accounts this Group is has.
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
