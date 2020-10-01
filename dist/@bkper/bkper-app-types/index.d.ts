// Type definitions for BkperApp
// Generated using clasp-types

/// <reference types="google-apps-script" />

declare namespace Bkper {

    /**
     * The main entry point to interact with BkperApp
     *
     * Script ID: **1hMJszJGSUVZDB3vmsWrUZfRhY1UWbhS0SQ6Lzl06gm1zhBF3ioTM7mpJ**
     */
    export interface BkperApp {

        Permission: typeof Permission;

        Periodicity: typeof Periodicity;

        DecimalSeparator: typeof DecimalSeparator;

        BalanceType: typeof BalanceType;

        BalanceCheckedType: typeof BalanceCheckedType;

        AccountType: typeof AccountType;

        /**
         * Gets the [[Book]] with the specified bookId from url param.
         *
         * This is the main Entry Point to start interacting with BkperApp
         * 
         * Example:
         * 
         * ```js
         * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
         * book.record("#fuel for my Land Rover 126.50 28/01/2013");
         * ```
         */
        getBook(id: string): Book;

        /**
         * Gets all [[Books]] the user has access.
         */
        getBooks(): Book[];

        /**
         * Sets the API key to identify the agent.
         *
         * API keys are intended for agent identification only, not for authentication. [Learn more](https://cloud.google.com/endpoints/docs/frameworks/java/when-why-api-key)
         * 
         * See how to create your api key [here](https://cloud.google.com/docs/authentication/api-keys).
         */
        setApiKey(key: string): void;

        /**
         * Sets the [[OAuthTokenProvider]].
         *
         * If none set, the default built-in [ScriptApp](https://developers.google.com/apps-script/reference/script/script-app#getoauthtoken) will be used.
         */
        setOAuthTokenProvider(tokenProvider: OAuthTokenProvider): void;

    }

    /**
     * This class defines an [Account](https://en.wikipedia.org/wiki/Account_(bookkeeping)) of a [[Book]].
     *
     * It mantains a balance of all amount [credited and debited](http://en.wikipedia.org/wiki/Debits_and_credits) in it by [[Transactions]].
     * 
     * An Account can be grouped by [[Groups]].
     */
    export interface Account {

        /**
         * Add a group to the Account.
         *
         * @returns This Account, for chainning.
         */
        addGroup(group: string | Group): Account;

        /**
         * Perform create new account.
         */
        create(): Account;

        /**
         * Delete a custom property
         *
         * @returns This Account, for chainning.
         */
        deleteProperty(key: string): Account;

        /**
         * Gets the balance based on credit nature of this Account.
         *
         * @returns The balance of this account.
         */
        getBalance(raw?: boolean): number;

        /**
         * Gets the checked balance based on credit nature of this Account.
         *
         * @returns The checked balance of this Account
         */
        getCheckedBalance(raw?: boolean): number;

        /**
         * Gets the account description
         *
         * @deprecated Use properties instead
         * 
         */
        getDescription(): string;

        /**
         * Get the [[Groups]] of this account.
         */
        getGroups(): Group[];

        /**
         * Gets the account internal id.
         */
        getId(): string;

        /**
         * Gets the account name.
         */
        getName(): string;

        /**
         * @returns The name of this account without spaces or special characters.
         */
        getNormalizedName(): string;

        /**
         * Gets the custom properties stored in this Account.
         */
        getProperties(): any;

        /**
         * Gets the property value for given keys. First property found will be retrieved
         */
        getProperty(...keys: string[]): string;

        /**
         * @returns The type for of this account.
         */
        getType(): AccountType;

        /**
         * Tell if the Account has any transaction already posted.
         *
         * Accounts with transaction posted, even with zero balance, can only be archived.
         */
        hasTransactionPosted(): boolean;

        /**
         * Tell if this account is Active or otherwise Archived.
         *
         * @deprecated Use isArchived instead
         */
        isActive(): boolean;

        /**
         * Tell if this account is archived.
         */
        isArchived(): boolean;

        /**
         * Tell if the account has a Credit nature or Debit otherwise
         *
         * Credit accounts are just for representation purposes. It increase or decrease the absolute balance. It doesn't affect the overall balance or the behavior of the system.
         * 
         * The absolute balance of credit accounts increase when it participate as a credit/origin in a transaction. Its usually for Accounts that increase the balance of the assets, like revenue accounts.
         * 
         * ```
         *         Crediting a credit
         *   Thus ---------------------> account increases its absolute balance
         *         Debiting a debit
         * 
         * 
         *         Debiting a credit
         *   Thus ---------------------> account decreases its absolute balance
         *         Crediting a debit
         * ```
         * 
         * As a rule of thumb, and for simple understanding, almost all accounts are Debit nature (NOT credit), except the ones that "offers" amount for the books, like revenue accounts.
         */
        isCredit(): boolean;

