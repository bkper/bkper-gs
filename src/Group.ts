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

    private children: Group[];
    private accounts: Account[];
    private idAccountMap: { [key: string]: Account };

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
     * @returns True if the Group is locked by the Book owner.
     */
    public isLocked(): boolean {
        if (this.wrapped.locked == null) {
            return false;
        }
        return this.wrapped.locked;
    }

    /**
     * 
     * Sets the locked state of the Group.
     * 
     * @returns This Group, for chainning.
     */
    public setLocked(locked: boolean): Group {
        this.wrapped.locked = locked;
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
     * Tell if this is a credit (Incoming and Liabities) group
     */
    public isCredit(): boolean {
        return this.wrapped.credit;
    }

    /**
     * Tell if this is a permanent (Assets and Liabilities) group
     */
    public isPermanent(): boolean {
        return this.wrapped.permanent;
    }

    /**
     * Tell if this is a mixed (Assets/Liabilities or Incoming/Outgoing) group
     */
    public isMixed(): boolean {
        return this.wrapped.mixed;
    }

    /**
     * @returns The type of the group based on its accounts. Undefined if the group has accounts of different types
     */
    public getType(): AccountType | undefined {
        if (!this.wrapped.type) {
            return undefined;
        }
        return this.wrapped.type as AccountType;
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
     * Gets the custom properties stored in this Group
     */
    public getProperties(): { [key: string]: string } {
        return this.wrapped.properties != null ? { ...this.wrapped.properties } : {};
    }

    /**
     * Gets the custom properties keys stored in this Group.
     */
    public getPropertyKeys(): string[] {
        let properties = this.getProperties();
        let propertyKeys: string[] = [];
        if (properties) {
            for (const key in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, key)) {
                    propertyKeys.push(key);
                }
            }
        }
        propertyKeys = propertyKeys.sort();
        return propertyKeys;
    }

    /**
     * Sets the custom properties of the Group
     * 
     * @param properties Object with key/value pair properties
     * 
     * @returns This Group, for chainning. 
     */
    public setProperties(properties: { [key: string]: string }): Group {
        this.wrapped.properties = { ...properties };
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
            let value = this.wrapped.properties != null ? this.wrapped.properties[key] : null
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
     * Checks if a property key represents a hidden property.
     * Hidden properties are those whose keys end with an underscore "_".
     *
     * @param key - The property key to check
     * @returns True if the property is hidden, false otherwise
     */
    private isHiddenProperty(key: string): boolean {
        return key.endsWith('_');
    }

    /**
     * Sets a custom property in this Group, filtering out hidden properties.
     * Hidden properties are those whose keys end with an underscore "_".
     *
     * @param key - The property key
     * @param value - The property value, or null/undefined to clean it
     *
     * @returns This Group, for chaining
     */
    public setVisibleProperty(key: string, value: string | null | undefined): Group {
        if (this.isHiddenProperty(key)) {
            return this;
        }
        return this.setProperty(key, value);
    }

    /**
     * Sets the custom properties of this Group, filtering out hidden properties.
     * Hidden properties are those whose keys end with an underscore "_".
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns This Group, for chaining
     */
    public setVisibleProperties(properties: { [key: string]: string }): Group {
        if (properties == null) {
            return this;
        }
        const filteredProperties: { [key: string]: string } = {};
        for (const key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                if (!this.isHiddenProperty(key)) {
                    filteredProperties[key] = properties[key];
                }
            }
        }
        return this.setProperties(filteredProperties);
    }

    /**
     * Gets the visible custom properties stored in this Group.
     * Hidden properties (those ending with "_") are excluded from the result.
     *
     * @returns Object with key/value pair properties, excluding hidden properties
     */
    public getVisibleProperties(): { [key: string]: string } {
        const allProperties = this.getProperties();
        const visibleProperties: { [key: string]: string } = {};
        for (const key in allProperties) {
            if (Object.prototype.hasOwnProperty.call(allProperties, key)) {
                if (!this.isHiddenProperty(key)) {
                    visibleProperties[key] = allProperties[key];
                }
            }
        }
        return visibleProperties;
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
     * 
     * @returns The created Group, for chainning.
     */
    public create(): Group {
        try {
            this.wrapped = GroupService_.createGroup(this.book.getId(), this.wrapped);
            this.book.clearCache();
            return this;
        } catch (err) {
            this.book.clearCache();
            const group = this.book.getGroup(this.wrapped.name);
            if (group) {
                this.wrapped = group.wrapped;
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
        this.wrapped = GroupService_.updateGroup(this.book.getId(), this.wrapped);
        this.book.clearCache();
        return this;

    }

    /**
     * Perform delete group.
     */
    public remove(): Group {
        this.wrapped = GroupService_.deleteGroup(this.book.getId(), this.wrapped);
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
            this.wrapped.parent = { id: group.getId(), name: group.getName(), normalizedName: group.getNormalizedName() };
        } else {
            this.wrapped.parent = null;
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
        if (this.wrapped.parent != null) {
            let parentGroup: Group = idGroupMap[this.wrapped.parent.id];
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
