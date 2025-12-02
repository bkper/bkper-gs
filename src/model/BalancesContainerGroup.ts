
class GroupBalancesContainer implements BalancesContainer {

    payload: bkper.GroupBalances;
    private parent: BalancesContainer;
    private accountBalances: AccountBalancesContainer[];
    private groupBalances: GroupBalancesContainer[];

    private balancesReport: BalancesReport;

    private balancesContainersMap: { [name: string]: BalancesContainer };
    private depth: number;


    constructor(parent: BalancesContainer, balancesReport: BalancesReport, payload: bkper.GroupBalances) {
        this.parent = parent;
        this.balancesReport = balancesReport;
        this.payload = payload;
        this.balancesContainersMap = null;
    }

    getParent(): BalancesContainer {
        return this.parent;
    }

    getDepth(): number {
        if (this.depth == null) {
            if (this.getParent() != null) {
                this.depth = this.getParent().getDepth() + 1;
            } else {
                this.depth = 0;
            }
        }
        return this.depth;
    }

    getGroup(): Group {
        return this.balancesReport.getBook().getGroup(this.getNormalizedName());
    }

    getAccount(): Account {
        return null;
    }

    isFromAccount(): boolean {
        return false;
    }

    isFromGroup(): boolean {
        return true;
    }

    public hasGroupBalances(): boolean {
        return this.getGroupBalances() != null && this.getGroupBalances().length > 0;
    }

    public getBalancesReport(): BalancesReport {
        return this.balancesReport;
    }

    public getName(): string {
        return this.payload.name;
    }

    public getNormalizedName(): string {
        return this.payload.normalizedName;
    }

    public isCredit(): boolean {
        return this.payload.credit;
    }

    public isPermanent() {
        return this.payload.permanent;
    }

    public getCumulativeBalance(): Amount {
        return Utils_.getRepresentativeValue(new Amount(this.payload.cumulativeBalance), this.isCredit());
    }

    public getCumulativeBalanceRaw(): Amount {
        return new Amount(this.payload.cumulativeBalance);
    }

    public getCumulativeCredit(): Amount {
        return new Amount(this.payload.cumulativeCredit);
    }

    public getCumulativeDebit(): Amount {
        return new Amount(this.payload.cumulativeDebit);
    }

    public getCumulativeBalanceText(): string {
        return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
    }

    public getCumulativeBalanceRawText(): string {
        return this.balancesReport.getBook().formatValue(this.getCumulativeBalanceRaw());
    }

    public getCumulativeCreditText(): string {
        return this.balancesReport.getBook().formatValue(this.getCumulativeCredit());
    }

    public getCumulativeDebitText(): string {
        return this.balancesReport.getBook().formatValue(this.getCumulativeDebit());
    }

    public getPeriodBalance(): Amount {
        return Utils_.getRepresentativeValue(new Amount(this.payload.periodBalance), this.isCredit());
    }

    public getPeriodBalanceRaw(): Amount {
        return new Amount(this.payload.periodBalance);
    }

    public getPeriodCredit(): Amount {
        return new Amount(this.payload.periodCredit);
    }

    public getPeriodDebit(): Amount {
        return new Amount(this.payload.periodDebit);
    }

    public getPeriodBalanceText(): string {
        return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
    }

    public getPeriodBalanceRawText(): string {
        return this.balancesReport.getBook().formatValue(this.getPeriodBalanceRaw());
    }

    public getPeriodCreditText(): string {
        return this.balancesReport.getBook().formatValue(this.getPeriodCredit());
    }

    public getPeriodDebitText(): string {
        return this.balancesReport.getBook().formatValue(this.getPeriodDebit());
    }

    public getBalances(): Balance[] {
        if (!this.payload.balances) {
            return new Array<Balance>();
        }
        return this.payload.balances.map(balancePlain => new Balance(this, balancePlain));
    }