        /**
         * Tell if this account is in the [[Group]]
         */
        isInGroup(group: string | Group): boolean;

        /**
         * Tell if the account is permanent.
         *
         * Permanent Accounts are the ones which final balance is relevant and keep its balances over time.
         * 
         * They are also called [Real Accounts](http://en.wikipedia.org/wiki/Account_(accountancy)#Based_on_periodicity_of_flow)
         * 
         * Usually represents assets or tangibles, capable of being perceived by the senses or the mind, like bank accounts, money, debts and so on.
         *
         * @returns True if its a permanent Account
         */
        isPermanent(): boolean;

        /**
         * Perform delete account.
         */
        remove(): Account;

        /**
         * Remove a group from the Account.
         */
        removeGroup(group: string | Group): Account;

        /**
         * Set account archived/unarchived.
         *
         * @returns This Account, for chainning.
         */
        setArchived(archived: boolean): Account;

        /**
         * Sets the groups of the Account.
         *
         * @returns This Account, for chainning.
         */
        setGroups(groups: string[] | Group[]): Account;

        /**
         * Sets the name of the Account.
         *
         * @returns This Account, for chainning.
         */
        setName(name: string): Account;

        /**
         * Sets the custom properties of the Account
         *
         * @returns This Account, for chainning.
         */
        setProperties(properties: {[name: string]: string}): Account;

        /**
         * Sets a custom property in the Account.
         *
         * @returns This Account, for chainning.
         */
        setProperty(key: string, value: string): Account;

        /**
         * Sets the type of the Account.
         *
         * @returns This Account, for chainning
         */
        setType(type: AccountType): Account;

        /**
         * Perform update account, applying pending changes.
         */
        update(): Account;

    }

    /**
     * A AccountsDataTableBuilder is used to setup and build two-dimensional arrays containing transactions.
     */
    export interface AccountsDataTableBuilder {

        /**
         * @returns A two-dimensional array containing all [[Accounts]].
         */
        build(): any[][];

        /**
         * Defines whether the archived accounts should included.
         *
         * @returns This builder, for chaining.
         */
        includeArchived(include: boolean): AccountsDataTableBuilder;

    }

    /**
     * Class that represents an [[Account]], [[Group]] or #hashtag balance on a window of time (Day / Month / Year).
     */
    export interface Balance {

        /**
         * The cumulative checked balance to the date, since the first transaction posted.
         */
        getCheckedCumulativeBalance(): number;

        /**
         * The checked balance on the date period.
         */
        getCheckedPeriodBalance(): number;

        /**
         * The cumulative balance to the date, since the first transaction posted.
         */
        getCumulativeBalance(): number;

        /**
         * Date object constructed based on [[Book]] time zone offset. Usefull for
         *
         * If Month or Day is zero, the date will be constructed with first Month (January) or Day (1).
         */
        getDate(): Date;

        /**
         * The day of the balance. Days starts on 1 to 31.
         *
         * Day can be 0 (zero) in case of Monthly or Early [[Periodicity]] of the [[BalancesReport]]
         */
        getDay(): number;

        /**
         * The Fuzzy Date of the balance, based on [[Periodicity]] of the [[BalancesReport]] query, composed by Year, Month and Day.
         *
         * The format is **YYYYMMDD**. Very usefull for ordering and indexing
         * 
         * Month and Day can be 0 (zero), depending on the granularity of the [[Periodicity]].
         * 
         * *Example:*
         * 
         * **20180125** - 25, January, 2018 - DAILY Periodicity
         * 
         * **20180100** - January, 2018 - MONTHLY Periodicity
         * 
         * **20180000** - 2018 - YEARLY Periodicity
         */
        getFuzzyDate(): number;

        /**
         * The month of the balance. Months starts on 1 (January) to 12 (December)
         *
         * Month can be 0 (zero) in case of Early [[Periodicity]] of the [[BalancesReport]]
         */
        getMonth(): number;

        /**
         * The balance on the date period.
         */
        getPeriodBalance(): number;

        /**
         * The unchecked cumulative balance to the date, since the first transaction posted.
         */
        getUncheckedCumulativeBalance(): number;

        /**
         * The unchecked balance on the date period.
         */
        getUncheckedPeriodBalance(): number;

        /**
         * The year of the balance
         */
        getYear(): number;

    }

    /**
     * A BalancesDataTableBuilder is used to setup and build two-dimensional arrays containing balance information.
     */
    export interface BalancesDataTableBuilder {

        /**
         * Builds an two-dimensional array with the balances.
         */
        build(): any[][];

