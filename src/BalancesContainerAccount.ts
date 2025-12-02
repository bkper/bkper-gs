
class AccountBalancesContainer implements BalancesContainer {

    payload: bkper.AccountBalances;
    private balancesReport: BalancesReport;
    private parent: BalancesContainer;
    private depth: number;

    constructor(parent: BalancesContainer, balancesReport: BalancesReport, payload: bkper.AccountBalances) {
        this.parent = parent;
        this.balancesReport = balancesReport;
        this.payload = payload;
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
        return null;
    }

    getAccount(): Account {
        return this.balancesReport.getBook().getAccount(this.getNormalizedName());
    }

    isFromAccount(): boolean {
        return true;
    }

    isFromGroup(): boolean {
        return false;
    }

    public hasGroupBalances(): boolean {
        return false;
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

    public isCredit() {
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

    public createDataTable(): BalancesDataTableBuilder {
        return new BalancesDataTableBuilder(this.balancesReport.getBook(), [this], this.balancesReport.getPeriodicity());
    }

    public getBalancesContainers(): BalancesContainer[] {
        return [];
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

        if (this.getNormalizedName() == normalizedName) {
            return this;
        }

        throw `${name} does not match ${this.getName()}`;
    }

    public getAccountBalancesContainers(): BalancesContainer[] {
        return [this];
    }

    public addBalancesContainer(container: BalancesContainer): BalancesContainer {
        throw `Container must be from group`;
    }

    public removeBalancesContainer(container: BalancesContainer): BalancesContainer {
        throw `Container must be from group`;
    }

}

