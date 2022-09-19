/**
 * A GroupsDataTableBuilder is used to setup and build two-dimensional arrays containing groups.
 * 
 * @public
 */
class GroupsDataTableBuilder {

    private groups: Group[];

    // private shouldAddProperties: boolean;

    // private propertyKeys: string[];

    constructor(groups: Group[]) {
        this.groups = groups;
        // this.shouldAddProperties = false;
    }

    // /**
    //  * Defines whether include custom group properties.
    //  * 
    //  * @returns This builder with respective include properties option, for chaining.
    //  */
    // public includeProperties(include: boolean): GroupsDataTableBuilder {
    //     this.shouldAddProperties = include;
    //     return this;
    // }

    // private getPropertyKeys(): string[] {
    //     if (this.propertyKeys == null) {
    //         this.propertyKeys = [];
    //         for (const group of this.groups) {
    //             for (const key of group.getPropertyKeys()) {
    //                 if (this.propertyKeys.indexOf(key) <= -1) {
    //                     this.propertyKeys.push(key);
    //                 }
    //             }
    //         }
    //         this.propertyKeys = this.propertyKeys.sort();
    //     }
    //     return this.propertyKeys;
    // }

    /**
     * @returns A two-dimensional array containing all [[Accounts]].
     */
    public build(): any[][] {

        let table = new Array<Array<any>>();

        let groups = this.groups;

        let headers = [];
        headers.push('Name');

        groups.sort((g1: Group, g2: Group) => {
            return g1.getNormalizedName().localeCompare(g2.getNormalizedName());
        })

        // let propertyKeys: string[] = [];
        // if (this.shouldAddProperties) {
        //     propertyKeys = this.getPropertyKeys();
        // }

        for (const group of groups) {

            // if (group.isHidden() || group.hasChildren()) {
            //     continue;
            // }

            let line = new Array();
            line.push(group.getName());

            // if (this.shouldAddProperties) {
            //     const properties = group.getProperties();
            //     for (const key of propertyKeys) {
            //         let propertyValue = properties[key];
            //         if (propertyValue) {
            //             line.push(propertyValue);
            //             continue;
            //         }
            //         line.push('');
            //     }
            // }

            table.push(line);
        }

        // if (this.shouldAddProperties) {
        //     headers = headers.concat(propertyKeys);
        // }

        table.unshift(headers);

        table = Utils_.convertInMatrix(table);

        return table;

    }

}