        /**
         * Defines wheter Groups should expand its child accounts.
         *
         * @returns This builder with respective expanded option, for chaining.
         */
        expanded(expanded: boolean): BalancesDataTableBuilder;

        /**
         * Defines whether the dates should be formatted based on date pattern and periodicity of the [[Book]].
         *
         * @returns This builder with respective formatting option, for chaining.
         */
        formatDates(format: boolean): BalancesDataTableBuilder;

        /**
         * Defines whether the value should be formatted based on decimal separator of the [[Book]].
         *
         * @returns This builder with respective formatting option, for chaining.
         */
        formatValues(format: boolean): BalancesDataTableBuilder;

        /**
         * Defines whether the dates should be hidden for **PERIOD** or **CUMULATIVE** [[BalanceType]].
         *
         * @returns This builder with respective hide dates option, for chaining.
         */
        hideDates(hide: boolean): BalancesDataTableBuilder;

        /**
         * Defines whether the [[Accounts]] and [[Groups]] names should be hidden.
         *
         * @returns This builder with respective hide names option, for chaining.
         */
        hideNames(hide: boolean): BalancesDataTableBuilder;

        /**
         * Defines wheter should rows and columns should be transposed.
         *
         * For **TOTAL** [[BalanceType]], the **transposed** table looks like:
         * 
         * ```
         *   _____________________________
         *  | Expenses | Income  |  ...  |
         *  | 4568.23  | 5678.93 |  ...  |
         *  |__________|_________|_______|
         * 
         * ```
         * Two rows, and each [[Account]] or [[Group]] per column.
         * 
         * 
         * For **PERIOD** or **CUMULATIVE** [[BalanceType]], the **transposed** table will be a time table, and the format looks like:
         * 
         * ```
         *   _______________________________________________________________
         *  |            | 15/01/2014 | 15/02/2014 | 15/03/2014 |    ...    |
         *  |  Expenses  |  2345.23   |  2345.93   |  2456.45   |    ...    |
         *  |  Income    |  3452.93   |  3456.46   |  3567.87   |    ...    |
         *  |     ...    |     ...    |     ...    |     ...    |    ...    |
         *  |____________|____________|____________|____________|___________|
         * 
         * ```
         * 
         * First column will be each [[Account]] or [[Group]], and one column for each Date.
         *
         * @returns This builder with respective transposed option, for chaining.
         */
        transposed(transposed: boolean): BalancesDataTableBuilder;

        /**
         * Fluent method to set the [[BalanceType]] for the builder.
         *
         * @returns This builder with respective balance type, for chaining.
         */
        type(type: BalanceType): BalancesDataTableBuilder;

    }

    /**
     * Class representing a Balance Report, generated when calling [Book.getBalanceReport](#book_getbalancesreport)
     */
    export interface BalancesReport {

        /**
         * Creates a BalancesDataTableBuilder to generate a two-dimensional array with all [[BalancesContainers]].
         */
        createDataTable(): BalancesDataTableBuilder;

        /**
         * The [[BalanceCheckedType]] of the query used to generate the report.
         */
        getBalanceCheckedType(): BalanceCheckedType;

        /**
         * Gets a specific [[BalancesContainers]].
         */
        getBalancesContainer(groupName: string): BalancesContainer;

        /**
         * Gets all [[BalancesContainers]] of the report.
         */
        getBalancesContainers(): BalancesContainer[];

        /**
         * The [[Book]] that generated the report.
         */
        getBook(): Book;

        /**
         * The [[Periodicity]] of the query used to generate the report.
         */
        getPeriodicity(): Periodicity;

        /**
         * Check if the report has only one Group specified on query.
         */
        hasOnlyOneGroup(): boolean;

    }

    /**
     * A Book represents [General Ledger](https://en.wikipedia.org/wiki/General_ledger) for a company or business, but can also represent a [Ledger](https://en.wikipedia.org/wiki/Ledger) for a project or department
     *
     * It contains all [[Accounts]] where [[Transactions]] are recorded/posted;
     */
    export interface Book {

        /**
         * Resumes a transaction iteration using a continuation token from a previous iterator.
         *
         * @returns a collection of transactions that remained in a previous iterator when the continuation token was generated
         */
        continueTransactionIterator(query: string, continuationToken: string): TransactionIterator;

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
        createAccount(name: string, group?: string, description?: string): Account;

        /**
         * Create [[Accounts]] on the Book, in batch.
         *
         * The first column of the matrix will be used as the [[Account]] name.
         * 
         * The other columns will be used to find a matching [[AccountType]].
         * 
         * Names matching existent accounts will be skipped.
         * 
         */
        createAccounts(accounts: string[][]): Account[];

