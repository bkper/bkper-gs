/**
 *
 * A Book represents [General Ledger](https://en.wikipedia.org/wiki/General_ledger) for a company or business, but can also represent a [Ledger](https://en.wikipedia.org/wiki/Ledger) for a project or department
 *
 * It contains all [[Accounts]] where [[Transactions]] are recorded/posted;
 * 
 * @public
 */
class Book {

    private id: string
    private wrapped: bkper.Book;
    private accounts: Account[];
    private groups: Group[];
    private collection: Collection;
    private idAccountMap: { [key: string]: Account };
    private nameAccountMap: { [key: string]: Account };
    private idGroupMap: { [key: string]: Group };
    private nameGroupMap: { [key: string]: Group };
    private savedQueries: bkper.Query[];
    private apps: App[];

    constructor(id: string, wrapped?: bkper.Book) {
        this.id = id;
        this.wrapped = wrapped;
    }

    /**
     * Same as bookId param
     * 
     * @return The id of this Book
     */
    public getId(): string {
        return this.id;
    }

    /**
     * @return The name of this Book
     */
    public getName(): string {
        this.checkBookLoaded_();
        return this.wrapped.name;
    }

    /**
     * 
     * Sets the name of the Book.
     * 
     * @returns This Book, for chainning.
     */
    public setName(name: string): Book {
        this.wrapped.name = name;
        return this;
    }

    /**
     * @return The number of fraction digits (decimal places) supported by this Book
     */
    public getFractionDigits(): number {
        this.checkBookLoaded_();
        return this.wrapped.fractionDigits;
    }

    /**
     * 
     * Sets the number of fraction digits (decimal places) supported by this Book
     * 
     * @returns This Book, for chainning.
     */
    public setFractionDigits(fractionDigits: number): Book {
        this.wrapped.fractionDigits = fractionDigits;
        return this;
    }

    /**
     * @return The name of the owner of the Book
     */
    public getOwnerName(): string {
        this.checkBookLoaded_();
        return this.wrapped.ownerName;
    }

    private checkBookLoaded_(): void {
        if (this.wrapped == null) {
            this.wrapped = BookService_.loadBookWrapped(this.getId());
            this.configureGroups_(this.wrapped.groups);
            this.configureAccounts_(this.wrapped.accounts);
        }
    }

    private checkAccountsLoaded_(): void {
        this.checkBookLoaded_()
        if (this.idGroupMap == null) {
            let groups = GroupService_.listGroups(this.getId());
            this.configureGroups_(groups);
        }
        if (this.idAccountMap == null) {
            let accounts = AccountService_.listAccounts(this.getId());
            this.configureAccounts_(accounts);
        }
    }

    /**
     * @return The permission for the current user
     */
    public getPermission(): Permission {
        this.checkBookLoaded_();
        return this.wrapped.permission as Permission;
    }

    /** 
     * @return The collection of this book
     */
    public getCollection(): Collection {
        this.checkBookLoaded_();
        if (this.wrapped.collection != null && this.collection == null) {
            this.collection = new Collection(this.wrapped.collection);
        }
        return this.collection;
    }


    /**
     * @return The date pattern of the Book. Current: dd/MM/yyyy | MM/dd/yyyy | yyyy/MM/dd
     */
    public getDatePattern(): string {
        this.checkBookLoaded_();
        return this.wrapped.datePattern;
    }

    /**
     * 
     * Sets the date pattern of the Book. Current: dd/MM/yyyy | MM/dd/yyyy | yyyy/MM/dd
     * 
     * @returns This Book, for chainning.
     */
    public setDatePattern(datePattern: string): Book {
        this.wrapped.datePattern = datePattern;
        return this;
    }

    /**
     * 
     * Adds a collaborator to the Book.
     * 
     * @param email The collaborator email
     * @param permission The collaborator [[Permission]]
     * 
     */
    public addCollaborator(email: string, permission: Permission): void {
        let collaborator: bkper.Collaborator = { email: email, permission: permission };
        return BookService_.addCollaborator(this, collaborator);
    }

    /**
     * 
     * Removes a collaborator from the Book.
     * 
     * @param email The collaborator email
     * 
     */
    public removeCollaborator(email: string): void {
        return BookService_.removeCollaborator(this, email);
    }

