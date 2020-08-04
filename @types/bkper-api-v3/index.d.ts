declare namespace bkper {
    export interface Account {
        agentId?: string;
        /**
         * Archived accounts are kept for history
         */
        archived?: boolean;
        /**
         * The overall account balance
         */
        balance?: string;
        /**
         * The balance of the account for checked transactions
         */
        checkedBalance?: string;
        /**
         * Credit nature or Debit otherwise
         */
        credit?: boolean;
        /**
         * The ids of groups of the account
         */
        groups?: string[];
        /**
         * The unique id that identifies the Account in the Book
         */
        id?: string;
        /**
         * The name of the Account
         */
        name?: string;
        /**
         * The name of the Account, lowercase, without spaces or special characters
         */
        normalizedName?: string;
        /**
         * Permanent are such as bank accounts, customers or the like
         */
        permanent?: boolean;
        /**
         * The key/value custom properties of the Account
         */
        properties?: {
            [name: string]: string;
        };
        /**
         * The type of the account
         */
        type?: "ASSET" | "LIABILITY" | "INCOMING" | "OUTGOING";
    }
    export interface AccountBalances {
        balances?: Balance[];
        checkedCumulativeBalance?: string;
        checkedPeriodBalance?: string;
        credit?: boolean;
        cumulativeBalance?: string;
        name?: string;
        periodBalance?: string;
        permanent?: boolean;
        uncheckedCumulativeBalance?: string;
        uncheckedPeriodBalance?: string;
    }
    export interface AccountList {
        items?: Account[];
    }
    export interface AccountSave {
        /**
         * The ids of groups of the account
         */
        groups?: string[];
        /**
         * The name of the Account
         */
        name?: string;
        /**
         * The key/value custom properties of the Account
         */
        properties?: {
            [name: string]: string;
        };
        /**
         * Types: ASSET, LIABILITY, INCOMING, OUTGOING. Default to ASSET if none indentified
         */
        type?: string;
    }
    export interface AccountSaveBatch {
        items?: AccountSave[];
    }
    export interface Balance {
        checkedCumulativeBalance?: string;
        checkedPeriodBalance?: string;
        cumulativeBalance?: string;
        day?: number; // int32
        fuzzyDate?: number; // int32
        month?: number; // int32
        periodBalance?: string;
        uncheckedCumulativeBalance?: string;
        uncheckedPeriodBalance?: string;
        year?: number; // int32
    }
    export interface Balances {
        accountBalances?: AccountBalances[];
        balanceCheckedType?: "FULL_BALANCE" | "CHECKED_BALANCE" | "UNCHECKED_BALANCE";
        groupBalances?: GroupBalances[];
        nextRange?: string;
        onDateMillis?: number; // int64
        periodicity?: "DAILY" | "MONTHLY" | "YEARLY";
        previousRange?: string;
        range?: string;
        tagBalances?: TagBalances[];
        totalRemovedBalances?: number; // int32
    }
    export interface Book {
        /**
         * The book Accounts
         */
        accounts?: Account[];
        agentId?: string;
        collection?: Collection;
        /**
         * The date pattern of the Book. Example: dd/MM/yyyy
         */
        datePattern?: string;
        /**
         * The decimal separator of the Book
         */
        decimalSeparator?: "DOT" | "COMMA";
        /**
         * The number of fraction digits (decimal places) of the Book
         */
        fractionDigits?: number; // int32
        /**
         * The book account Groups
         */
        groups?: Group[];
        /**
         * The unique id that identifies the Book in the system. Found at bookId url param
         */
        id?: string;
        /**
         * The last update date of the Book, in in milliseconds
         */
        lastUpdateMs?: string;
        /**
         * The name of the Book
         */
        name?: string;
        /**
         * The Book owner username
         */
        ownerName?: string;
        /**
         * The Permission the current user has in the Book
         */
        permission?: "OWNER" | "EDITOR" | "POSTER" | "RECORDER" | "VIEWER" | "NONE";
        /**
         * The key/value custom properties of the Book
         */
        properties?: {
            [name: string]: string;
        };
        /**
         * The time zone of the Book
         */
        timeZone?: string;
        /**
         * The time zone offset of the Book, in minutes
         */
        timeZoneOffset?: number; // int32
    }
    export interface BookList {
        items?: Book[];
    }
    export interface Collection {
        agentId?: string;
        /**
         * The Books contained in the Collection
         */
        books?: Book[];
        /**
         * The unique id of the Collection
         */
        id?: string;
        /**
         * The name of the Collection
         */
        name?: string;
        /**
         * The username of the Collection owner
         */
        ownerUsername?: string;
    }
    export interface Group {
        agentId?: string;
        /**
         * The unique id that identifies the Group in the Book
         */
        id?: string;
        /**
         * The name of the Group
         */
        name?: string;
        /**
         * The name of the Group, lowercase, without spaces or special characters
         */
        normalizedName?: string;
        /**
         * The key/value custom properties of the Group
         */
        properties?: {
            [name: string]: string;
        };
    }
    export interface GroupBalances {
        accountBalances?: AccountBalances[];
        balances?: Balance[];
        checkedCumulativeBalance?: string;
        checkedPeriodBalance?: string;
        credit?: boolean;
        cumulativeBalance?: string;
        name?: string;
        periodBalance?: string;
        permanent?: boolean;
        uncheckedCumulativeBalance?: string;
        uncheckedPeriodBalance?: string;
    }
    export interface GroupList {
        items?: Group[];
    }
    export interface GroupSave {
        /**
         * The name of the Group
         */
        name?: string;
        /**
         * The key/value custom properties of the Group
         */
        properties?: {
            [name: string]: string;
        };
    }
    export interface GroupSaveBatch {
        items?: GroupSave[];
    }
    export interface Query {
        agentId?: string;
        /**
         * The unique id that identifies the saved Query in the Book
         */
        id?: string;
        /**
         * The Query string to be executed
         */
        query?: string;
        /**
         * The title of the saved Query
         */
        title?: string;
    }
    export interface QueryList {
        items?: Query[];
    }
    export interface TagBalances {
        balances?: Balance[];
        checkedCumulativeBalance?: string;
        checkedPeriodBalance?: string;
        credit?: boolean;
        cumulativeBalance?: string;
        name?: string;
        periodBalance?: string;
        permanent?: boolean;
        uncheckedCumulativeBalance?: string;
        uncheckedPeriodBalance?: string;
    }
    export interface Transaction {
        agentId?: string;
        /**
         * The amount on format ####.##
         */
        amount?: string;
        /**
         * Tell if the transaction is a checked
         */
        checked?: boolean;
        /**
         * The timestamp the transaction was created, in milliseconds
         */
        createdAt?: string;
        creditAccount?: Account;
        /**
         * The date on ISO format yyyy-MM-dd
         */
        date?: string;
        /**
         * The date on format of the Book
         */
        dateFormatted?: string;
        /**
         * The date number representation on format YYYYMMDD
         */
        dateValue?: number; // int32
        debitAccount?: Account;
        /**
         * The transaction description
         */
        description?: string;
        /**
         * Tell if the transaction is a draft, not yet posted to accounts
         */
        draft?: boolean;
        /**
         * The unique id that identifies the transaction in the book
         */
        id?: string;
        /**
         * The transaction #hashtags
         */
        tags?: string[];
        /**
         * Tell if transaction is trashed
         */
        trashed?: boolean;
        /**
         * The transaction urls
         */
        urls?: string[];
    }
    export interface TransactionList {
        /**
         * The account id when filtering by a single account. E.g. account='Bank'
         */
        account?: string;
        /**
         * The cursor, for pagination
         */
        cursor?: string;
        items?: Transaction[];
    }
    export interface TransactionSave {
        /**
         * The transaction description
         */
        description?: string;
        /**
         * Optional file data Base64 encoded
         */
        file?: string;
        /**
         * Optional file name
         */
        filename?: string;
        /**
         * Optional id to avoid duplication
         */
        id?: string;
        /**
         * Optional file mime type
         */
        mimeType?: string;
    }
    export interface TransactionSaveBatch {
        items?: TransactionSave[];
    }
}
declare namespace Paths {
    namespace BkperV3CreateAccount {
        export interface BodyParameters {
            AccountSave: Parameters.AccountSave;
        }
        namespace Parameters {
            export type AccountSave = bkper.AccountSave;
        }
        namespace Responses {
            export type $200 = bkper.Account;
        }
    }
    namespace BkperV3CreateAccountsBatch {
        export interface BodyParameters {
            AccountSaveBatch: Parameters.AccountSaveBatch;
        }
        namespace Parameters {
            export type AccountSaveBatch = bkper.AccountSaveBatch;
        }
        namespace Responses {
            export type $200 = bkper.AccountList;
        }
    }
    namespace BkperV3CreateGroupsBatch {
        export interface BodyParameters {
            GroupSaveBatch: Parameters.GroupSaveBatch;
        }
        namespace Parameters {
            export type GroupSaveBatch = bkper.GroupSaveBatch;
        }
        namespace Responses {
            export type $200 = bkper.GroupList;
        }
    }
    namespace BkperV3CreateTransaction {
        export interface BodyParameters {
            TransactionSave: Parameters.TransactionSave;
        }
        namespace Parameters {
            export type TransactionSave = bkper.TransactionSave;
        }
        namespace Responses {
            export type $200 = bkper.Transaction;
        }
    }
    namespace BkperV3CreateTransactionsBatch {
        export interface BodyParameters {
            TransactionSaveBatch: Parameters.TransactionSaveBatch;
        }
        namespace Parameters {
            export type TransactionSaveBatch = bkper.TransactionSaveBatch;
        }
        namespace Responses {
            export type $200 = bkper.TransactionList;
        }
    }
    namespace BkperV3GetBook {
        namespace Responses {
            export type $200 = bkper.Book;
        }
    }
    namespace BkperV3ListBooks {
        namespace Responses {
            export type $200 = bkper.BookList;
        }
    }
    namespace BkperV3ListQueries {
        namespace Responses {
            export type $200 = bkper.QueryList;
        }
    }
    namespace BkperV3ListTransactions {
        namespace Responses {
            export type $200 = bkper.TransactionList;
        }
    }
    namespace BkperV3QueryBalances {
        namespace Responses {
            export type $200 = bkper.Balances;
        }
    }
}
