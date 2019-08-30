// Type definitions for Bkper Google Apps Script library
// Project: https://developers.bkper.com
// Definitions by: maelcaldas <https://github.com/maelcaldas>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.2

/// <reference types="google-apps-script" />

declare namespace GoogleAppsScript {

  namespace Bkper {

    /**
     * The main entry point to interact with Bkper
     * 
     * Script ID: **1fSZnepYcDUjxCsrWYD3452UJ5nJiB4js0cD45WWOAjMcKJR_PKfLU60X**
     * 
     */
    export interface BkperApp {

      Permission: typeof Permission
      DecimalSeparator: typeof DecimalSeparator
      Periodicity: typeof Periodicity
      BalanceType: typeof BalanceType


      /**
       * Returns the [[Book]] with the specified bookId from url param.
       *
       * This is the main Entry Point to start interacting with BkperApp
       *
       * Example:
       *
       * ```javascript
       * var book = BkperApp.openById("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
       * book.record("#fuel for my Land Rover 126.50 28/01/2013");
       * ```
       *
       * @param bookId The universal book id - The same bookId param of URL you access at app.bkper.com
       *
       */
      openById(bookId: string): Book;

      /**
       * Check if the user is already althorized with OAuth2 to the bkper API
       * @returns True if the user is already authorized, false otherwise
       */
      isUserAuthorized(): boolean;

      /**
       * Gets the authorization screen html template for the user to authorize the API
       * 
       * @param continueUrl The url to continue the action after authorization
       * @param continueText The link text to show the user the action after authorization
       */
      getAuthorizationHtml(continueUrl?: string, continueText?: string): GoogleAppsScript.HTML.HtmlOutput;


    }

    /**
     *
     * A Book represents [General Ledger](https://en.wikipedia.org/wiki/General_ledger) for a company or business, but can also represent a [Ledger](https://en.wikipedia.org/wiki/Ledger) for a project or department
     *
     * It contains all [[Accounts]] where [[Transactions]] are recorded/posted;
     * 
     */
    export interface Book {

      /**
       * Same as bookId param
       */
      getId(): string;

      /**
       * @return The name of this Book
       */
      getName(): string;

      /**
       * @return The number of fraction digits (decimal places) supported by this Book
       */
      getFractionDigits(): number;

      /**
       * @return The name of the owner of the Book
       */
      getOwnerName(): string;

      /**
       * @return The permission for the current user
       */
      getPermission(): Permission;

      /**
       * @return The date pattern of the Book. Example: dd/MM/yyyy
       */
      getDatePattern(): string

      /**
       * @return The decimal separator of the Book
       */
      getDecimalSeparator(): DecimalSeparator;

      /**
       * @return The time zone of the book
       */
      getTimeZone(): string;

      /**
       * @return The time zone offset of the book, in minutes
       */
      getTimeZoneOffset(): number;

      /**
       * @return The last update date of the book, in in milliseconds
       */
      getLastUpdateMs(): string;

      /**
       * @param  date The date to format as string.
       * @param  timeZone The output timezone of the result. Default to script's timeZone
       * 
       * @return The date formated according to date pattern of book
       */
      formatDate(date: Date, timeZone?: string): string;

      /**
       * @param value The value to be formatted.
       * 
       * @return The value formated according to [[DecimalSeparator]] and fraction digits of Book
       */
      formatValue(value: number): string;

      /**
       * Record [[Transactions]] a on the Book. 
       * 
       * The text is usually amount and description, but it can also can contain an informed Date in full format (dd/mm/yyyy - mm/dd/yyyy).
       * 
       * Example: 
       * ```javascript
       * book.record("#gas 63.23");
       * ```
       * 
       * @param transactions The text/array/matrix containing transaction records, one per line/row. Each line/row records one transaction.
       * @param timeZone The time zone to format dates.
       */
      record(transactions: string | any[] | any[][], timeZone?: string): void;

      /**
       * Resumes a transaction iteration using a continuation token from a previous iterator.
       * 
       * @param continuationToken continuation token from a previous transaction iterator
       * 
       * @return a collection of transactions that remained in a previous iterator when the continuation token was generated
       */
      continueTransactionIterator(query: string, continuationToken: string): TransactionIterator;

      /**
       * Gets an [[Account]] object
       * 
       * @param idOrName The id or name of the Account
       * 
       * @returns The matching Account object
       */
      getAccount(idOrName: string): Account;

      /**
       * Gets all [[Accounts]] of this Book
       */
      getAccounts(): Account[];

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
       * Gets all [[Groups]] of this Book
       */
      getGroups(): Group[]

      /**
       * Gets a [[Group]] object
       * 
       * @param idOrName The id or name of the Group
       * 
       * @returns The matching Group object
       */
      getGroup(idOrName: string): Group

