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
function Group() {

  /**
  @returns {number} The id of this Group
  */
  Group.prototype.getId = function() {
    return this.wrapped.id;
  }

  /**
  @returns {string} The name of this Group
  */
  Group.prototype.getName = function() {
    return this.wrapped.name;
  }

  /**
  @returns {boolean} Check if this group has accounts
  */
  Group.prototype.hasAccounts = function() {
    return this.getAccounts().length > 0;
  }


  /**
  @returns {Array<Account>} All Accounts this Group is has.
  */
  Group.prototype.getAccounts = function() {
    var accounts = new Array();
    var accs = this.book.getAccounts();
    for (var i = 0; i < accs.length; i++) {
      if (accs[i].isInGroup(this)) {
        accounts.push(accs[i]);
      }
    }
    return accounts;
  }


}