    public createDataTable() {
        return new BalancesDataTableBuilder(this.balancesReport.getBook(), this.getBalancesContainers(), this.balancesReport.getPeriodicity());
    }

    public getBalancesContainers(): BalancesContainer[] {
        var containers = new Array<BalancesContainer>();
        const groupBalances = this.getGroupBalances();
        if (groupBalances && groupBalances.length > 0) {
            containers = containers.concat(groupBalances);
        }
        const accountBalances = this.getAccountBalances();
        if (accountBalances && accountBalances.length > 0) {
            containers = containers.concat(accountBalances);
        }
        return containers;
    }

    private getAccountBalances(): AccountBalancesContainer[] {
        var accountBalances = this.payload.accountBalances;
        if (this.accountBalances == null && accountBalances != null) {
            this.accountBalances = [];
            for (var i = 0; i < accountBalances.length; i++) {
                var accountBalance = accountBalances[i];
                this.accountBalances.push(new AccountBalancesContainer(this, this.balancesReport, accountBalance));
            }
        }
        return this.accountBalances;
    }

    private getGroupBalances(): GroupBalancesContainer[] {
        var groupBalances = this.payload.groupBalances;
        if (this.groupBalances == null && groupBalances != null) {
            this.groupBalances = [];
            for (var i = 0; i < groupBalances.length; i++) {
                var groupBalance = groupBalances[i];
                this.groupBalances.push(new GroupBalancesContainer(this, this.balancesReport, groupBalance));
            }
        }
        return this.groupBalances;
    }

    public getProperties(): { [key: string]: string } {
        return this.payload.properties != null ? { ...this.payload.properties } : {};
    }