      /**
       * Create a [[BalancesDataTableBuilder]] based on a query, to create two dimensional Array representation of balances of [[Account]], [[Group]] or **#hashtag**
       * 
       * See [Query Guide](https://help.bkper.com/en/articles/2569178-search-query-guide) to learn more
       * 
       * @param query The report balance query
       * 
       * @return The balance data table builder
       * 
       * Example:
       * 
       * ```javascript
       * var book = BkperApp.openById("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
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
       * @param query The flter query.
       * 
       * @return Transactions data table builder.
       * 
       * Example: 
       * 
       * ```javascript
       * var book = BkperApp.openById("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
       * 
       * var transactionsDataTable = book.createTransactionsDataTable("acc:'Bank' after:8/2013 before:9/2013").build();
       * ```
       */
      createTransactionsDataTable(query: string): TransactionsDataTableBuilder;


      /**
       * Search for transactions.
       * 
       * See [Query Guide](https://help.bkper.com/en/articles/2569178-search-query-guide) to learn more
       *  
       * @param query The query string.
       * 
       * @return The search result as an iterator.
       * 
       * Example:
       * 
       * ```javascript
       * var book = BkperApp.loadBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
       *
       * var transactions = book.search("acc:CreditCard after:28/01/2013 before:29/01/2013");
       *
       * while (transactions.hasNext()) {
       *  var transaction = transactions.next();
       *  Logger.log(transaction.getDescription());
       * }
       * ```
       */
      search(query: string): TransactionIterator;


    }

    /**
     * 
     * This class defines an [Account](https://en.wikipedia.org/wiki/Account_(bookkeeping)) of a [[Book]].
     * 
     * It mantains a balance of all amount [credited and debited](http://en.wikipedia.org/wiki/Debits_and_credits) in it by [[Transactions]].
     * 
     * An Account can be grouped by [[Groups]].
     * 
     */
    export interface Account {

      /**
       * Gets the account internal id
       */
      getId(): string;

      /**
       * Gets the account name
       */
      getName(): string;

      /**
       * Gets the account description
       */
      getDescription(): string;

      /**
       * @returns The name of this account without spaces and special characters
       */
      getNormalizedName(): string;

      /**
       * Gets the balance based on credit nature of this Account
       *  
       * @param raw True to get the raw balance, no matter the credit nature of this Account.
       * 
       * @returns The balance of this account
       */
      getBalance(raw?: boolean): number;

      /**
       * Gets the checked balance based on credit nature of this Account
       * 
       * @param raw True to get the raw balance, no matter the credit nature of this Account.
       * 
       * @returns The checked balance of this Account
       */
      getCheckedBalance(raw?: boolean): number;

      /**
       * 
       * Tell if the account is permanent.
       * 
       * Permanent Accounts are the ones which final balance is relevant and keep its balances over time.
       *  
       * They are also called [Real Accounts](http://en.wikipedia.org/wiki/Account_(accountancy)#Based_on_periodicity_of_flow)
       * 
       * Usually represents assets or tangibles, capable of being perceived by the senses or the mind, like bank accounts, money, debts and so on.
       * 
       * @returns True if its a permanent Account
       * 
       */
      isPermanent(): boolean;

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
       * 
       */
      isCredit(): boolean;

      /**
       * Tell if this account is in the [[Group]]
       * 
       * @param  group The Group name, id or object
       */
      isInGroup(group: string | Group): boolean;

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

      /**
       * @returns All Accounts of this group.
       */
      getAccounts(): Account[];

    }


    /**
     * 
     * This class defines a Transaction between [credit and debit](http://en.wikipedia.org/wiki/Debits_and_credits) [[Accounts]].
     *
     * A Transaction is the main entity on the [Double Entry](http://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) [Bookkeeping](http://en.wikipedia.org/wiki/Bookkeeping) system.
     * 
     */
    export interface Transaction {

      /**
       * @returns The id of the Transaction
       */
      getId(): string;

      /**
       * @returns True if transaction was already posted to the accounts. False if is still a Draft.
       */
      isPosted(): boolean;

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
       * @returns The credit account. The same as origin account.
       */
      getCreditAccount(): Account;

      /**
       * @returns The credit account name.
       */
      getCreditAccountName(): string;

      /**
       * @returns The debit account. The same as destination account.
       */
      getDebitAccount(): Account;

      /**
       * @returns The debit account name.
       */
      getDebitAccountName(): string;

      /**
       * @returns The amount of the transaction
       */
      getAmount(): number;

      /**
       * Get the absolute amount of this transaction if the given account is at the credit side, else null
       * 
       * @param account The account object, id or name
       */
      getCreditAmount(account: Account | string): number;

      /**
       * Gets the absolute amount of this transaction if the given account is at the debit side, else null
       * 
       * @param account The account object, id or name
       */
      getDebitAmount(account: Account | string): number;

      /**
       * Gets the [[Account]] at the other side of the transaction given the one in one side.
       * 
       * @param account The account object, id or name
       */
      getOtherAccount(account: Account | string): Account;

      /**
       * 
       * The account name at the other side of the transaction given the one in one side.
       * 
       * @param account The account object, id or name
       */
      getOtherAccountName(account: string | Account): string;

