/// <reference path="ResourceProperty.ts" />

/**
* This class defines a Group of [[Accounts]].
* 
* Accounts can be grouped by different meaning, like Expenses, Revenue, Assets, Liabilities and so on
* 
* Its useful to keep organized and for high level analysis.
* 
* @public
*/
class Group extends ResourceProperty<bkper.Group> {

    book: Book

    parent: Group

    private children: Group[];
    private accounts: Account[];
    private idAccountMap: { [key: string]: Account };

    depth: number;

    /**
     * @returns The id of this Group
     */
    public getId(): string {
        return this.payload.id;
    }

    /**
     * @returns The name of this Group
     */
    public getName(): string {
        return this.payload.name;
    }

    /**
     * 
     * Sets the name of the Group.
     * 
     * @returns This Group, for chainning.
     */
    public setName(name: string): Group {
        this.payload.name = name;
        return this;
    }

    /**
     * @returns True if the Group is locked by the Book owner.
     */
    public isLocked(): boolean {
        if (this.payload.locked == null) {
            return false;
        }
        return this.payload.locked;
    }

    /**
     * 
     * Sets the locked state of the Group.
     * 
     * @returns This Group, for chainning.
     */
    public setLocked(locked: boolean): Group {
        this.payload.locked = locked;
        return this;
    }

    /**
     * @returns The name of this group without spaces and special characters
     */
    public getNormalizedName(): string {
        if (this.payload.normalizedName) {
            return this.payload.normalizedName;
        } else {
            return Utils_.normalizeText(this.getName())
        }
    }

    /**
     * Tell if this is a credit (Incoming and Liabities) group
     */
    public isCredit(): boolean {
        return this.payload.credit;
    }

    /**
     * Tell if this is a permanent (Assets and Liabilities) group
     */
    public isPermanent(): boolean {
        return this.payload.permanent;
    }

    /**
     * Tell if this is a mixed (Assets/Liabilities or Incoming/Outgoing) group
     */
    public isMixed(): boolean {
        return this.payload.mixed;
    }

    /**
     * @returns The type of the group based on its accounts. Undefined if the group has accounts of different types
     */
    public getType(): AccountType | undefined {
        if (!this.payload.type) {
            return undefined;
        }
        return this.payload.type as AccountType;
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
        if (!this.accounts) {
            this.accounts = []
        }
        if (!this.idAccountMap) {
            this.idAccountMap = {}
        }
        if (!this.idAccountMap[account.getId()]) {
            this.idAccountMap[account.getId()] = account
            this.accounts.push(account)
        }
    }

    /**
     * Tell if the Group is hidden on main transactions menu
     */
    public isHidden(): boolean {
        return this.payload.hidden;
    }

    /**
     *  Hide/Show group on main menu.
     */
    public setHidden(hidden: boolean): Group {
        this.payload.hidden = hidden;
        return this;
    }

    /**
     * Perform create new group.
     * 
     * @returns The created Group, for chainning.
     */
    public create(): Group {
        try {
            this.payload = GroupService_.createGroup(this.book.getId(), this.payload);
            this.book.clearCache();
            return this;
        } catch (err) {
            this.book.clearCache();
            const group = this.book.getGroup(this.payload.name);
            if (group) {
                this.payload = group.payload;
                return this;
            } else {
                throw err;
            }
        }
    }

    /**
     * Perform update group, applying pending changes.
     */
    public update(): Group {
        this.payload = GroupService_.updateGroup(this.book.getId(), this.payload);
        this.book.clearCache();
        return this;

    }

    /**
     * Perform delete group.
     */
    public remove(): Group {
        this.payload = GroupService_.deleteGroup(this.book.getId(), this.payload);
        this.book.clearCache();
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
     * 
     * @returns The parent Groups chain up to the root Group
     */
    public getParentGroupsChain(): Group[] {
        const parentChain: Group[] = [];
        let parent = this.getParent();
        while (parent) {
            parentChain.push(parent);
            parent = parent.getParent();
        }
        return parentChain;
    }

    /**
     * 
     * @returns The root Group
     */
    public getRoot(): Group {
        if (this.getParent() != null) {
            return this.getParent().getRoot();
        } else {
            return this;
        }
    }

    /**
     * Sets the parent Group.
     * 
     * @returns This Group, for chainning.
     */
    public setParent(group: Group | null): Group {
        if (group) {
            this.payload.parent = { id: group.getId(), name: group.getName(), normalizedName: group.getNormalizedName() };
        } else {
            this.payload.parent = null;
        }
        return this;
    }

    /**
     * Tell if this group has any children
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
    public getDepth(): number {
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
        if (this.children == null) {
            this.children = [];
        }
        if (this.payload.parent != null) {
            let parentGroup: Group = idGroupMap[this.payload.parent.id];
            if (parentGroup != null) {
                this.parent = parentGroup;
                if (this.parent.children == null) {
                    this.parent.children = [];
                }
                this.parent.children.push(this);
            }
        }
    }

}
