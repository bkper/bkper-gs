/**
 * A GroupsDataTableBuilder is used to setup and build two-dimensional arrays containing groups.
 * 
 * @public
 */
class GroupsDataTableBuilder {

    private groups: Group[];

    private shouldAddProperties: boolean;

    private propertyKeys: string[];

    constructor(groups: Group[]) {
        this.groups = groups;
        this.shouldAddProperties = false;
    }

    /**
     * Defines whether include custom group properties.
     * 
     * @returns This builder with respective include properties option, for chaining.
     */
    public includeProperties(include: boolean): GroupsDataTableBuilder {
        this.shouldAddProperties = include;
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

    /**
     * @returns A two-dimensional array containing all [[Groups]].
     */
    public build(): any[][] {

        let table = new Array<Array<any>>();

        let groups = this.groups;

        let headers = [];
        headers.push('Name');
        headers.push('Parent');
        headers.push('Children');

        groups.sort((g1: Group, g2: Group) => {
            return g1.getNormalizedName().localeCompare(g2.getNormalizedName());
        })

        if (this.shouldAddProperties) {
            this.mapPropertyKeys();
        }

        for (const group of groups) {

            if (group.isHidden()) {
                continue;
            }

            let line = new Array();
            line.push(group.getName());

            let parentName = group.getParent() ? group.getParent().getName() : '';
            line.push(parentName);

            line.push(group.getChildren().length);

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

            table.push(line);
        }

        if (this.shouldAddProperties) {
            headers = headers.concat(this.propertyKeys);
        }

        table.unshift(headers);

        table = Utils_.convertInMatrix(table);

        return table;

    }

}
