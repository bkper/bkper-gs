
declare namespace bkper {
  interface AccountBalancesV2Payload {
    balances?: BalanceV2Payload[];
    checkedCumulativeBalance?: number;
    checkedPeriodBalance?: number;
    credit?: boolean;
    cumulativeBalance?: number;
    name?: string;
    periodBalance?: number;
    permanent?: boolean;
    uncheckedCumulativeBalance?: number;
    uncheckedPeriodBalance?: number;
  }
  interface AccountCreationV2Payload {
    /** The optional description of the account. */
    description?: string;
    /** The optional group where this account should be added. Account type would be determined by the group type. */
    group?: string;
    /** The name of the account. */
    name?: string;
  }
  interface AccountPayloadCollection {
    items?: AccountV2Payload[];
  }
  interface AccountV2Payload {
    active?: boolean;
    balance?: number;
    checkedBalance?: number;
    credit?: boolean;
    description?: string;
    groupsIds?: string[];
    id?: string;
    name?: string;
    permanent?: boolean;
    properties?: any;
  }
  interface BalanceV2Payload {
    checkedCumulativeBalance: number;
    checkedPeriodBalance: number;
    cumulativeBalance: number;
    day: number;
    month: number;
    periodBalance: number;
    uncheckedCumulativeBalance: number;
    uncheckedPeriodBalance: number;
    year: number;
    fuzzyDate: number;
  }
  interface BalancesV2Payload {
    accountBalances?: AccountBalancesV2Payload[];
    groupBalances?: GroupBalancesV2Payload[];
    periodicity?: any;
    balanceCheckedType?: any;
    range?: string;
    tagBalances?: TagBalancesV2Payload[];
    totalRemovedBalances?: number;
  }
  interface BookThinCollection {
    items?: BookV2Payload[];
  }
  interface BookV2Payload {
    datePattern?: string;
    decimalSeparator?: string;
    fractionDigits?: number;
    id?: string;
    lastUpdateMs?: string;
    locale?: string;
    name?: string;
    ownerName?: string;
    permission?: any;
    timeZone?: string;
    timeZoneOffset?: number;
    properties?: any;
  }
  interface GroupBalancesV2Payload {
    accountBalances?: AccountBalancesV2Payload[];
    balances?: BalanceV2Payload[];
    checkedCumulativeBalance?: number;
    checkedPeriodBalance?: number;
    credit?: boolean;
    cumulativeBalance?: number;
    name?: string;
    periodBalance?: number;
    permanent?: boolean;
    uncheckedCumulativeBalance?: number;
    uncheckedPeriodBalance?: number;
  }
  interface GroupCollection {
    items?: GroupV2Payload[];
  }
  interface GroupV2Payload {
    id?: string;
    name?: string;
    properties?: any;
  }
  interface Message {
    message?: string;
  }
  interface SaveDraftsResponsePayload {
    linesFound?: number;
    numberOfDuplicatedDrafts?: number;
    numberOfSavedDrafts?: number;
  }
  interface SavedQueryCollection {
    items?: SavedQueryV2Payload[];
  }
  interface SavedQueryV2Payload {
    account?: string;
    id: string;
    query: string;
    title: string;
  }
  interface TagBalancesV2Payload {
    balances?: BalanceV2Payload[];
    checkedCumulativeBalance?: number;
    checkedPeriodBalance?: number;
    credit?: boolean;
    cumulativeBalance?: number;
    name?: string;
    periodBalance?: number;
    permanent?: boolean;
    uncheckedCumulativeBalance?: number;
    uncheckedPeriodBalance?: number;
  }
  interface TransactionOperationResultPayload {
    accounts?: AccountV2Payload[];
    creditAcc?: AccountV2Payload;
    debitAcc?: AccountV2Payload;
    transaction?: TransactionV2Payload;
  }
  interface TransactionV2Payload {
    accuracy?: number;
    amount?: number;
    agentId?: string;
    bookId?: string;
    bookName?: string;
    caBal?: number;
    ckd?: boolean;
    creditAccBalance?: number;
    creditAccDescription?: string;
    creditAccGroups?: string[];
    creditAccId?: string;
    creditAccName?: string;
    daBal?: number;
    debitAccBalance?: number;
    debitAccDescription?: string;
    debitAccGroups?: string[];
    debitAccId?: string;
    debitAccName?: string;
    description?: string;
    id?: string;
    informedDateMs?: string;
    informedDateText?: string;
    informedDateValue?: number;
    latitude?: number;
    link?: string;
    longitude?: number;
    postDateMs?: string;
    posted?: boolean;
    postedBy?: string;
    tags?: string[];
    text?: string;
    trashed?: boolean;
    urls?: string[];
  }
  interface TransactionV2PayloadCollection {
    items?: TransactionV2Payload[];
  }
  interface TransactionsPayload {
    cursor?: string;
    customSearch?: boolean;
    dateMs?: string;
    filter?: string;
    items?: TransactionV2Payload[];
    nextFilter?: string;
    periodicity?: any;
    previousFilter?: string;
  }
  interface UserDetailsV2Payload {
    plan?: any;
  }
}
