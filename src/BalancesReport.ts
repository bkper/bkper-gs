
/**
 * Class representing a Balance Report, generated when calling [Book.getBalanceReport](#book_getbalancesreport)
 * 
 * @public
 */
class BalancesReport {

    private wrapped: bkper.Balances;

    private book: Book;
    private groupBalancesContainers: GroupBalancesContainer[];
    private accountBalancesContainers: AccountBalancesContainer[];
    balancesContainersMap: { [name: string]: BalancesContainer };

    constructor(book: Book, balancesReportPlain: bkper.Balances) {
        this.book = book;
        this.wrapped = balancesReportPlain;
        this.groupBalancesContainers = null;
        this.accountBalancesContainers = null;
        this.balancesContainersMap = null;
    }

    /**
     * The [[Book]] that generated the report.
     */
    public getBook(): Book {
        return this.book;
    }

    /**
     * Creates a BalancesDataTableBuilder to generate a two-dimensional array with all [[BalancesContainers]].
     */
    public createDataTable(): BalancesDataTableBuilder {
        return new BalancesDataTableBuilder(this.book, this.getBalancesContainers(), this.getPeriodicity());
    }

    /**
     * Gets all [[BalancesContainers]] of the report.
     */
    public getBalancesContainers(): BalancesContainer[] {
        var containers = new Array<BalancesContainer>();
        if (this.getRootAccountBalancesContainers() != null) {
            containers = containers.concat(this.getRootAccountBalancesContainers());
        }
        if (this.getGroupBalancesContainers() != null) {
            containers = containers.concat(this.getGroupBalancesContainers());
        }
        return containers;
    }


    /**
     * The [[Periodicity]] of the query used to generate the report.
     */
    public getPeriodicity(): Periodicity {
        return this.wrapped.periodicity as Periodicity;
    }

    /**
     * Check if the report has only one Group specified on query.
     */
    public hasOnlyOneGroup(): boolean {
        return this.getGroupBalancesContainers() != null && this.getGroupBalancesContainers().length == 1;
    }

    private getRootAccountBalancesContainers(): AccountBalancesContainer[] {
        if (this.accountBalancesContainers == null && this.wrapped.accountBalances != null) {
            this.accountBalancesContainers = [];
            for (var i = 0; i < this.wrapped.accountBalances.length; i++) {
                var accountBalance = this.wrapped.accountBalances[i];
                var accountBalancesReport = new AccountBalancesContainer(null, this, accountBalance);
                this.accountBalancesContainers.push(accountBalancesReport);
            }
        }
        return this.accountBalancesContainers;
    }


    private getGroupBalancesContainers(): GroupBalancesContainer[] {
        if (this.groupBalancesContainers == null && this.wrapped.groupBalances != null) {
            this.groupBalancesContainers = [];
            for (var i = 0; i < this.wrapped.groupBalances.length; i++) {
                var grouBalances = this.wrapped.groupBalances[i];
                var accGroupBalances = new GroupBalancesContainer(null, this, grouBalances);
                this.groupBalancesContainers.push(accGroupBalances);
            }
        }
        return this.groupBalancesContainers;
    }

    /**
     * Gets a specific [[BalancesContainer]]. 
     * 
     * @param name The [[Account]] name, [[Group]] name.
     */
    public getBalancesContainer(name: string): BalancesContainer {

        let rootContainers = this.getBalancesContainers();
        if (rootContainers == null || rootContainers.length == 0) {
            throw `${name} not found`;
        }

        if (this.balancesContainersMap == null) {
            let balancesContainersMap: { [name: string]: BalancesContainer } = {};
            this.balancesContainersMap = this.fillBalancesContainersMap(balancesContainersMap, rootContainers);
        }

        const balancesContainer = this.balancesContainersMap[name];
        if (!balancesContainer) {
            throw `${name} not found`;
        }

        return balancesContainer;
    }

    private fillBalancesContainersMap(map: { [name: string]: BalancesContainer }, containers: BalancesContainer[]): { [name: string]: BalancesContainer } {
        for (let i = 0; i < containers.length; i++) {
            const container = containers[i];
            if (!map[container.getName()]) {
                map[container.getName()] = container;
            }
            let nextContainers = container.getBalancesContainers();
            if (nextContainers && nextContainers.length > 0) {
                this.fillBalancesContainersMap(map, container.getBalancesContainers());
            }
        }
        return map;
    }

    /**
     * Gets all [[Account]] [[BalancesContainers]]. 
     */
    public getAccountBalancesContainers(): BalancesContainer[] {
        let leafContainers: BalancesContainer[] = [];
        for (const container of this.getBalancesContainers()) {
            leafContainers = leafContainers.concat(container.getAccountBalancesContainers());
        }
        return leafContainers;
    }


}