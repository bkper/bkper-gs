// Type definitions for BkperApp
// Generator: https://github.com/maelcaldas/clasp-types

/// <reference types="google-apps-script" />

declare namespace bkper {

    /**
     * The main entry point to interact with BkperApp
     *
     * Script ID: **1fSZnepYcDUjxCsrWYD3452UJ5nJiB4js0cD45WWOAjMcKJR_PKfLU60X**
     */
    export interface BkperApp {

        Permission: typeof Permission;

        Periodicity: typeof Periodicity;

        DecimalSeparator: typeof DecimalSeparator;

        BalanceType: typeof BalanceType;

        /**
         * Gets the authorization screen html template for the user to authorize the API
         */
        getAuthorizationHtml(continueUrl?: string, continueText?: string): GoogleAppsScript.HTML.HtmlOutput;

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
         * Check if the user is already althorized with OAuth2 to the bkper API
         */
        isUserAuthorized(): boolean;

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
         * Gets the balance based on credit nature of this Account
         *
         * @returns The balance of this account
         */
        getBalance(raw?: boolean): number;

        /**
         * Gets the checked balance based on credit nature of this Account
         *
         * @returns The checked balance of this Account
         */
        getCheckedBalance(raw?: boolean): number;

        /**
         * Gets the account description
         */
        getDescription(): string;

        /**
         * Gets the account internal id
         */
        getId(): string;

        /**
         * Gets the account name
         */
        getName(): string;

        /**
         * @returns The name of this account without spaces and special characters
         */
        getNormalizedName(): string;

        /**
         * Tell if this account is Active or otherwise Archived
         */
        isActive(): boolean;

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
         * Gets an two-dimensional array with the balances.
         *
         * For **TOTAL** [[BalanceType]], the table format looks like:
         * 
         * ```
         *   _____________________
         *  |    NAME   | AMOUNT  |
         *  | Expenses  | 4568.23 |
         *  | Incomes   | 5678.93 |
         *  |    ...    |   ...   |
         *  |___________|_________|
         * 
         * ```
         * Two columns, and each [[Group]] | [[Account]] | #hashtag per line.
         * 
         * For **PERIOD** or **CUMULATIVE** [[BalanceType]], the table will be a time table, and the format looks like:
         * 
         * ```
         *  _____________________________________________
         *  |    DATE    | Expenses | Incomes |    ...   |
         *  | 15/01/2014 | 2345.23  | 3452.93 |    ...   |
         *  | 15/02/2014 | 2345.93  | 3456.46 |    ...   |
         *  | 15/03/2014 | 2456.45  | 3567.87 |    ...   |
         *  |    ...     |   ...    |   ...   |    ...   |
         *  |___________ |__________|_________|__________|
         * 
         * ```
         * 
         * First column will be the Date column, and one column for each [[Group]], [[Account]] or #hashtag.
         */
        build(): any[][];

        /**
         * Defines whether the dates should be formatted based on date pattern and periodicity of the [[Book]].
         *
         * @returns This builder with respective formatting option.
         */
        formatDate(): BalancesDataTableBuilder;

        /**
         * Defines whether the value should be formatted based on decimal separator of the [[Book]].
         *
         * @returns This builder with respective formatting option.
         */
        formatValue(): BalancesDataTableBuilder;

        /**
         * Fluent method to set the [[BalanceType]] for the builder.
         *
         * @returns This builder with respective balance type.
         */
        setBalanceType(balanceType: BalanceType): BalancesDataTableBuilder;

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
         */
        createAccount(name: string, group?: string, description?: string): Account;

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
         * Create a [[TransactionsDataTableBuilder]] based on a query, to create two dimensional Array representations of [[Transactions]] dataset.
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
         * var transactionsDataTable = book.createTransactionsDataTable("acc:'Bank' after:8/2013 before:9/2013").build();
         * ```
         */
        createTransactionsDataTable(query?: string): TransactionsDataTableBuilder;

        /**
         * @returns The date formated according to date pattern of book
         */
        formatDate(date: Date, timeZone?: string): string;

        /**
         * @returns The value formated according to [[DecimalSeparator]] and fraction digits of Book
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

        getBalanceReport(query: string): BalancesReport;

        /**
         * Create a [[BalancesReport]] based on query
         */
        getBalancesReport(query: string): BalancesReport;

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

        getLocale(): string;

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
         * Gets all saved queries from this book
         */
        getSavedQueries(): {id: string, query: string, title: string}[];

        /**
         * @returns The time zone of the book
         */
        getTimeZone(): string;

        /**
         * @returns The time zone offset of the book, in minutes
         */
        getTimeZoneOffset(): number;

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
         * var book = BkperApp.loadBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
         * 
         * var transactions = book.getTransactions("acc:CreditCard after:28/01/2013 before:29/01/2013");
         * 
         * while (transactions.hasNext()) {
         *  var transaction = transactions.next();
         *  Logger.log(transaction.getDescription());
         * }
         * ```
         */
        getTransactions(query?: string): TransactionIterator;

