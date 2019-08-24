namespace bkper {

  /**
  * This class defines a Group of [[Account]]s.
  *
  * Accounts can be grouped by different meaning, like Expenses, Revenue, Assets, Liabilities and so on
  * 
  * Its useful to keep organized and for high level analysis.
  */
  export interface Group {

    /**
     * @returns The id of this Group
     */
    getId(): string;

    /**
     * @returns The name of this Group
     */
    getName(): string;

    /**
     * @returns True if this group has any account in it
     */
    hasAccounts(): boolean;

    /**
     * @returns All Accounts of this group.
     */
    getAccounts(): Account[];

  }
  
}


