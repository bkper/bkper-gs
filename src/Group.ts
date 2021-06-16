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

  wrapped: bkper.Group

  book: Book

  parent: Group

  children: Group[] = [];
  private accounts: Account[];
  private idAccountMap: {[key: string]: Account};


  depth: number;

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
   * 
   * Sets the name of the Group.
   * 
   * @returns This Group, for chainning.
   */    
  public setName(name: string): Group {
    this.wrapped.name = name;
    return this;
  }  

  /**
   * @returns The name of this group without spaces and special characters
   */
  public getNormalizedName(): string {
    if (this.wrapped.normalizedName) {
      return this.wrapped.normalizedName;
    } else {
      return Utils_.normalizeText(this.getName())
    }
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
    this.book.getAccounts();
    if (!this.accounts) {
      this.accounts = []
    }
    return this.accounts;
  }

  addAccount(account: Account): void {
    if (!this.accounts){
      this.accounts = []
    }
    if (!this.idAccountMap) {
      this.idAccountMap = {}
    }
    if (!this.idAccountMap[account.getId()]){
      console.log(`Adding account ${account.getName()} to group ${this.getName()}`)
      this.idAccountMap[account.getId()] = account
      this.accounts.push(account)
    }
  }



  /**
   * Gets the custom properties stored in this Group
   */  
  public getProperties(): {[key: string]: string} {
    return this.wrapped.properties != null ?  {...this.wrapped.properties} : {};
  }

  /**
   * Sets the custom properties of the Group
   * 
   * @param properties Object with key/value pair properties
   * 
   * @returns This Group, for chainning. 
   */
  public setProperties(properties: {[key: string]: string}): Group {
    this.wrapped.properties = {...properties};
    return this;
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
   * Sets a custom property in the Group.
   * 
   * @param key The property key
   * @param value The property value
   */
  public setProperty(key: string, value: string): Group {
    if (key == null || key.trim() == '') {
      return this;
    }    
    if (this.wrapped.properties == null) {
      this.wrapped.properties = {};
    }
    this.wrapped.properties[key] = value;
    return this;
  }

  /**
   * Delete a custom property
   * 
   * @param key The property key
   * 
   * @returns This Group, for chainning. 
   */
  public deleteProperty(key: string): Group {
    this.setProperty(key, null);
    return this;
  }

  /**
   * Tell if the Group is hidden on main transactions menu
   */
  public isHidden(): boolean {
    return this.wrapped.hidden;
  }

  /**
   *  Hide/Show group on main menu.
   */
  public setHidden(hidden: boolean): Group {
    this.wrapped.hidden = hidden;
    return this;
  }

  /**
   * Perform create new group.
   */
  public create(): Group {
    this.wrapped = GroupService_.createGroup(this.book.getId(), this.wrapped);
    this.book.clearAccountsCache();
    return this;
  }   

  /**
   * Perform update group, applying pending changes.
   */
  public update(): Group {
    this.wrapped = GroupService_.updateGroup(this.book.getId(), this.wrapped);
    this.book.clearAccountsCache();
    return this;

  }   
  
  /**
   * Perform delete group.
   */
  public remove(): Group {
    this.wrapped = GroupService_.deleteGroup(this.book.getId(), this.wrapped);
    this.book.clearAccountsCache();
    return this;
  }

  /**
   * 
   * @returns The parent Group
   */
  public getParent(): Group {
    return this.parent;
  }

  /**
   * Sets the parent Group.
   * 
   * @returns This Group, for chainning.
   */
  public setParent(group: Group): Group {
    if (group) {
      this.wrapped.parent = { id: group.getId(), name: group.getName(), normalizedName: group.getNormalizedName() };
    } else {
      this.wrapped.parent = null;
    }
    return this;
  }

  /**
   * Tell if this group is a has any children
   */
  public hasChildren(): boolean {
    return this.children && this.children.length > 0;
  }


  /**
   * 
   * @returns The children Groups
   */
  public getChildren(): Group[] {
    return this.children;
  }


  /**
   * 
   * @returns The depth in the parent Group chain up to the root Group
   */
   public getDepth():number {
    if (this.depth == null) {
        if (this.getParent() != null) {
            this.depth = this.getParent().getDepth() + 1;
        } else {
            this.depth = 0;
        }
    }
    return this.depth;
}
  
  buildGroupTree_(idGroupMap: any) {
    this.parent = null;
    this.depth = null;
    if (this.wrapped.parent != null) {
        let parentGroup: Group = idGroupMap[this.wrapped.parent.id];
        if (parentGroup != null) {
            this.parent = parentGroup;
            this.parent.children.push(this);
            this.parent.buildGroupTree_(idGroupMap);
        }
    }
}

}