        /**
         * Create a [[AccountsDataTableBuilder]], to build two dimensional Array representations of [[Accounts]] dataset.
         *
         * @returns Accounts data table builder.
         * 
         */
        createAccountsDataTable(): AccountsDataTableBuilder;

        /**
         * Create a [[BalancesDataTableBuilder]] based on a query, to create two dimensional Array representation of balances of [[Account]], [[Group]] or #hashtag
         *
         * See [Query Guide](https://help.bkper.com/en/articles/2569178-search-query-guide) to learn more
         *
         * @returns The balances data table builder
         * 
         * Example:
         * 
         * ```js
         * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
         * 
         * var balancesDataTable = book.createBalancesDataTable("#rental #energy after:8/2013 before:9/2013").build();
         * ```
         */
        createBalancesDataTable(query: string): BalancesDataTableBuilder;

        /**
         * Create [[Groups]] on the Book, in batch.
         */
        createGroups(groups: string[]): Group[];

        /**
         * Create a [[TransactionsDataTableBuilder]] based on a query, to build two dimensional Array representations of [[Transactions]] dataset.
         *
         * See [Query Guide](https://help.bkper.com/en/articles/2569178-search-query-guide) to learn more
         *
         * @returns Transactions data table builder.
         * 
         * Example:
         * 
         * ```js
         * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
         * 
         * var transactionsDataTable = book.createTransactionsDataTable("account:'Bank' after:8/2013 before:9/2013").build();
         * ```
         */
        createTransactionsDataTable(query?: string): TransactionsDataTableBuilder;

        /**
         * Formats a date according to date pattern of the Book.
         *
         * @returns The date formated
         */
        formatDate(date: Date, timeZone?: string): string;

        /**
         * Formats a value according to [[DecimalSeparator]] and fraction digits of the Book.
         *
         * @returns The value formated
         */
        formatValue(value: number): string;

        /**
         * Gets an [[Account]] object
         *
         * @returns The matching Account object
         */
        getAccount(idOrName: string): Account;

        /**
         * Gets all [[Accounts]] of this Book
         */
        getAccounts(): Account[];

        /**
         * Create a [[BalancesReport]] based on query
         */
        getBalancesReport(query: string): BalancesReport;

        /**
         * @returns The collection of this book
         */
        getCollection(): Collection;

        /**
         * @returns The date pattern of the Book. Example: dd/MM/yyyy
         */
        getDatePattern(): string;

        /**
         * @returns The decimal separator of the Book
         */
        getDecimalSeparator(): DecimalSeparator;

        /**
         * @returns The number of fraction digits (decimal places) supported by this Book
         */
        getFractionDigits(): number;

        /**
         * Gets a [[Group]] object
         *
         * @returns The matching Group object
         */
        getGroup(idOrName: string): Group;

        /**
         * Gets all [[Groups]] of this Book
         */
        getGroups(): Group[];

        /**
         * Same as bookId param
         */
        getId(): string;

        /**
         * @returns The last update date of the book, in in milliseconds
         */
        getLastUpdateMs(): number;

        /**
         * @returns The name of this Book
         */
        getName(): string;

        /**
         * @returns The name of the owner of the Book
         */
        getOwnerName(): string;

        /**
         * @returns The permission for the current user
         */
        getPermission(): Permission;

        /**
         * Gets the custom properties stored in this Book
         */
        getProperties(): any;

        /**
         * Gets the property value for given keys. First property found will be retrieved
         */
        getProperty(...keys: string[]): string;

        /**
         * Gets all saved queries from this book
         */
        getSavedQueries(): {id?: string, query?: string, title?: string}[];

        /**
         * @returns The time zone of the book
         */
        getTimeZone(): string;

        /**
         * @returns The time zone offset of the book, in minutes
         */
        getTimeZoneOffset(): number;

        /**
         * Retrieve a transaction by id
         */
        getTransaction(id: string): Transaction;

        /**
         * Get Book transactions based on a query.
         *
         * See [Query Guide](https://help.bkper.com/en/articles/2569178-search-query-guide) to learn more
         *
         * @returns The Transactions result as an iterator.
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
        getTransactions(query?: string): TransactionIterator;

        /**
         * Instantiate a new [[Account]]
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
        newAccount(): Account;

        /**
         * Instantiate a new [[Group]]
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
        newGroup(): Group;

        /**
         * Instantiate a new [[Transaction]]
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
        newTransaction(): Transaction;

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
         */
        record(transactions: string | any[] | any[][], timeZone?: string): void;

        /**
         * Rounds a value according to the number of fraction digits of the Book
         *
         * @returns The value rounded
         */
        round(value: number): number;

    }

    /**
     * This class defines a Collection of [[Books]].
     */
    export interface Collection {

