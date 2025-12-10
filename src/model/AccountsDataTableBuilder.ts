/**
 * A AccountsDataTableBuilder is used to setup and build two-dimensional arrays containing accounts.
 * 
 * @public
 */
class AccountsDataTableBuilder {

    private accounts: Account[];

    private shouldIncludeArchived: boolean;
    private shouldAddGroups: boolean;
    private shouldAddProperties: boolean;
    private shouldAddIds: boolean;

    private propertyKeys: string[];

    constructor(accounts: Account[]) {
        this.accounts = accounts;
        this.shouldIncludeArchived = false;
        this.shouldAddGroups = false;
        this.shouldAddProperties = false;
        this.shouldAddIds = false;
    }

    /**
     * Defines whether the archived accounts should included.
     *
     * @returns This builder, for chaining.
     */
    public archived(include: boolean): AccountsDataTableBuilder {
        this.shouldIncludeArchived = include;
        return this;
    }


    /**
     * Defines whether include account groups.
     * 
     * @returns This builder with respective include groups option, for chaining.
     */
    public groups(include: boolean): AccountsDataTableBuilder {
        this.shouldAddGroups = include;
        return this;
    }


    /**
     * Defines whether include custom account properties.
     * 
     * @returns This builder with respective include properties option, for chaining.
     */
    public properties(include: boolean): AccountsDataTableBuilder {
        this.shouldAddProperties = include;
        return this;
    }

    /**
     * Defines whether include account ids.
     * 
     * @returns This builder with respective include ids option, for chaining.
     */
    public ids(include: boolean): AccountsDataTableBuilder {
        this.shouldAddIds = include;
        return this;
    }

    private getPropertyKeys(): string[] {
        if (this.propertyKeys == null) {
            this.propertyKeys = [];
            for (const account of this.accounts) {
                for (const key of account.getPropertyKeys()) {
                    if (this.propertyKeys.indexOf(key) <= -1) {
                        this.propertyKeys.push(key);
                    }
                }
            }
            this.propertyKeys = this.propertyKeys.sort();
        }
        return this.propertyKeys;
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
     * Builds group columns for all accounts.
     * 
     * Each unique group gets its own dedicated column, ordered by depth (parents first),
     * then alphabetically within each depth level. This ensures a specific group always
     * appears in the same column across all accounts, enabling filtering.
     * 
     * @param accounts The accounts to build group columns for
     * @returns Map of account ID to array of group names (all arrays have identical length)
     */
    private buildAllGroupColumns_(accounts: Account[]): Map<string, string[]> {
        // Phase 1: Collect all unique groups and organize by account
        const allGroups = new Map<string, Group>();
        const accountGroupsByDepth = new Map<string, Map<number, Group[]>>();

        for (const account of accounts) {
            const groupsByDepth = new Map<number, Group[]>();
            for (const group of account.getGroups()) {
                // Collect unique groups
                allGroups.set(group.getId(), group);

                // Organize account's groups by depth
                const depth = group.getDepth();
                if (!groupsByDepth.has(depth)) {
                    groupsByDepth.set(depth, []);
                }
                groupsByDepth.get(depth)!.push(group);
            }
            accountGroupsByDepth.set(account.getId(), groupsByDepth);
        }

        // Phase 2: Sort all groups by depth, then alphabetically
        const sortedGroups = Array.from(allGroups.values()).sort((a, b) => {
            const depthDiff = a.getDepth() - b.getDepth();
            if (depthDiff !== 0) {
                return depthDiff;
            }
            return a.getNormalizedName().localeCompare(b.getNormalizedName());
        });

        // Phase 3: Build column arrays for each account
        const result = new Map<string, string[]>();
        for (const account of accounts) {
            const columns: string[] = [];
            const accountGroups = account.getGroups();
            const accountGroupIds = new Set(accountGroups.map(g => g.getId()));

            for (const group of sortedGroups) {
                if (accountGroupIds.has(group.getId())) {
                    columns.push(group.getName());
                } else {
                    columns.push('');
                }
            }
            result.set(account.getId(), columns);
        }

        return result;
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

        if (this.shouldAddIds) {
            headers.push('Account Id');
        }

        headers.push('Name');
        headers.push('Type');

        // Build group columns once if needed
        let groupColumns: Map<string, string[]> | null = null;
        if (this.shouldAddGroups) {
            groupColumns = this.buildAllGroupColumns_(accounts);
            const columnCount = groupColumns.size > 0
                ? groupColumns.values().next().value.length
                : 0;
            for (let i = 0; i < columnCount; i++) {
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

        let propertyKeys: string[] = [];
        if (this.shouldAddProperties) {
            propertyKeys = this.getPropertyKeys();
        }

        for (const account of accounts) {

            let line = new Array();

            if (this.shouldAddIds) {
                line.push(account.getId());
            }

            line.push(account.getName());
            line.push(account.getType());

            if (this.shouldAddGroups && groupColumns) {
                const cols = groupColumns.get(account.getId()) || [];
                line.push(...cols);
            }

            if (this.shouldAddProperties) {
                const properties = account.getProperties();
                for (const key of propertyKeys) {
                    let propertyValue = properties[key];
                    if (propertyValue) {
                        line.push(propertyValue);
                        continue;
                    }
                    line.push('');
                }
            }

            table.push(line);
        }

        if (this.shouldAddProperties) {
            headers = headers.concat(propertyKeys);
        }

        table.unshift(headers);

        table = Utils_.convertInMatrix(table);

        return table;

    }

    /******************* DEPRECATED METHODS *******************/
    /**
     * @deprecated
     */
    includeGroups(include: boolean): AccountsDataTableBuilder {
        return this.groups(include);
    }
    /**
     * @deprecated
     */
    includeArchived(include: boolean): AccountsDataTableBuilder {
        return this.archived(include);
    }
    /**
     * @deprecated
     */
    includeProperties(include: boolean): AccountsDataTableBuilder {
        return this.properties(include);
    }

}