    public getProperty(...keys: string[]): string {
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            let value = this.payload.properties != null ? this.payload.properties[key] : null;
            if (value != null && value.trim() != '') {
                return value;
            }
        }
        return null;
    }

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

    getBalancesContainer(name: string): BalancesContainer {

        const normalizedName = normalizeName(name);

        if (normalizedName == null) {
            return null;
        }

        let rootContainers = this.getBalancesContainers();
        if (rootContainers == null || rootContainers.length == 0) {
            throw `${name} not found on group ${this.getName()}`;
        }

        if (this.balancesContainersMap == null) {
            let balancesContainersMap: { [name: string]: BalancesContainer } = {};
            this.balancesContainersMap = this.fillBalancesContainersMap(balancesContainersMap, rootContainers);
        }

        const balancesContainer = this.balancesContainersMap[normalizedName];
        if (!balancesContainer) {
            throw `${name} not found on group ${this.getName()}`;
        }

        return balancesContainer;
    }

    private fillBalancesContainersMap(map: { [name: string]: BalancesContainer }, containers: BalancesContainer[]): { [name: string]: BalancesContainer } {
        for (let i = 0; i < containers.length; i++) {
            const container = containers[i];
            if (!map[container.getNormalizedName()]) {
                map[container.getNormalizedName()] = container;
            }
            let nextContainers = container.getBalancesContainers();
            if (nextContainers && nextContainers.length > 0) {
                this.fillBalancesContainersMap(map, container.getBalancesContainers());
            }
        }
        return map;
    }

    public getAccountBalancesContainers(): BalancesContainer[] {
        let rootContainers: BalancesContainer[] = [];
        for (const container of this.getBalancesContainers()) {
            this.traverseContainers(container, rootContainers);
        }
        return rootContainers;
    }

    private traverseContainers(container: BalancesContainer, containers: BalancesContainer[]): void {
        if (container.getBalancesContainers() != null && container.getBalancesContainers().length > 0) {
            for (const subContainer of container.getBalancesContainers()) {
                this.traverseContainers(subContainer, containers);
            }
        } else if (container.isFromAccount()) {
            containers.push(container);
        }
    }

    public addBalancesContainer(container: BalancesContainer): BalancesContainer {
        if (container.isFromGroup()) {
            throw `Added container must be from account`;
        }
        if (this.canAddContainer(container)) {
            // Perform add container
            this.addAccountContainer(container as AccountBalancesContainer);
            // Repeat for parent
            let parent = this.parent as GroupBalancesContainer;
            if (parent) {
                parent.addBalancesContainer(container);
            } else {
                // Reset report balancesContainerMap
                this.balancesReport.balancesContainersMap = null;
            }
        }
        return this;
    }

    private canAddContainer(container: BalancesContainer): boolean {
        if (this.hasGroupBalances()) {
            return true;
        }
        if (!this.hasGroupBalances() && this.getBalancesContainers().map(c => c.getName()).indexOf(container.getName()) < 0) {
            return true;
        }
        return false;
    }

    private addAccountContainer(accountContainer: AccountBalancesContainer) {

        // Adjust period & cumulative balances
        this.payload.cumulativeBalance = this.sum(this.payload.cumulativeBalance, accountContainer.payload.cumulativeBalance);
        this.payload.cumulativeCredit = this.sum(this.payload.cumulativeCredit, accountContainer.payload.cumulativeCredit);
        this.payload.cumulativeDebit = this.sum(this.payload.cumulativeDebit, accountContainer.payload.cumulativeDebit);
        this.payload.periodBalance = this.sum(this.payload.periodBalance, accountContainer.payload.periodBalance);
        this.payload.periodCredit = this.sum(this.payload.periodCredit, accountContainer.payload.periodCredit);
        this.payload.periodDebit = this.sum(this.payload.periodDebit, accountContainer.payload.periodDebit);

        // Adjust balances
        let groupBalancesMap: { [key: string]: bkper.Balance } = {};
        for (const groupBalance of this.getBalances()) {
            groupBalancesMap[`${groupBalance.payload.fuzzyDate}`] = groupBalance.payload;
        }

        for (const accountBalance of accountContainer.getBalances()) {
            const key = `${accountBalance.payload.fuzzyDate}`;
            if (groupBalancesMap[key]) {
                groupBalancesMap[key] = this.sumBalances(groupBalancesMap[key], accountBalance.payload);
            } else {
                groupBalancesMap[key] = { ...accountBalance.payload };
            }
        }

        let balances: bkper.Balance[] = [];
        for (const key of Object.keys(groupBalancesMap)) {
            balances.push(groupBalancesMap[key]);
        }
        this.payload.balances = balances;

        // Add to accountBalances
        if (!this.hasGroupBalances()) {
            // Adjust credit nature
            accountContainer.payload.credit = this.payload.credit;
            if (!this.accountBalances) {
                this.accountBalances = [];
            }
            this.accountBalances.push(accountContainer);
        }

        // Reset balancesContainersMap
        this.balancesContainersMap = null;
    }

    private sum(firstValue: string, secondValue: string): string {
        return (new Amount(firstValue)).plus(new Amount(secondValue)).toString();
    }

    private sumBalances(baseBalance: bkper.Balance, balanceToAdd: bkper.Balance): bkper.Balance {
        baseBalance.cumulativeBalance = this.sum(baseBalance.cumulativeBalance, balanceToAdd.cumulativeBalance);
        baseBalance.cumulativeCredit = this.sum(baseBalance.cumulativeCredit, balanceToAdd.cumulativeCredit);
        baseBalance.cumulativeDebit = this.sum(baseBalance.cumulativeDebit, balanceToAdd.cumulativeDebit);
        baseBalance.periodBalance = this.sum(baseBalance.periodBalance, balanceToAdd.periodBalance);
        baseBalance.periodCredit = this.sum(baseBalance.periodCredit, balanceToAdd.periodCredit);
        baseBalance.periodDebit = this.sum(baseBalance.periodDebit, balanceToAdd.periodDebit);
        return baseBalance;
    }

    public removeBalancesContainer(container: BalancesContainer): BalancesContainer {
        if (container.isFromGroup()) {
            throw `Removed container must be from account`;
        }
        if (this.canRemoveContainer(container)) {
            // Perform remove container
            this.removeAccountContainer(container as AccountBalancesContainer);
            // Repeat for parent
            let parent = this.parent as GroupBalancesContainer;
            if (parent) {
                parent.removeBalancesContainer(container);
            } else {
                // Reset report balancesContainersMap
                this.balancesReport.balancesContainersMap = null;
            }
        }
        return this;
    }

    private canRemoveContainer(container: BalancesContainer): boolean {
        if (this.hasGroupBalances()) {
            return true;
        }
        if (!this.hasGroupBalances() && this.getBalancesContainers().map(c => c.getName()).indexOf(container.getName()) >= 0) {
            return true;
        }
        return false;
    }

    private removeAccountContainer(accountContainer: AccountBalancesContainer) {

        // Adjust period & cumulative balances
        this.payload.cumulativeBalance = this.subtract(this.payload.cumulativeBalance, accountContainer.payload.cumulativeBalance);
        this.payload.cumulativeCredit = this.subtract(this.payload.cumulativeCredit, accountContainer.payload.cumulativeCredit);
        this.payload.cumulativeDebit = this.subtract(this.payload.cumulativeDebit, accountContainer.payload.cumulativeDebit);
        this.payload.periodBalance = this.subtract(this.payload.periodBalance, accountContainer.payload.periodBalance);
        this.payload.periodCredit = this.subtract(this.payload.periodCredit, accountContainer.payload.periodCredit);
        this.payload.periodDebit = this.subtract(this.payload.periodDebit, accountContainer.payload.periodDebit);

        // Adjust balances
        let groupBalancesMap: { [key: string]: bkper.Balance } = {};
        for (const groupBalance of this.getBalances()) {
            groupBalancesMap[`${groupBalance.payload.fuzzyDate}`] = groupBalance.payload;
        }

        for (const accountBalance of accountContainer.getBalances()) {
            const key = `${accountBalance.payload.fuzzyDate}`;
            if (groupBalancesMap[key]) {
                groupBalancesMap[key] = this.subtractBalances(groupBalancesMap[key], accountBalance.payload);
            }
        }

        let balances: bkper.Balance[] = [];
        for (const key of Object.keys(groupBalancesMap)) {
            balances.push(groupBalancesMap[key]);
        }
        this.payload.balances = balances;

        // Remove from accountBalances
        if (!this.hasGroupBalances()) {
            for (const accountBalance of this.accountBalances) {
                const balanceName = accountBalance.getName();
                if (accountContainer.getName() == balanceName) {
                    const indexToRemove = this.accountBalances.map(b => b.getName()).indexOf(balanceName);
                    this.accountBalances.splice(indexToRemove, 1);
                }
            }
        }

        // Reset balancesContainersMap
        this.balancesContainersMap = null;
    }

    private subtract(firstValue: string, secondValue: string): string {
        return (new Amount(firstValue)).minus(new Amount(secondValue)).toString();
    }

    private subtractBalances(baseBalance: bkper.Balance, balanceToSubtract: bkper.Balance): bkper.Balance {
        baseBalance.cumulativeBalance = this.subtract(baseBalance.cumulativeBalance, balanceToSubtract.cumulativeBalance);
        baseBalance.cumulativeCredit = this.subtract(baseBalance.cumulativeCredit, balanceToSubtract.cumulativeCredit);
        baseBalance.cumulativeDebit = this.subtract(baseBalance.cumulativeDebit, balanceToSubtract.cumulativeDebit);
        baseBalance.periodBalance = this.subtract(baseBalance.periodBalance, balanceToSubtract.periodBalance);
        baseBalance.periodCredit = this.subtract(baseBalance.periodCredit, balanceToSubtract.periodCredit);
        baseBalance.periodDebit = this.subtract(baseBalance.periodDebit, balanceToSubtract.periodDebit);
        return baseBalance;
    }

}