      /**
       * @returns The description of this transaction
       */
      getDescription(): string;

      /**
       * @returns The date the user informed for this transaction, adjusted to book's time zone
       */
      getInformedDate(): Date;

      /**
       * @returns The date the user informed for this transaction. The number format is YYYYMMDD
       */
      getInformedDateValue(): number;

      /**
       * @returns The date the user informed for this transaction, formatted according to the date pattern of [[Book]].
       */
      getInformedDateText(): string;

      /**
       * @returns {Date} The date time user has recorded/posted this transaction
       */
      getPostDate(): Date;

      /**
       * @returns The date time user has recorded/posted this transaction, formatted according to the date pattern of [[Book]].
       */
      getPostDateText(): string;

      /**
       * Gets the balance that the [[Account]] has at that day, when listing transactions of that Account.
       * 
       * Evolved balances is returned when searching for transactions of a permanent [[Account]].
       * 
       * Only comes with the last posted transaction of the day.
       * 
       * @param raw True to get the raw balance, no matter the credit nature of the [[Account]].
       * 
       */
      getAccountBalance(raw?: boolean): number;

    }

    /**
     *
     * An iterator that allows scripts to iterate over a potentially large collection of transactions.
     *
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
       * 
       */
      getContinuationToken(): string;

      /**
       * Sets a continuation token from previous paused iteration
       */
      setContinuationToken(continuationToken: string): void;

      /**
       * Determines whether calling next() will return a transaction.
       */
      hasNext(): boolean;

      /**
       * Gets the next transaction in the collection of transactions.
       */
      next(): Transaction;

      /**
       * Return an account if query is filtering by a single account
       */
      getFilteredByAccount(): Account;

    }

    /**
     * A TransactionsDataTableBuilder is used to setup and build two-dimensional arrays containing transactions.
     */
    export interface TransactionsDataTableBuilder {

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
       * Defines whether the value should add Attachments links
       * 
       * @returns This builder with respective add attachment option.
       */
      addUrls(): TransactionsDataTableBuilder;

      /**
       * @returns A two-dimensional array containing all [[Transactions]].
       */
      build(): any[][];

    }

    /**
     * A BalancesDataTableBuilder is used to setup and build two-dimensional arrays containing balance information.
     */
    export interface BalancesDataTableBuilder {

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
       * Fluent method to set the [[BalanceType]]
       * 
       * For **TOTAL** balance type, the table format looks like:
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
       * Two columns, and Each Group | Account | Tag per line.
       * 
       * For **PERIOD** or **CUMULATIVE**, the table will be a time table, and the format looks like:
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
       * First column will be the Date column, and one column for each [[Group]], [[Account]] or Hashtag.
       * 
       * 
       * @param balanceType The type of balance for this data table
       * 
       * @returns This builder with respective balance type.
       */
      setBalanceType(balanceType: BalanceType): BalancesDataTableBuilder;

      /**
       * 
       * Gets an two-dimensional array with the balances.
       * 
       */
      build(): any[][];

    }


    /**
     * The Periodicity of the query. It may depend on the way you write the range params.
     */
    export enum Periodicity {

      /**
       *Example: after:25/01/1983, before:04/03/2013, after:$d-30, before:$d, after:$d-15/$m 
       */
      DAILY = "DAILY",

      /**
       * Example: after:jan/2013, before:mar/2013, after:$m-1, before:$m
       */
      MONTHLY = "MONTHLY",

      /**
       * Example: on:2013, after:2013, $y
       */
      YARLY = "YARLY"
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
      DOT = "DOT"
    }

    /**
     * Enum representing permissions of user in the Book
     * 
     * Learn more at [share article](https://help.bkper.com/en/articles/2569153-share-your-book-with-your-peers).
     */
    export enum Permission {

      /**
       * No permission
       */
      NONE = "NONE",

      /**
       * View transactions, accounts and balances.
       */
      VIEWER = "VIEWER",

      /**
       * Record and delete drafts only. Useful to collect data only
       */
      RECORD_ONLY = "RECORD_ONLY",

      /**
       * View transactions, accounts, record and delete drafts
       */
      POST = "POST",

      /**
       * Manage accounts, transactions, book configuration and sharing
       */      
      EDITOR = "EDITOR",
      
      /**
       * Manage everything, including book visibility and deletion. Only one owner per book.
       */            
      OWNER = "OWNER"
    }

    /**
     * Enum that represents balance types.
     */
    export enum BalanceType {
      /** Total balance */
      TOTAL = "TOTAL",
      /** Period balance */
      PERIOD = "PERIOD",
      /** Cumulative balance */
      CUMULATIVE = "CUMULATIVE"
    }
  }
}
/**
 * The main entry point to interact with Bkper
 * 
 * Script ID: **1fSZnepYcDUjxCsrWYD3452UJ5nJiB4js0cD45WWOAjMcKJR_PKfLU60X**
 * 
 */
declare var BkperApp: GoogleAppsScript.Bkper.BkperApp;