        /**
         * @returns All Books of this collection.
         */
        getBooks(): Book[];

        /**
         * @returns The id of this Collection
         */
        getId(): string;

        /**
         * @returns The name of this Collection
         */
        getName(): string;

    }

    /**
     * This class defines a File uploaded to a [[Book]].
     *
     * A file can be attached to a [[Transaction]] or used to import data.
     */
    export interface File {

        /**
         * Gets the file content type
         */
        getContentType(): string;

        /**
         * Gets the file id
         */
        getId(): string;

        /**
         * Gets the file name
         */
        getName(): string;

        /**
         * Gets the file serving url for accessing via browser
         */
        getUrl(): string;

    }

    /**
     * This class defines a Group of [[Accounts]].
     *
     * Accounts can be grouped by different meaning, like Expenses, Revenue, Assets, Liabilities and so on
     * 
     * Its useful to keep organized and for high level analysis.
     */
    export interface Group {

        /**
         * Perform create new group.
         */
        create(): Group;

        /**
         * Delete a custom property
         *
         * @returns This Group, for chainning.
         */
        deleteProperty(key: string): Group;

        /**
         * @returns All Accounts of this group.
         */
        getAccounts(): Account[];

        /**
         * @returns The id of this Group
         */
        getId(): string;

        /**
         * @returns The name of this Group
         */
        getName(): string;

        /**
         * @returns The name of this group without spaces and special characters
         */
        getNormalizedName(): string;

        /**
         * Gets the custom properties stored in this Group
         */
        getProperties(): any;

        /**
         * Gets the property value for given keys. First property found will be retrieved
         */
        getProperty(...keys: string[]): string;

        /**
         * @returns True if this group has any account in it
         */
        hasAccounts(): boolean;

        /**
         * Tell if the Group is hidden on main transactions menu
         */
        isHidden(): boolean;

        /**
         * Perform delete group.
         */
        remove(): Group;

        /**
         *  Hide/Show group on main menu.
         */
        setHidden(hidden: boolean): Group;

        /**
         * Sets the name of the Group.
         *
         * @returns This Group, for chainning.
         */
        setName(name: string): Group;

        /**
         * Sets the custom properties of the Group
         *
         * @returns This Group, for chainning.
         */
        setProperties(properties: {[name: string]: string}): Group;

        /**
         * Sets a custom property in the Group.
         */
        setProperty(key: string, value: string): Group;

        /**
         * Perform update group, applying pending changes.
         */
        update(): Group;

    }

    /**
     * This class defines a Transaction between [credit and debit](http://en.wikipedia.org/wiki/Debits_and_credits) [[Accounts]].
     *
     * A Transaction is the main entity on the [Double Entry](http://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) [Bookkeeping](http://en.wikipedia.org/wiki/Bookkeeping) system.
     */
    export interface Transaction {

        /**
         * Add a remote id to the Transaction.
         *
         * @returns This Transaction, for chainning.
         */
        addRemoteId(remoteId: string): Transaction;

        /**
         * Add a url to the Transaction. Url starts with https://
         *
         * @returns This Transaction, for chainning.
         */
        addUrl(url: string): Transaction;

        /**
         * Perform check transaction.
         */
        check(): Transaction;

        /**
         * Perform create new draft transaction.
         */
        create(): Transaction;

        /**
         * Delete a custom property
         *
         * @returns This Transaction, for chainning.
         */
        deleteProperty(key: string): Transaction;

        /**
         * Sets the credit/origin Account of the Transaction. Same as setCreditAccount().
         *
         * @returns This Transaction, for chainning.
         */
        from(account: string | Account): Transaction;

        /**
         * Gets the balance that the [[Account]] has at that day, when listing transactions of that Account.
         *
         * Evolved balances is returned when searching for transactions of a permanent [[Account]].
         * 
         * Only comes with the last posted transaction of the day.
         */
        getAccountBalance(raw?: boolean): number;

        /**
         * @returns The amount of the transaction.
         */
        getAmount(): number;

        /**
         * @returns The date the transaction was created.
         */
        getCreatedAt(): Date;

        /**
         * @returns The date the transaction was created, formatted according to the date pattern of [[Book]].
         */
        getCreatedAtFormatted(): string;

        /**
         * @returns The credit account. The same as origin account.
         */
        getCreditAccount(): Account;

        /**
         * @returns The credit account name.
         */
        getCreditAccountName(): string;

        /**
         * Get the absolute amount of this transaction if the given account is at the credit side, else null.
         */
        getCreditAmount(account: Account | string): number;

        /**
         * @returns The Transaction date, in ISO format yyyy-MM-dd.
         */
        getDate(): string;

