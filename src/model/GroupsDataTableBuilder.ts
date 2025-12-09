/**
* A GroupsDataTableBuilder is used to setup and build two-dimensional arrays containing groups.
* 
* @public
*/
class GroupsDataTableBuilder {

    private groups: Group[];

    private shouldAddProperties: boolean;
    private shouldAddIds: boolean;

    private propertyKeys: string[];

    constructor(groups: Group[]) {
        this.groups = groups;
        this.shouldAddProperties = false;
        this.shouldAddIds = false;
    }

    /**
     * Defines whether include custom group properties.
     * 
     * @returns This builder with respective include properties option, for chaining.
     */
    public properties(include: boolean): GroupsDataTableBuilder {
        this.shouldAddProperties = include;
        return this;
    }

    /**
     * Defines whether include group ids.
     * 
     * @returns This builder with respective include ids option, for chaining.
     */
    public ids(include: boolean): GroupsDataTableBuilder {
        this.shouldAddIds = include;
        return this;
    }

    private mapPropertyKeys(): void {
        if (this.propertyKeys == null) {
            this.propertyKeys = [];
            for (const group of this.groups) {
                for (const key of group.getPropertyKeys()) {
                    if (this.propertyKeys.indexOf(key) <= -1) {
                        this.propertyKeys.push(key);
                    }
                }
            }
            this.propertyKeys = this.propertyKeys.sort();
        }
    }

    private getStringType(group: Group): string {
        let groupType = group.getType() ? group.getType() + '' : undefined;
        if (!groupType) {
            groupType = group.isPermanent() ? AccountType.ASSET + '_' + AccountType.LIABILITY : AccountType.INCOMING + '_' + AccountType.OUTGOING;
        }
        return groupType;
    }

    private getTypeIndex(type: string): number {
        if (type == AccountType.ASSET + '_' + AccountType.LIABILITY) {
            return 0;
        }
        if (type == AccountType.ASSET) {
            return 1;
        }
        if (type == AccountType.LIABILITY) {
            return 2;
        }
        if (type == AccountType.INCOMING + '_' + AccountType.OUTGOING) {
            return 3;
        }
        if (type == AccountType.INCOMING) {
            return 4;
        }
        return 5;
    }

    private getHasChildrenIndex(hasChildren: boolean): number {
        return hasChildren ? 0 : 1;
    }

    /**
     * @returns A two-dimensional array containing all [[Groups]].
     */
    public build(): any[][] {

        let table = new Array<Array<any>>();

        let groups = this.groups;
        groups.sort(this.COMPARATOR);

        let headers = [];

        if (this.shouldAddIds) {
            headers.push('Group Id');
        }

        headers.push('Name');
        headers.push('Type');
        headers.push('Parent');
        headers.push('Children');
        headers.push('Accounts');

        if (this.shouldAddProperties) {
            this.mapPropertyKeys();
        }

        for (const group of groups) {
            if (group.isHidden() || group.getParent()) {
                continue;
            }
            table.push(this.buildGroupLine(group));
            table = this.traverse(group, table);
        }

        if (this.shouldAddProperties) {
            headers = headers.concat(this.propertyKeys);
        }

        table.unshift(headers);
        table = Utils_.convertInMatrix(table);

        return table;
    }

    private buildGroupLine(group: Group): string[] {
        let line = new Array();

        if (this.shouldAddIds) {
            line.push(group.getId());
        }

        let parentName = group.getParent() ? group.getParent().getName() : '';
        line.push(group.getName());
        line.push(this.getStringType(group));
        line.push(parentName);
        line.push(group.getChildren().length);
        line.push(group.getAccounts().length);
        if (this.shouldAddProperties) {
            const properties = group.getProperties();
            for (const key of this.propertyKeys) {
                let propertyValue = properties[key];
                if (propertyValue) {
                    line.push(propertyValue);
                    continue;
                }
                line.push('');
            }
        }
        return line;
    }

    private traverse(group: Group, table: any[][]): any[][] {
        const children = group.getChildren();
        children.sort(this.COMPARATOR);
        for (const child of children) {
            table.push(this.buildGroupLine(child));
            if (child.hasChildren()) {
                this.traverse(child, table);
            }
        }
        return table;
    }

    private readonly COMPARATOR = (g1: Group, g2: Group): number => {
        let ret = this.getTypeIndex(this.getStringType(g1)) - this.getTypeIndex(this.getStringType(g2));
        if (ret == 0) {
            ret = this.getHasChildrenIndex(g1.hasChildren()) - this.getHasChildrenIndex(g2.hasChildren());
        }
        if (ret == 0) {
            ret = g1.getNormalizedName().localeCompare(g2.getNormalizedName());
        }
        return ret;
    }


    /******************* DEPRECATED METHODS *******************/
    /**
     * @deprecated
     */
    includeProperties(include: boolean): GroupsDataTableBuilder {
        return this.properties(include);
    }


}