    /**
     * @return The decimal separator of the Book
     */
    public getDecimalSeparator(): DecimalSeparator {
        this.checkBookLoaded_();
        return this.wrapped.decimalSeparator as DecimalSeparator;
    }

    /**
     * 
     * Sets the decimal separator of the Book
     * 
     * @returns This Book, for chainning.
     */
    public setDecimalSeparator(decimalSeparator: DecimalSeparator): Book {
        this.wrapped.decimalSeparator = decimalSeparator;
        return this;
    }


    /**
     * @return The time zone of the Book
     */
    public getTimeZone(): string {
        this.checkBookLoaded_();
        return this.wrapped.timeZone;
    }

    /**
     * 
     * Sets the time zone of the Book
     * 
     * @returns This Book, for chainning.
     */
    public setTimeZone(timeZone: string): Book {
        this.wrapped.timeZone = timeZone;
        return this;
    }

    /**
     * @return The time zone offset of the book, in minutes
     */
    public getTimeZoneOffset(): number {
        this.checkBookLoaded_();
        return this.wrapped.timeZoneOffset;
    }

    /**
     * @return The lock date of the Book in ISO format yyyy-MM-dd
     */
    public getLockDate(): string {
        this.checkBookLoaded_();
        return this.wrapped.lockDate;
    }

    /**
     * 
     * Sets the lock date of the Book in ISO format yyyy-MM-dd.
     * 
     * @returns This Book, for chainning.
     */
    public setLockDate(lockDate: string | null): Book {
        if (lockDate == null) {
            lockDate = "1900-00-00";
        }
        this.wrapped.lockDate = lockDate;
        return this;
    }

    /**
     * @return The closing date of the Book in ISO format yyyy-MM-dd
     */
    public getClosingDate(): string {
        this.checkBookLoaded_();
        return this.wrapped.closingDate;
    }

    /**
     * 
     * Sets the closing date of the Book in ISO format yyyy-MM-dd.
     * 
     * @returns This Book, for chainning.
     */
    public setClosingDate(closingDate: string | null): Book {
        if (closingDate == null) {
            closingDate = "1900-00-00";
        }
        this.wrapped.closingDate = closingDate;
        return this;
    }



    /**
     * @returns The start month when YEAR period set
     */
    public getPeriodStartMonth(): Month {
        this.checkBookLoaded_();
        return this.wrapped.periodStartMonth as Month;
    }

    /**
     * Sets the start month when YEAR period set
     * 
     * @returns This Book, for chainning.
     */
    public setPeriodStartMonth(month: Month): Book {
        this.wrapped.periodStartMonth = month;
        return this;
    }


    /**
     * @return The total number of posted transactions 
     */
    public getTotalTransactions(): number {
        this.checkBookLoaded_();
        return +this.wrapped.totalTransactions;
    }

    /**
     * @return The total number of posted transactions on current month
     */
    public getTotalTransactionsCurrentMonth(): number {
        this.checkBookLoaded_();
        return +this.wrapped.totalTransactionsCurrentMonth;
    }

    /**
     * @return The total number of posted transactions on current year
     */
    public getTotalTransactionsCurrentYear(): number {
        this.checkBookLoaded_();
        return +this.wrapped.totalTransactionsCurrentYear;
    }

    /**
     * @return The last update date of the book, in in milliseconds
     */
    public getLastUpdateMs(): number {
        this.checkBookLoaded_();
        return +this.wrapped.lastUpdateMs;
    }


    /**
     * @return The custom properties stored in this Book
     */
    public getProperties(): { [key: string]: string } {
        this.checkBookLoaded_();
        return this.wrapped.properties != null ? { ...this.wrapped.properties } : {};
    }