        /**
         * @returns The Transaction date, formatted on the date pattern of the [[Book]].
         */
        getDateFormatted(): string;

        /**
         * @returns The Transaction Date object, on the time zone of the [[Book]].
         */
        getDateObject(): Date;

        /**
         * @returns The Transaction date number, in format YYYYMMDD.
         */
        getDateValue(): number;

        /**
         * @returns The debit account. The same as destination account.
         * 
         */
        getDebitAccount(): Account;

        /**
         * @returns The debit account name.
         */
        getDebitAccountName(): string;

        /**
         * Gets the absolute amount of this transaction if the given account is at the debit side, else null.
         */
        getDebitAmount(account: Account | string): number;

        /**
         * @returns The description of this transaction.
         */
        getDescription(): string;

        /**
         * @returns The files attached to the transaction.
         */
        getFiles(): File[];

        /**
         * @returns The id of the Transaction.
         */
        getId(): string;

        /**
         * @returns The date the user informed for this transaction, adjusted to book's time zone.
         *
         * @deprecated Use getDateObject instead.
         */
        getInformedDate(): Date;

        /**
         * @returns The date the user informed for this transaction, formatted according to the date pattern of [[Book]].
         *
         * @deprecated use getDateFormatted instead
         */
        getInformedDateText(): string;

        /**
         * @returns The date numbe. The number format is YYYYMMDD.
         *
         * @deprecated use getDateValue instead.
         */
        getInformedDateValue(): number;

        /**
         * Gets the [[Account]] at the other side of the transaction given the one in one side.
         */
        getOtherAccount(account: Account | string): Account;

        /**
         * The account name at the other side of the transaction given the one in one side.
         */
        getOtherAccountName(account: string | Account): string;

        /**
         * @returns The date time user has recorded/posted this transaction.
         *
         * @deprecated use getCreatedAt instead.
         */
        getPostDate(): Date;

        /**
         * @returns The date time user has recorded/posted this transaction, formatted according to the date pattern of [[Book]].
         *
         * @deprecated use getCreatedAtFormatted instead.
         */
        getPostDateText(): string;

        /**
         * Gets the custom properties stored in this Transaction.
         */
        getProperties(): any;

        /**
         * Gets the property value for given keys. First property found will be retrieved
         */
        getProperty(...keys: string[]): string;

        /**
         * Remote ids are used to avoid duplication.
         *
         * @returns The remote ids of the Transaction.
         */
        getRemoteIds(): string[];

        /**
         * @returns All #hashtags used on the transaction.
         */
        getTags(): string[];

        /**
         * @returns All urls of the transaction.
         */
        getUrls(): string[];

        /**
         * Check if the transaction has the specified tag.
         */
        hasTag(tag: string): boolean;

        /**
         * @returns True if transaction is checked.
         */
        isChecked(): boolean;

        /**
         * @returns True if transaction was already posted to the accounts. False if is still a Draft.
         */
        isPosted(): boolean;

        /**
         * @returns True if transaction is in trash.
         */
        isTrashed(): boolean;

        /**
         * Perform post transaction, changing credit and debit [[Account]] balances.
         */
        post(): Transaction;

        /**
         * Remove the transaction, sending to trash.
         */
        remove(): Transaction;

        /**
         * Restore the transaction from trash.
         */
        restore(): Transaction;

        /**
         * Sets the amount of the Transaction.
         *
         * @returns This Transaction, for chainning.
         */
        setAmount(amount: number): Transaction;

        /**
         * Sets the credit/origin Account of the Transaction. Same as from().
         *
         * @returns This Transaction, for chainning.
         */
        setCreditAccount(account: string | Account): Transaction;

        /**
         * Sets the date of the Transaction, in ISO format yyyy-MM-dd.
         *
         * @returns This Transaction, for chainning
         */
        setDate(date: string): Transaction;

        /**
         * Sets the debit/origin Account of the Transaction. Same as to().
         *
         * @returns This Transaction, for chainning.
         */
        setDebitAccount(account: string | Account): Transaction;

        /**
         * Sets the description of the Transaction.
         *
         * @returns This Transaction, for chainning.
         */
        setDescription(description: string): Transaction;

        /**
         * Sets the custom properties of the Transaction
         *
         * @returns This Transaction, for chainning.
         */
        setProperties(properties: {[name: string]: string}): Transaction;

        /**
         * Sets a custom property in the Transaction.
         *
         * @returns This Transaction, for chainning.
         */
        setProperty(key: string, value: string): Transaction;

        /**
         * Sets the Transaction urls. Url starts with https://
         *
         * @returns This Transaction, for chainning.
         */
        setUrls(urls: string[]): Transaction;

