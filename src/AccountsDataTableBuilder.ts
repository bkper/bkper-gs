/**
 * A AccountsDataTableBuilder is used to setup and build two-dimensional arrays containing accounts.
 * 
 * @public
 */
class AccountsDataTableBuilder {

  private accounts: Account[];

  private shouldIncludeArchived: boolean;
  private shouldAddGroups: boolean;

  constructor(accounts: Account[]) {
    this.accounts = accounts;
    this.shouldIncludeArchived = false;
    this.shouldAddGroups = false;
  }

  /**
   * Defines whether the archived accounts should included.
   *
   * @returns This builder, for chaining.
   */
  public includeArchived(include: boolean): AccountsDataTableBuilder {
    this.shouldIncludeArchived = include;
    return this;
  }

  /**
   * Defines whether include account groups.
   * 
   * @returns This builder with respective include groups option, for chaining.
   */
  public includeGroups(include: boolean): AccountsDataTableBuilder {
    this.shouldAddGroups = include;
    return this;
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

  private getMaxNumberOfGroups(): number {
    let maxNumberOfGroups = 0;
    for (const account of this.accounts) {
      const groups = account.getGroups();
      if (groups.length > maxNumberOfGroups) {
        maxNumberOfGroups = groups.length;
      }
    }
    return maxNumberOfGroups;
  }

  /**
   * @returns A two-dimensional array containing all [[Accounts]].
   */
  public build(): any[][] {

    let table = new Array<Array<any>>();

    let accounts = this.accounts;

    if (!this.shouldIncludeArchived) {
      accounts = this.accounts.filter(a => a.isActive());
    }

    let headers = [];
    headers.push('Name');
    headers.push('Type');

    if (this.shouldAddGroups) {
      for (let i = 0; i < this.getMaxNumberOfGroups(); i++) {
        headers.push('Group');
      }
    }

    accounts.sort((a1: Account, a2: Account) => {
      let ret = this.getTypeIndex(a1.getType()) - this.getTypeIndex(a2.getType())
      if (ret == 0) {
        ret = a1.getNormalizedName().localeCompare(a2.getNormalizedName());
      }
      return ret;
    })

    for (const account of accounts) {

      let line = new Array();
      line.push(account.getName());
      line.push(account.getType());

      if (this.shouldAddGroups) {
        const groups = account.getGroups();
        groups.sort((g1: Group, g2: Group) => {
          return g1.getNormalizedName().localeCompare(g2.getNormalizedName());
        })
        for (const group of groups) {
          line.push(group.getName());
        }
      }

      table.push(line);
    }

    table.unshift(headers);

    table = Utils_.convertInMatrix(table);

    return table;

  }

}