    /**
     * @param keys The property key
     * 
     * @return The property value for given keys. First property found will be retrieved
     */
    public getProperty(...keys: string[]): string {
        this.checkBookLoaded_();

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
     * Sets the custom properties of the Book
     * 
     * @param properties Object with key/value pair properties
     * 
     * @returns This Book, for chainning. 
     */
    public setProperties(properties: { [key: string]: string }): Book {
        this.wrapped.properties = { ...properties };
        return this;
    }

    /**
     * Sets a custom property in the Book.
     * 
     * @param key The property key
     * @param value The property value
     * 
     * @returns This Book, for chainning. 
     */
    public setProperty(key: string, value: string): Book {
        if (key == null || key.trim() == '') {
            return this;
        }
        this.checkBookLoaded_();
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
     * @returns This Book, for chainning. 
     */
    public deleteProperty(key: string): Book {
        this.setProperty(key, null);
        return this;
    }


    /**
     * Formats a date according to date pattern of the Book.
     * 
     * @param  date The date to format as string.
     * @param  timeZone The output timezone of the result. Default to script's timeZone
     * 
     * @return The date formated
     */
    public formatDate(date: Date, timeZone?: string): string {
        if (timeZone == null || timeZone.trim() == "") {
            timeZone = this.getTimeZone();
        }
        return Utils_.formatDate(date, this.getDatePattern(), timeZone);
    }

    /**
     * Parse a date string according to date pattern and timezone of the Book. 
     * 
     * Also parse ISO yyyy-mm-dd format.
     * 
     * @return The date parsed
     */
    public parseDate(date: string): Date {
        return Utils_.parseDate(date, this.getDatePattern(), this.getTimeZoneOffset());
    }


    /**
     * Formats an amount according to [[DecimalSeparator]] and fraction digits of the Book.
     * 
     * @param amount The amount to be formatted.
     * 
     * @return The value formated
     */
    public formatAmount(amount: Amount): string {
        return Utils_.formatValue_(amount, this.getDecimalSeparator(), this.getFractionDigits());
    }

    /**
     * Parse an amount string according to [[DecimalSeparator]] and fraction digits of the Book.
     * 
     * @return The Amount parsed
     */
    public parseAmount(value: string): Amount {
        return Utils_.parseValue(value, this.getDecimalSeparator());
    }


    /**
     * Rounds an amount according to the number of fraction digits of the Book
     * 
     * @param amount The amount to be rounded
     * 
     * @returns The Amount rounded
     */
    public round(amount: Amount): Amount {
        return Utils_.round(amount, this.getFractionDigits());
    }

    /**
     * Batch create [[Transactions]] on the Book.
     * 
     * @param transactions The transactions to be created
     * 
     * @returns The Transactions created
     */
    public batchCreateTransactions(transactions: Transaction[]): Transaction[] {
        let transactionPayloads: bkper.Transaction[] = [];
        transactions.forEach(tx => transactionPayloads.push(tx.wrapped));
        transactionPayloads = TransactionService_.createTransactionsBatch(this.getId(), transactionPayloads);
        transactions = Utils_.wrapObjects(new Transaction(), transactionPayloads);
        this.configureTransactions_(transactions);
        this.clearCache();
        return transactions;
    }

    /**
     * Batch update [[Transactions]] on the Book.
     * 
     * @param transactions The transactions to be updated
     * 
     */
    public batchUpdateTransactions(transactions: Transaction[]): void {
        let transactionsPayload: bkper.Transaction[] = [];
        transactions.forEach(tx => transactionsPayload.push(tx.wrapped));
        TransactionService_.updateTransactionsBatch(this.getId(), transactionsPayload);
        this.clearCache();
    }

    /**
     * Batch check [[Transactions]] on the Book.
     * 
     * @param transactions The transactions to be checked
     * 
     */
    public batchCheckTransactions(transactions: Transaction[]): void {
        let transactionPayloads: bkper.Transaction[] = [];
        transactions.forEach(tx => transactionPayloads.push(tx.wrapped))
        TransactionService_.checkTransactionsBatch(this.getId(), transactionPayloads);
    }

    /**
     * Batch uncheck [[Transactions]] on the Book.
     * 
     * @param transactions The transactions to be unchecked
     * 
     */
    public batchUncheckTransactions(transactions: Transaction[]): void {
        let transactionPayloads: bkper.Transaction[] = [];
        transactions.forEach(tx => transactionPayloads.push(tx.wrapped))
        TransactionService_.uncheckTransactionsBatch(this.getId(), transactionPayloads);
    }

    /**
     * Batch trash [[Transactions]] on the Book. 
     * 
     * @param transactions The transactions to be trashed
     * 
     */
    public batchTrashTransactions(transactions: Transaction[]): void {
        let transactionPayloads: bkper.Transaction[] = [];
        transactions.forEach(tx => transactionPayloads.push(tx.wrapped))
        TransactionService_.trashTransactionsBatch(this.getId(), transactionPayloads);
    }


    /**
     * Trigger [Balances Audit](https://help.bkper.com/en/articles/4412038-balances-audit) async process.
     */
    public audit(): void {
        BookService_.audit(this);
    }


    /**
     * Resumes a transaction iteration using a continuation token from a previous iterator.
     * 
     * @param continuationToken continuation token from a previous transaction iterator
     * 
     * @return a collection of transactions that remained in a previous iterator when the continuation token was generated
     */
    public continueTransactionIterator(query: string, continuationToken: string): TransactionIterator {
        var transactionIterator = new TransactionIterator(this, query);
        transactionIterator.setContinuationToken(continuationToken);
        return transactionIterator;
    }

    configureTransactions_(transactions: Transaction[]) {
        for (var i = 0; i < transactions.length; i++) {
            this.configureTransaction_(transactions[i]);
        }
        return transactions;
    }

    private configureTransaction_(transaction: Transaction) {
        transaction.book = this;
        return transaction;
    }

    configureEvents_(events: Event[]) {
        for (var i = 0; i < events.length; i++) {
            this.configureEvent_(events[i]);
        }
        return events;
    }

    private configureEvent_(event: Event) {
        event.book = this;
        return event;
    }

    /**
     * Instantiate a new [[Transaction]]
     * 
     * @return The new Transaction, for chainning.
     * 
     * Example:
     * 
     * ```js
     * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
     * 
     * book.newTransaction()
     *  .setDate('2013-01-25')
     *  .setDescription("Filling tank of my truck")
     *  .from('Credit Card')
     *  .to('Gas')
     *  .setAmount(126.50)
     *  .create();
     * 
     * ```
     * 
     */
    public newTransaction(): Transaction {
        let transaction = Utils_.wrapObject(new Transaction(), {});
        this.configureTransaction_(transaction);
        return transaction;
    }

    /**
     * Instantiate a new [[Account]]
     * 
     * @return The new Account, for chainning.
     * 
     * Example:
     * ```js
     * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
     * 
     * book.newAccount()
     *  .setName('Some New Account')
     *  .setType('INCOMING')
     *  .addGroup('Revenue').addGroup('Salary')
     *  .setProperties({prop_a: 'A', prop_b: 'B'})
     *  .create();
     * ```
     */
    public newAccount(): Account {
        let account = Utils_.wrapObject(new Account(), {});
        account.setArchived(false);
        account.book = this;
        return account;
    }

    /**
     * Instantiate a new [[Group]]
     * 
     * @return The new Group, for chainning.
     * 
     * Example:
     * ```js
     * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
     * 
     * book.newGroup()
     *  .setName('Some New Group')
     *  .setProperty('key', 'value')
     *  .create();
     * ```
     */
    public newGroup(): Group {
        let group = Utils_.wrapObject(new Group(), {});
        group.book = this;
        return group;
    }

    /**
     * @return All [[Accounts]] of this Book
     */
    public getAccounts(): Account[] {

        this.checkAccountsLoaded_();
        return this.accounts;
    }


    /**
     * Gets an [[Account]] object
     * 
     * @param idOrName The id or name of the Account
     * 
     * @returns The matching Account object
     */
    public getAccount(idOrName: string): Account {

        if (idOrName == null) {
            return null;
        }

        idOrName = idOrName + '';

        this.checkAccountsLoaded_();

        var account = this.idAccountMap[idOrName];
        if (account == null) {
            account = this.nameAccountMap[idOrName];
            if (account == null) {
                account = this.nameAccountMap[normalizeName(idOrName)];
            }
        }

        return account;
    }


    /**
     * Create [[Accounts]] on the Book, in batch.
     * 
     * @return The Accounts created
     */
    public batchCreateAccounts(accounts: Account[]): Account[] {
        let accountsPayloads: bkper.Account[] = []
        for (const account of accounts) {
            accountsPayloads.push(account.wrapped);
        }
        if (accountsPayloads.length > 0) {
            let createdAccountsPlain = AccountService_.createAccounts(this.getId(), accountsPayloads);
            let createdAccounts = Utils_.wrapObjects(new Account(), createdAccountsPlain);
            this.clearCache();
            for (var i = 0; i < createdAccounts.length; i++) {
                var account = createdAccounts[i];
                account.book = this;
            }
            return createdAccounts;
        }
        return [];
    }



    private configureAccounts_(accounts: bkper.Account[]): void {
        this.accounts = Utils_.wrapObjects(new Account(), accounts);
        this.idAccountMap = {};
        this.nameAccountMap = {};
        for (var i = 0; i < this.accounts.length; i++) {
            var account = this.accounts[i];
            account.book = this;
            this.idAccountMap[account.getId()] = account;
            this.nameAccountMap[account.getNormalizedName()] = account;
            if (account.wrapped.groups) {
                for (const accountGroup of account.wrapped.groups) {
                    let group: Group = this.idGroupMap[accountGroup.id];
                    if (group) {
                        group.addAccount(account)
                    }
                }
            }
        }
    }


    /**
     * @return All [[Groups]] of this Book
     */
    public getGroups(): Group[] {
        this.checkAccountsLoaded_();
        return this.groups;
    }

    /**
     * Create [[Groups]] on the Book, in batch.
     * 
     * @return The Groups created
     */
    public batchCreateGroups(groups: Group[]): Group[] {
        if (groups.length > 0) {
            let groupsSave: bkper.Group[] = groups.map(g => { return g.wrapped });
            let groupsPlain = GroupService_.createGroups(this.getId(), groupsSave);
            let createdGroups = Utils_.wrapObjects(new Group(), groupsPlain);

            this.clearCache();

            for (var i = 0; i < createdGroups.length; i++) {
                var group = createdGroups[i];
                group.book = this;
            }

            return createdGroups;
        }
        return [];
    }

    updateAccountsCache(accounts: bkper.Account[]) {
        if (!accounts) {
            return;
        }
        for (const accountJson of accounts) {
            if (this.idAccountMap != null) {
                let cachedAccount = this.idAccountMap[accountJson.id];
                if (cachedAccount) {
                    cachedAccount.wrapped = accountJson;
                }
            }
            if (this.nameAccountMap != null) {
                let cachedAccount = this.nameAccountMap[accountJson.normalizedName];
                if (cachedAccount) {
                    cachedAccount.wrapped = accountJson;
                }
            }
        }
    }

    clearCache() {
        this.wrapped = null;
    }

    /**
     * Gets a [[Group]] object
     * 
     * @param idOrName The id or name of the Group
     * 
     * @returns The matching Group object
     */
    public getGroup(idOrName: string): Group {

        if (idOrName == null) {
            return null;
        }

        idOrName = idOrName + '';

        this.checkAccountsLoaded_();

        var group = this.idGroupMap[idOrName];
        if (group == null) {
            group = this.nameGroupMap[idOrName];
            if (group == null) {
                group = this.nameGroupMap[normalizeName(idOrName)];
            }
        }

        return group;
    }

    private configureGroups_(groups: bkper.Group[]): void {
        this.groups = Utils_.wrapObjects(new Group(), groups);
        this.idGroupMap = {};
        this.nameGroupMap = {};
        for (var i = 0; i < this.groups.length; i++) {
            var group = this.groups[i];
            group.book = this;
            this.idGroupMap[group.getId()] = group;
            this.nameGroupMap[normalizeName(group.getName())] = group;
        }
        for (var i = 0; i < this.groups.length; i++) {
            var group = this.groups[i];
            group.buildGroupTree_(this.idGroupMap)
        }

    }


    /**
     * @return All saved queries from this book
     */
    public getSavedQueries(): { id?: string, query?: string, title?: string }[] {
        if (this.savedQueries == null) {
            this.savedQueries = SavedQueryService_.getSavedQueries(this.getId());
        }
        return this.savedQueries;
    }

    /**
     *
     * Create a [[BalancesReport]] based on query
     * 
     * @param query The balances report query
     * 
     * @return The balances report
     * 
     * Example:
     * 
     * ```js
     * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgPXjx7oKDA");
     * 
     * var balancesReport = book.getBalancesReport("group:'Equity' after:7/2018 before:8/2018");
     * 
     * var accountBalance = balancesReport.getBalancesContainer("Bank Account").getCumulativeBalance();
     * ```
     */
    public getBalancesReport(query: string): BalancesReport {
        var balances = BalancesService_.getBalances(this.getId(), query);
        return new BalancesReport(this, balances);
    }

    /**
     * Create a [[BalancesDataTableBuilder]] based on a query, to create two dimensional Array representation of balances of [[Account]] or [[Group]]
     * 
     * See [Query Guide](https://help.bkper.com/en/articles/2569178-search-query-guide) to learn more
     * 
     * @param query The balances report query
     * 
     * @return The balances data table builder
     * 
     * Example:
     * 
     * ```js
     * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgPXjx7oKDA");
     * 
     * var balancesDataTable = book.createBalancesDataTable("account:'Credit card' after:7/2018 before:8/2018").build();
     * ```
     */
    public createBalancesDataTable(query: string): BalancesDataTableBuilder {
        var balances = BalancesService_.getBalances(this.getId(), query);
        return new BalancesReport(this, balances).createDataTable();
    }

    /**
     * Create a [[AccountsDataTableBuilder]], to build two dimensional Array representations of [[Accounts]] dataset.
     * 
     * @return Accounts data table builder.
     * 
     * Example:
     * 
     * ```js
     * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgPXjx7oKDA");
     * 
     * var accountsDataTable = book.createAccountsDataTable().build();
     * ```
     */
    public createAccountsDataTable(): AccountsDataTableBuilder {
        let accounts = this.getAccounts();
        return new AccountsDataTableBuilder(accounts);
    }

    /**
     * Create a [[GroupsDataTableBuilder]], to build two dimensional Array representations of [[Groups]] dataset.
     * 
     * @return Groups data table builder.
     * 
     * Example:
     * 
     * ```js
     * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgPXjx7oKDA");
     * 
     * var groupsDataTable = book.createGroupsDataTable().build();
     * ```
     */
    public createGroupsDataTable(): GroupsDataTableBuilder {
        let groups = this.getGroups();
        return new GroupsDataTableBuilder(groups);
    }

    /**
     * Create a [[TransactionsDataTableBuilder]] based on a query, to build two dimensional Array representations of [[Transactions]] dataset.
     * 
     * See [Query Guide](https://help.bkper.com/en/articles/2569178-search-query-guide) to learn more
     * 
     * @param query The flter query.
     * 
     * @return Transactions data table builder.
     * 
     * Example: 
     * 
     * ```js
     * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgPXjx7oKDA");
     * 
     * var transactionsDataTable = book.createTransactionsDataTable("account:'Bank Account' before:1/2019").build();
     * ```
     */
    public createTransactionsDataTable(query?: string): TransactionsDataTableBuilder {
        var transactionIterator = this.getTransactions(query);
        return new TransactionsDataTableBuilder(transactionIterator);
    }

    /**
     * Get Book transactions based on a query.
     * 
     * See [Query Guide](https://help.bkper.com/en/articles/2569178-search-query-guide) to learn more
     *  
     * @param query The query string.
     * 
     * @return The Transactions result as an iterator.
     * 
     * Example:
     * 
     * ```js
     * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
     *
     * var transactions = book.getTransactions("account:CreditCard after:28/01/2013 before:29/01/2013");
     *
     * while (transactions.hasNext()) {
     *  var transaction = transactions.next();
     *  Logger.log(transaction.getDescription());
     * }
     * ```
     */
    public getTransactions(query?: string): TransactionIterator {
        return new TransactionIterator(this, query);
    }

    /**
    * Retrieve the number of transactions based on a query.
    * 
    * @param query The query string.
    * 
    * @return The number of matching Transactions
    */
    public countTransactions(query?: string): number {
        return TransactionService_.countTransactions(this.getId(), query).total;
    }

    /**
     * Retrieve a [[Transaction]] by id
     * 
     * @return The matching Transaction object
     */
    public getTransaction(id: string): Transaction {
        let wrapped = TransactionService_.getTransaction(this.getId(), id);
        let transaction = Utils_.wrapObject(new Transaction(), wrapped);
        this.configureTransaction_(transaction);
        return transaction;
    }

    /**
     * Instantiate a new [[File]]
     * 
     * @return The new File, for chainning.
     * 
     * Example:
     * ```js
     * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
     * 
     * book.newFile()
     *  .setBlob(UrlFetchApp.fetch('https://bkper.com/images/index/integrations4.png').getBlob())
     *  .create();
     * ```
     */
    public newFile(): File {
        let file = Utils_.wrapObject(new File(), {});
        file.book = this;
        return file;
    }

    /**
     * Retrieve installed [[Apps]] for this Book
     * 
     * @returns The Apps objects
     */
    public getApps(): App[] {
        if (this.apps !== undefined) {
            return this.apps;
        }
        let appList = AppService_.getApps(this.getId());
        let apps: App[] = [];
        for (const app of appList.items) {
            apps.push(new App(app));
        }
        this.apps = apps;
        return this.apps;
    }

    /**
     * Retrieve the pending events [[Backlog]] for this Book
     * 
     * @returns The Backlog object
     */
    public getBacklog(): Backlog {
        let backlog = BacklogService_.getBacklog(this.getId());
        return new Backlog(backlog);
    }

    /**
     * Get Book events based on search parameters.
     * 
     * @param afterDate The start date (inclusive) for the events search range
     * @param beforeDate The end date (exclusive) for the events search range
     * @param onError True to search only for events on error
     * @param resource The event's resource ([[Transaction]], [[Account]] or [[Group]])
     * 
     * @return The Events result as an iterator.
     */
    public getEvents(afterDate?: string, beforeDate?: string, onError?: boolean, resource?: Transaction | Account | Group): EventIterator {
        let formattedAfterDate = '';
        if (afterDate) {
            formattedAfterDate = Utils_.toRFC3339Date(this.parseDate(afterDate));
        } else if (onError) {
            const mostRecentLockDate = this.getMostRecentLockDate();
            if (mostRecentLockDate) {
                formattedAfterDate = Utils_.toRFC3339Date(this.parseDate(mostRecentLockDate));
            }
        }
        let formattedBeforeDate = '';
        if (beforeDate) {
            formattedBeforeDate = Utils_.toRFC3339Date(this.parseDate(beforeDate));
        }
        const resourceId = resource !== undefined ? resource.getId() : null;
        return new EventIterator(this, formattedAfterDate, formattedBeforeDate, onError, resourceId);
    }

    private getMostRecentLockDate(): string | null {
        const closingDate = this.getClosingDate();
        const lockDate = this.getLockDate();
        if (!closingDate && !lockDate) {
            return null;
        }
        if (!closingDate && lockDate) {
            return lockDate;
        }
        if (closingDate && !lockDate) {
            return closingDate;
        }
        if (Utils_.getIsoDateValue(closingDate) > Utils_.getIsoDateValue(lockDate)) {
            return closingDate;
        } else {
            return lockDate;
        }
    }

    /** 
     * Retrieve a [[File]] by id
     * 
     * @return The matching File object
     */
    public getFile(id: string): File {
        let wrapped = FileService_.getFile(this.getId(), id);
        let file = Utils_.wrapObject(new File(), wrapped);
        return file;
    }

    /**
     * Perform update Book, applying pending changes.
     * 
     * @returns This Book, for chainning.
     */
    public update(): Book {
        this.wrapped = BookService_.updateBook(this.getId(), this.wrapped);
        return this;
    }


    //DEPRECATED
    /**
     * Formats a value according to [[DecimalSeparator]] and fraction digits of the Book.
     * 
     * @param value The value to be formatted.
     * 
     * @return The value formated
     * 
     * @deprecated
     */
    public formatValue(value: Amount): string {
        return this.formatAmount(value);
    }

    /**
     * Parse a value string according to [[DecimalSeparator]] and fraction digits of the Book.
     * 
     * @deprecated
     */
    public parseValue(value: string): Amount {
        return this.parseAmount(value);
    }

    /**
     * Create an [[Account]] in this book. 
     * 
     * The type of account will be determined by the type of others Accounts in same group. 
     * 
     * If not specified, the type ASSET (permanent=true/credit=false) will be set.
     * 
     * If all other accounts in same group is in another group, the account will also be added to the other group.
     * 
     * @returns The created Account object
     * 
     * @deprecated
     */
    public createAccount(name: string, group?: string, description?: string): Account {
        var account = AccountService_.createAccountV2(this.getId(), name, group, description);
        this.clearCache();
        return this.getAccount(name);
    }

    /**
     * @deprecated
     */
    getBalanceReport(query: string): BalancesReport {
        return this.getBalancesReport(query);
    }

    /**
     * @deprecated
     */
    search(query?: string): TransactionIterator {
        return this.getTransactions(query);
    }

    /**
   * Record [[Transactions]] on the Book. 
   * 
   * The text is usually amount and description, but it can also can contain an informed Date in full format (dd/mm/yyyy - mm/dd/yyyy).
   * 
   * Example: 
   * 
   * ```js
   * book.record("#gas 63.23");
   * ```
   * 
   * @param transactions The text/array/matrix containing transaction records, one per line/row. Each line/row records one transaction.
   * @param timeZone The time zone to format dates.
   * @deprecated
   */
    public record(transactions: string | any[] | any[][], timeZone?: string): void {
        if (timeZone == null || timeZone.trim() == "") {
            timeZone = this.getTimeZone();
        }
        TransactionService_.record(this, transactions, timeZone);
        this.clearCache();
    }

    /**
     * Create [[Accounts]] on the Book, in batch.
     * 
     * The first column of the matrix will be used as the [[Account]] name.
     * 
     * The other columns will be used to find a matching [[AccountType]].
     * 
     * Names matching existent accounts will be skipped.
     * 
     * @deprecated
     * 
     */
    public createAccounts(accounts: string[][]): Account[] {

        let accountsPayloads: bkper.Account[] = []

        for (let i = 0; i < accounts.length; i++) {
            const row = accounts[i]
            const account: bkper.Account = {
                name: row[0],
                type: AccountType.ASSET,
                groups: []
            }

            if (this.getAccount(account.name)) {
                //Account already created. Skip.
                continue;
            }

            if (row.length > 1) {
                for (let j = 1; j < row.length; j++) {
                    const cell = row[j];
                    if (this.isType(cell)) {
                        account.type = cell as AccountType;
                    } else {
                        let group = this.getGroup(cell);
                        if (group != null) {
                            account.groups.push(group.wrapped);
                        }
                    }
                }
            }

            accountsPayloads.push(account)
        }

        if (accountsPayloads.length > 0) {
            let createdAccountsPlain = AccountService_.createAccounts(this.getId(), accountsPayloads);
            let createdAccounts = Utils_.wrapObjects(new Account(), createdAccountsPlain);
            this.clearCache();
            for (var i = 0; i < createdAccounts.length; i++) {
                var account = createdAccounts[i];
                account.book = this;
            }
            return createdAccounts;
        }

        return [];
    }

    /**
     * @deprecated
     */
    private isType(groupOrType: string): boolean {
        if (groupOrType == AccountType.ASSET) {
            return true;
        }
        if (groupOrType == AccountType.LIABILITY) {
            return true;
        }
        if (groupOrType == AccountType.INCOMING) {
            return true;
        }
        if (groupOrType == AccountType.OUTGOING) {
            return true;
        }
        return false;
    }

    /**
     * Create [[Groups]] on the Book, in batch.
     * @deprecated
     */
    public createGroups(groups: string[]): Group[] {
        if (groups.length > 0) {
            let groupsSave: bkper.Group[] = groups.map(groupName => { return { name: groupName } });
            let groupsPlain = GroupService_.createGroups(this.getId(), groupsSave);
            let createdGroups = Utils_.wrapObjects(new Group(), groupsPlain);

            this.clearCache();

            for (var i = 0; i < createdGroups.length; i++) {
                var group = createdGroups[i];
                group.book = this;
            }

            return createdGroups;
        }
        return [];
    }

}