        /**
         * Sets the debit/origin Account of the Transaction. Same as setDebitAccount().
         *
         * @returns This Transaction, for chainning.
         */
        to(account: string | Account): Transaction;

        /**
         * Perform uncheck transaction.
         */
        uncheck(): Transaction;

        /**
         * Upddate transaction, applying pending changes.
         */
        update(): Transaction;

    }

    /**
     * An iterator that allows scripts to iterate over a potentially large collection of transactions.
     *
     * Example:
     * 
     * ```js
     * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
     * 
     * var transactionIterator = book.getTransactions("account:CreditCard after:28/01/2013 before:29/01/2013");
     * 
     * while (transactionIterator.hasNext()) {
     *  var transaction = transactions.next();
     *  Logger.log(transaction.getDescription());
     * }
     * ```
     */
    export interface TransactionIterator {

        /**
         * @returns The account, when filtering by a single account.
         */
        getAccount(): Account;

        /**
         * Gets the Book that originate the iterator
         */
        getBook(): Book;

        /**
         * Gets a token that can be used to resume this iteration at a later time.
         *
         * This method is useful if processing an iterator in one execution would exceed the maximum execution time.
         * 
         * Continuation tokens are generally valid short period of time.
         */
        getContinuationToken(): string;

        /**
         * Determines whether calling next() will return a transaction.
         */
        hasNext(): boolean;

        /**
         * Gets the next transaction in the collection of transactions.
         */
        next(): Transaction;

        /**
         * Sets a continuation token from previous paused iteration
         */
        setContinuationToken(continuationToken: string): void;

    }

    /**
     * A TransactionsDataTableBuilder is used to setup and build two-dimensional arrays containing transactions.
     */
    export interface TransactionsDataTableBuilder {

        /**
         * @returns A two-dimensional array containing all [[Transactions]].
         */
        build(): any[][];

        /**
         * Defines whether the dates should be formatted, based on date patter of the [[Book]]
         *
         * @returns This builder with respective formatting option, for chaining.
         */
        formatDates(format: boolean): TransactionsDataTableBuilder;

        /**
         * Defines whether amounts should be formatted based on [[DecimalSeparator]] of the [[Book]]
         *
         * @returns This builder with respective formatting option, for chaining.
         */
        formatValues(format: boolean): TransactionsDataTableBuilder;

        /**
         * @returns The account, when filtering by a single account.
         */
        getAccount(): Account;

        /**
         * Defines whether include attachments and url links.
         *
         * @returns This builder with respective add attachment option, for chaining.
         */
        includeUrls(include: boolean): TransactionsDataTableBuilder;

    }

    /**
     * The container of balances of an [[Account]], [[Group]] or #hashtag
     *
     * The container is composed of a list of [[Balances]] for a window of time, as well as its period and cumulative totals.
     */
    export interface BalancesContainer {

        /**
         * Creates a BalancesDataTableBuilder to generate a two-dimensional array with all [[BalancesContainers]]
         */
        createDataTable(): BalancesDataTableBuilder;

        /**
         * All [[Balances]] of the container
         */
        getBalances(): Balance[];

        /**
         * Gets a specific [[BalancesContainer]].
         *
         * **NOTE**: Only for Group balance containers. Accounts returns null.
         */
        getBalancesContainer(name: string): BalancesContainer;

        /**
         * Gets all child [[BalancesContainers]].
         *
         * **NOTE**: Only for Group balance containers. Accounts returns null.
         */
        getBalancesContainers(): BalancesContainer[];

        /**
         * The parent BalancesReport of the container
         */
        getBalancesReport(): BalancesReport;

        /**
         * The cumulative checked balance to the date, since the first transaction posted.
         */
        getCheckedCumulativeBalance(): number;

        /**
         * The cumulative checked balance formatted according to [[Book]] decimal format and fraction digits.
         */
        getCheckedCumulativeBalanceText(): string;

        /**
         * The checked balance on the date period.
         */
        getCheckedPeriodBalance(): number;

        /**
         * The checked balance on the date period formatted according to [[Book]] decimal format and fraction digits
         */
        getCheckedPeriodBalanceText(): string;

        /**
         * The cumulative balance to the date, since the first transaction posted.
         */
        getCumulativeBalance(): number;

        /**
         * The cumulative balance formatted according to [[Book]] decimal format and fraction digits.
         */
        getCumulativeBalanceText(): string;

        /**
         * The [[Account]] name, [[Group]] name or #hashtag
         */
        getName(): string;

        /**
         * The balance on the date period.
         */
        getPeriodBalance(): number;

        /**
         * The balance on the date period formatted according to [[Book]] decimal format and fraction digits
         */
        getPeriodBalanceText(): string;