        /**
         * Record [[Transactions]] a on the Book.
         *
         * The text is usually amount and description, but it can also can contain an informed Date in full format (dd/mm/yyyy - mm/dd/yyyy).
         * 
         * Example:
         * ```js
         * book.record("#gas 63.23");
         * ```
         */
        record(transactions: string | any[] | any[][], timeZone?: string): void;

        search(query?: string): TransactionIterator;

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
         * @returns True if this group has any account in it
         */
        hasAccounts(): boolean;

    }

    /**
     * This class defines a Transaction between [credit and debit](http://en.wikipedia.org/wiki/Debits_and_credits) [[Accounts]].
     *
     * A Transaction is the main entity on the [Double Entry](http://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) [Bookkeeping](http://en.wikipedia.org/wiki/Bookkeeping) system.
     */
    export interface Transaction {

        /**
         * Gets the balance that the [[Account]] has at that day, when listing transactions of that Account.
         *
         * Evolved balances is returned when searching for transactions of a permanent [[Account]].
         * 
         * Only comes with the last posted transaction of the day.
         */
        getAccountBalance(raw?: boolean): number;

        /**
         * @returns The amount of the transaction
         */
        getAmount(): number;

        /**
         * @returns The credit account. The same as origin account.
         */
        getCreditAccount(): Account;

        /**
         * @returns The credit account name.
         */
        getCreditAccountName(): string;

        /**
         * Get the absolute amount of this transaction if the given account is at the credit side, else null
         */
        getCreditAmount(account: Account | string): number;

        /**
         * @returns The debit account. The same as destination account.
         */
        getDebitAccount(): Account;

        /**
         * @returns The debit account name.
         */
        getDebitAccountName(): string;

        /**
         * Gets the absolute amount of this transaction if the given account is at the debit side, else null
         */
        getDebitAmount(account: Account | string): number;

        /**
         * @returns The description of this transaction
         */
        getDescription(): string;

        /**
         * @returns The id of the Transaction
         */
        getId(): string;

        /**
         * @returns The date the user informed for this transaction, adjusted to book's time zone
         */
        getInformedDate(): Date;

        /**
         * @returns The date the user informed for this transaction, formatted according to the date pattern of [[Book]].
         */
        getInformedDateText(): string;

        /**
         * @returns The date the user informed for this transaction. The number format is YYYYMMDD
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
         * @returns The date time user has recorded/posted this transaction
         */
        getPostDate(): Date;

        /**
         * @returns The date time user has recorded/posted this transaction, formatted according to the date pattern of [[Book]].
         */
        getPostDateText(): string;

        /**
         * @returns All #hashtags used on the transaction
         */
        getTags(): string[];

        /**
         * @returns All urls of the transaction
         */
        getUrls(): string[];

        /**
         * Check if the transaction has the specified tag
         */
        hasTag(tag: string): boolean;

        /**
         * @returns True if transaction was already posted to the accounts. False if is still a Draft.
         */
        isPosted(): boolean;

    }

    /**
     * An iterator that allows scripts to iterate over a potentially large collection of transactions.
     */
    export interface TransactionIterator {

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
         * Return an account if query is filtering by a single account
         */
        getFilteredByAccount(): Account;

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
         * Defines whether the value should add Attachments links
         *
         * @returns This builder with respective add attachment option.
         */
        addUrls(): TransactionsDataTableBuilder;

        /**
         * @returns A two-dimensional array containing all [[Transactions]].
         */
        build(): any[][];

        /**
         * Defines whether the dates should be formatted, based on date patter of the [[Book]]
         *
         * @returns This builder with respective formatting option.
         */
        formatDate(): TransactionsDataTableBuilder;

        /**
         * Defines whether the value should be formatted based on [[DecimalSeparator]] of the [[Book]]
         *
         * @returns This builder with respective formatting option.
         */
        formatValue(): TransactionsDataTableBuilder;

        /**
         * Return an account if query is filtering by a single account
         */
        getFilteredByAccount(): Account;

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
         * **NOTE**: Only for Groups balance containers. Accounts and hashtags return null.
         */
        getBalancesContainer(name: string): BalancesContainer;

        /**
         * Gets all child [[BalancesContainers]].
         *
         * **NOTE**: Only for Groups balance containers. Accounts and hashtags return empty.
         */
        getBalancesContainers(): BalancesContainer[];

        /**
         * The parent BalancesReport of the container
         */
        getBalancesReport(): BalancesReport;

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
        POST = "POST",

        /**
         * Record and delete drafts only. Useful to collect data only
         */
        RECORD_ONLY = "RECORD_ONLY",

        /**
         * View transactions, accounts and balances.
         */
        VIEWER = "VIEWER",

    }

}

declare var BkperApp: bkper.BkperApp;