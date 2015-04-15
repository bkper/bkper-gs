/**

@classdesc
This class defines an {@link http://en.wikipedia.org/wiki/Account_(accountancy)|Account} of a {@link Book}.
<br/>
It mantains a balance of all amount {@link http://en.wikipedia.org/wiki/Debits_and_credits|credited and debited} in it by {@link Transaction|Transactions}.
<br/>
An {@link http://en.wikipedia.org/wiki/Account_(accountancy)|Account} has a lower level granularity control and can be grouped by {@link Group|Groups}.
@constructor
@see {@link Book#createAccount} for examples.

*/
function Account() {

  /**
  @returns {number} The id of this Account
  */
  Account.prototype.getId = function() {
    return this.wrapped.id;
  }

  /**
  @returns {string} The name of this Account
  */
  Account.prototype.getName = function() {
    return this.wrapped.name;
  }

  /**
  @returns {string} The description of this Account
  */
  Account.prototype.getDescription = function() {
    return this.wrapped.description;
  }


  /**
  @returns {string} The name of this Account without spaces and special characters
  */
  Account.prototype.getNormalizedName = function() {
    if (this.normalizedName == null) {
      this.normalizedName = normalizeName(this.getName());
    }
    return this.normalizedName;
  }


  /**
  Gets the balance based on {@link Account#isCredit|credit nature} of this Account

  @param {boolean} [strict] True to strict get the balance, no matter the {@link Account#isCredit|credit nature} of this Account.
  @returns {number} The balance of this Account
  */
  Account.prototype.getBalance = function(strict) {
    var balance = 0;
    if (this.wrapped.balance != null) {
      balance = Utils_.round(this.wrapped.balance)
    }

    if (strict) {
      return balance;
    } else {
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }

  }

  /**
  @returns {boolean} Check if this account is active
  */
  Account.prototype.isActive = function() {
    return this.wrapped.active;
  }


  /**
  Tell if the account is permanent.
  <br/><br/>
  Permanent Accounts are the ones which final balance is relevant and keep its balances over time. They are also called <a href='http://en.wikipedia.org/wiki/Account_(accountancy)#Based_on_periodicity_of_flow'>Real Accounts</a>.
  <br/><br/>
  Usually represents assets or tangibles, capable of being perceived by the senses or the mind, like bank accounts, money, debts and so on.
  @returns {boolean} True if its a permanent Account
  @see {@link Transaction#getAccountBalance}
  */
  Account.prototype.isPermanent = function() {
    return this.wrapped.permanent;
  }


  /**
  Tell if the account has a credit or debit nature.
  <br/><br/>
  Credit accounts are just for representation purposes. It increase or decrease the absolute balance. It doesn't affect the overall balance or the behavior of the system.
  <br/><br/>
  The absolute balance of credit accounts increase when it participate as a credit/origin in a transaction. Its usually for Accounts that increase the balance of the assets, like revenue accounts.
  <br/><br/>
  <pre>
       Crediting a credit
Thus ---------------------> account increases its absolute balance
       Debiting a debit


       Debiting a credit
Thus ---------------------> account decreases its absolute balance
       Crediting a debit
  </pre>

  <br/>

  As a rule of thumb, and for simple understanding, almost all accounts are Debit nature (NOT credit), except the ones that "offers" amount for the books, like revenue accounts.

  @returns {boolean} true if its a credit nature {@link Account}, false if its debit
  */
  Account.prototype.isCredit = function() {
    return this.wrapped.credit;
  }

  /**
  Tell if this account is in the {@link Group}
  @param {string|number|Group} Group The Group name, id or object
  @returns {boolean}
  */
  Account.prototype.isInGroup = function(group) {
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

  /**
  @private
  */
  Account.prototype.isInGroupObject_ = function(group) {

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
