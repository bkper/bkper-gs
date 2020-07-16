/**
 * A AccountsDataTableBuilder is used to setup and build two-dimensional arrays containing transactions.
 * 
 * @public
 */
class AccountsDataTableBuilder {

  private accounts: Account[];

  constructor(accounts: Account[]) {
    this.accounts = accounts;
  }

  private getTypeIndex(type: AccountType): number {
    if (type == AccountType.ASSET) {
      return 0;
    }
    if (type == AccountType.LIABILITY) {
      return 1;
    }
    if (type == AccountType.INCOMING) {
      return 2
    }
    return 3;
  }

  /**
   * @returns A two-dimensional array containing all [[Accounts]].
   */
  public build(): any[][] {
    var table = new Array<Array<any>>();

    this.accounts.sort((a1: Account, a2: Account) => {
      let ret = this.getTypeIndex(a1.getType()) - this.getTypeIndex(a2.getType())
      if (ret == 0) {
        ret = a1.getNormalizedName().localeCompare(a2.getNormalizedName())
      }
      return ret;
    })

    for (const account of this.accounts) {
      var line = new Array();
      line.push(account.getName())
      line.push(account.getType())

      let groups = account.getGroups();

      groups.sort((g1: Group, g2: Group) => {
        return g1.getNormalizedName().localeCompare(g2.getNormalizedName())
      })

      for (const group of groups) {
        line.push(group.getName())
      }

      table.push(line);
    }

    table = Utils_.convertInMatrix(table);

    return table;

  }

}