        /**
         * The cumulative unchecked balance to the date, since the first transaction posted.
         */
        getUncheckedCumulativeBalance(): number;

        /**
         * The cumulative unchecked balance formatted according to [[Book]] decimal format and fraction digits.
         */
        getUncheckedCumulativeBalanceText(): string;

        /**
         * The unchecked balance on the date period.
         */
        getUncheckedPeriodBalance(): number;

        /**
         * The unchecked balance on the date period formatted according to [[Book]] decimal format and fraction digits
         */
        getUncheckedPeriodBalanceText(): string;

        /**
         * Gets the credit nature of the BalancesContainer, based on [[Account]], [[Group]] or #hashtag this container represents.
         *
         * For [[Account]], the credit nature will be the same as the one from the Account
         * 
         * For [[Group]], the credit nature will be the same, if all accounts containing on it has the same credit nature. False if mixed.
         * 
         * For #hashtag, the credit nature will be true.
         */
        isCredit(): boolean;

    }

    /**
     * Interface to provide OAuth2 tokens upon calling the API.
     *
     * Implement your own if you need to use one other than the default built-in [ScriptApp](https://developers.google.com/apps-script/reference/script/script-app#getoauthtoken).
     * 
     * Its specially usefull on environments where you can use the built-in ScriptApp services such as [Custom Functions in Google Sheets](https://developers.google.com/apps-script/guides/sheets/functions).
     * 
     * Learn more how to [OAuth 2 library](https://github.com/gsuitedevs/apps-script-oauth2) for Google Apps Script
     */
    export interface OAuthTokenProvider {

        /**
         * A valid OAuth2 access token with **email** scope authorized.
         */
        getOAuthToken(): string;

    }

    /**
     * Enum that represents account types.
     */
    export enum AccountType {

        /**
         * Asset account type
         */
        ASSET = "ASSET",

        /**
         * Incoming account type
         */
        INCOMING = "INCOMING",

        /**
         * Liability account type
         */
        LIABILITY = "LIABILITY",

        /**
         * Outgoing account type
         */
        OUTGOING = "OUTGOING",

    }

    /**
     * Enum that represents queried balances of checked/unchecked transactions.
     *
     * The type is obtained from parsing the **is:checked is:unchecked** query operator.
     */
    export enum BalanceCheckedType {

        /**
         * Balances of is:checked transactions only.
         */
        CHECKED_BALANCE = "CHECKED_BALANCE",

        /**
         *  Balances of all transactions, no matter its checked or unchecked state.
         */
        FULL_BALANCE = "FULL_BALANCE",

        /**
         * Balances of is:unchecked transactions only.
         */
        UNCHECKED_BALANCE = "UNCHECKED_BALANCE",

    }

    /**
     * Enum that represents balance types.
     */
    export enum BalanceType {

        /**
         * Cumulative balance
         */
        CUMULATIVE = "CUMULATIVE",

        /**
         * Period balance
         */
        PERIOD = "PERIOD",

        /**
         * Total balance
         */
        TOTAL = "TOTAL",

    }

    /**
     * Decimal separator of numbers on book
     */
    export enum DecimalSeparator {

        /**
         * ,
         */
        COMMA = "COMMA",

        /**
         * .
         */
        DOT = "DOT",

    }

    /**
     * The Periodicity of the query. It may depend on the level of granularity you write the range params.
     */
    export enum Periodicity {

        /**
         * Example: after:25/01/1983, before:04/03/2013, after:$d-30, before:$d, after:$d-15/$m
         */
        DAILY = "DAILY",

        /**
         * Example: after:jan/2013, before:mar/2013, after:$m-1, before:$m
         */
        MONTHLY = "MONTHLY",

        /**
         * Example: on:2013, after:2013, $y
         */
        YEARLY = "YEARLY",

    }

    /**
     * Enum representing permissions of user in the Book
     *
     * Learn more at [share article](https://help.bkper.com/en/articles/2569153-share-your-book-with-your-peers).
     */
    export enum Permission {

        /**
         * Manage accounts, transactions, book configuration and sharing
         */
        EDITOR = "EDITOR",

        /**
         * No permission
         */
        NONE = "NONE",

        /**
         * Manage everything, including book visibility and deletion. Only one owner per book.
         */
        OWNER = "OWNER",

        /**
         * View transactions, accounts, record and delete drafts
         */
        POSTER = "POSTER",

        /**
         * Record and delete drafts only. Useful to collect data only
         */
        RECORDER = "RECORDER",

        /**
         * View transactions, accounts and balances.
         */
        VIEWER = "VIEWER",

    }

    export var API_KEY_: string;

    export var OAUTH_TOKEN_PROVIDER_: OAuthTokenProvider;

}

declare var BkperApp: Bkper.BkperApp;