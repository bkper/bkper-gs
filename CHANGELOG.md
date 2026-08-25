# Changelog

## v3.47.0 — 2026-08-14

* Added `Book.getTransactionsByIds()` to retrieve complete transactions by ID in sequential batches of up to 200

## v3.45.0 — 2026-06-09

* Added `Book.getFiles()`
* Added `FileIterator`

## v3.44.0 — 2026-04-17

* Added `Book.mergeTransactions()`

## v3.43.0 — 2026-02-07

* `AccountsDataTableBuilder` now sorts groups per account by hierarchy path (root then depth) when `includeGroups()` is enabled

## v3.42.1 — 2026-01-20

* `Bkper.setApiKey()` is now optional and used only to assign a dedicated quota - agent attribution is handled via `Bkper.setAgentId()`

## v3.42.0 — 2026-01-12

* Added `Bkper.setAgentId()`
* API requests now send a `bkper-agent-id` header to attribute actions to the calling agent

## v3.41.0 — 2025-12-10

* `Book.getAccounts()` now accepts an optional group parameter to filter accounts by group
* `Book.createAccountsDataTable()` now accepts an optional group parameter to filter accounts by group

## v3.40.0 — 2025-12-09

* Added `AccountsDataTableBuilder.ids()`
* Added `GroupsDataTableBuilder.ids()`

## v3.39.0 — 2025-12-05

* Added `TransactionStatus` enum
* Added `Transaction.getStatus()`
* `TransactionsDataTableBuilder` output now always uses Origin, Destination and Amount columns, regardless of whether a single account is being filtered
* `TransactionsDataTableBuilder` now includes a Status column for each transaction
* Renamed transaction id column header to "Transaction Id" in `TransactionsDataTableBuilder`

## v3.38.2 — 2025-11-26

* Added `Account.getVisibleProperties()`
* Added `Account.setVisibleProperty()`
* Added `Account.setVisibleProperties()`
* Added `Book.getVisibleProperties()`
* Added `Book.setVisibleProperty()`
* Added `Book.setVisibleProperties()`
* Added `File.getVisibleProperties()`
* Added `File.setVisibleProperty()`
* Added `File.setVisibleProperties()`
* Added `Group.getVisibleProperties()`
* Added `Group.setVisibleProperty()`
* Added `Group.setVisibleProperties()`
* Added `Transaction.getVisibleProperties()`
* Added `Transaction.setVisibleProperty()`
* Added `Transaction.setVisibleProperties()`

## v3.38.1 — 2025-10-06

* Files attached to transactions are now created internally when the transaction is persisted

## v3.38.0 — 2025-10-02

* Added `File.getProperties()`
* Added `File.getPropertyKeys()`
* Added `File.getProperty()`
* Added `File.setProperty()`
* Added `File.setProperties()`
* Added `File.deleteProperty()`

## v3.37.0 — 2025-07-03

* `BalancesDataTableBuilder` now formats dates in ISO YYYY-MM-DD format when `formatDate()` is enabled
* Reverted time table transpose behavior in `BalancesDataTableBuilder.transpose()`
* `BalancesDataTableBuilder` now only expands all groups when the query is filtered by group

## v3.36.1 — 2025-06-12

* Balances time table no longer indents group names when the output is transposed

## v3.36.0 — 2024-12-30

* Added `Group.isLocked()`
* Added `Group.setLocked()`

## v3.35.0 — 2024-11-26

* Added `Collection.setName()`
* Added `Collection.update()`

## v3.34.8 — 2024-11-13

* Added `Group.getParentGroupsChain()`

## v3.34.0 — 2024-01-30

* Added `Transaction.isLocked()`

## v3.33.0 — 2024-01-16

* Added `Book.batchUpdateTransactions()`
* Added `Transaction.setChecked()`

## v3.32.1 — 2023-12-01

* Added `BotResponseType`

## v3.32.0 — 2023-12-01

* Added `BotResponse`
* Added `BotResponse.getType()`
* Added `BotResponse.getAgentId()`
* Added `BotResponse.getMessage()`
* Added `Event.getBotResponses()`

## v3.31.0 — 2023-11-13

* Added `Event`
* Added `Event.getId()`
* Added `EventIterator`
* Added `EventIterator.getBook()`
* Added `EventIterator.getContinuationToken()`
* Added `EventIterator.hasNext()`
* Added `EventIterator.next()`
* Added `EventIterator.setContinuationToken()`
* Added `Book.getEvents()`

## v3.30.0 — 2023-10-30

* Added `Book.countTransactions()`

## v3.29.4 — 2023-08-01

* Added `Backlog`
* Added `Backlog.getCount()`
* Added `Book.getBacklog()`

## v3.26.0 — 2022-12-15

* Added `BalancesDataTableBuilder.properties`

## v3.25.0 — 2022-11-09

* Added `BalancesContainer.addBalancesContainer()`
* Added `BalancesContainer.removeBalancesContainer()`

## v3.22.0 — 2022-09-20

* Added `Book.createGroupsDataTable()`
* Added `Group.getPropertyKeys()`
* Added `GroupsDataTableBuilder`
* Added `GroupsDataTableBuilder.includeProperties()`
* Added `GroupsDataTableBuilder.build()`

## v3.21.0 — 2022-09-14

* Added `Account.getPropertyKeys()`
* Added `AccountsDataTableBuilder.includeGroups()`
* Added `AccountsDataTableBuilder.includeProperties()`

## v3.19.0 — 2022-06-09

* Added `BalancesContainer.getAccountBalancesContainers()`
* Added `BalancesReport.getAccountBalancesContainers()`

## v3.16.0 — 2022-06-07

* Added `Group.getRoot()`

## v3.15.1 — 2022-05-04

* Added `Book.getTotalTransactions()`
* Added `Book.getTotalTransactionsCurrentMonth()`
* Added `Book.getTotalTransactionsCurrentYear()`

## v3.15.0 — 2022-05-03

* Added `Book.batchCheckTransactions()`
* Added `Book.batchUncheckTransactions()`
* Added `Book.batchTrashTransactions()`
* Added `Transaction.trash()`
* Added `Transaction.untrash()`
* Deprecated `Transaction.remove()`
* Deprecated `Transaction.restore()`

## v3.14.3 — 2022-04-29

* Added `Book.getClosingDate()`
* Added `Book.setClosingDate()`

## v3.14.0 — 2022-02-25

* Added `Balance.getCumulativeBalanceRaw()`
* Added `Balance.getPeriodBalanceRaw()`

## v3.13.0 — 2022-02-18

* Added `BalancesContainer.isPermanent()`

## v3.12.0 — 2022-02-17

* Added `Book.deleteProperty()`

## v3.10.32 — 2021-12-15

* Added `Group.isCredit()`
* Added `Group.isPermanent()`
* Added `Group.isMixed()`
* Added `Group.getType()`

## v3.10.30 — 2021-11-23

* Added `Book.getPeriodStartMonth()`
* Added `Book.setPeriodStartMonth()`
* Added `Month`

## v3.10.23 — 2021-09-28

* Added `Book.parseDate()`
* Added `Book.parseAmount()`
* Added `Book.formatAmount()`
* Deprecated `Book.parseValue()`
* Deprecated `Book.formatValue()`

## v3.10.12 — 2021-05-25

* Added `BalancesContainer.hasGroupBalances()`

## v3.10.11 — 2021-05-25

* Added `Group.hasChildren()`
* Added `BalancesContainer.getProperties()`
* Added `BalancesContainer.getProperty()`

## v3.10.8 — 2021-05-11

* Added `BalancesContainer.getAccount()`
* Added `BalancesContainer.getGroup()`

## v3.10.7 — 2021-05-11

* Added `BalancesContainer.getParent()`

## v3.10.3 — 2021-05-07

* Added `BalancesContainer.isFromAccount()`
* Added `BalancesContainer.isFromGroup()`

## v3.10.2 — 2021-05-06

* Added `Group.getParent()`

## v3.10.0 — 2021-04-17

* Added `BalancesContainer.getCumulativeBalanceRaw()`
* Added `BalancesContainer.getCumulativeBalanceRawText()`
* Added `BalancesDataTableBuilder.raw()`
* Added `Account.getGetBalanceRaw()`

## v3.9.4 — 2021-04-01

* Added `TransactionsDataTableBuilder.includeIds()`

## v3.9.3 — 2021-03-31

* Added `Book.getLockDate()`
* Added `Book.setLockDate()`

## v3.9.2 — 2021-03-26

* Added `BalancesDataTableBuilder.period()`

## v3.9.1 — 2021-03-23

* Added `Balance.getCumulativeCredit()`
* Added `Balance.getCumulativeDebit()`
* Added `Balance.getPeriodCredit()`
* Added `Balance.getPeriodDebit()`
* Added `BalancesDataTableBuilder.trial()`
* Added `BalancesContainer.getCumulativeCredit()`
* Added `BalancesContainer.getCumulativeCreditText()`
* Added `BalancesContainer.getCumulativeDebit()`
* Added `BalancesContainer.getCumulativeDebitText()`

## v3.8.7 — 2021-03-11

* Added `Transaction.getPropertyKeys()`
* Added `TransactionsDataTableBuilder.includeProperties()`

## v3.8.1 — 2021-01-18

* Added `Bkper.newAmount()`

## v3.8.0 — 2021-01-18

* Added `Amount`

## v3.7.3 — 2020-12-13

* Added `Book.setName()`
* Added `Book.setDatePattern()`
* Added `Book.setDecimalSeparator()`
* Added `Book.setFractionDigits()`
* Added `Book.setProperties()`
* Added `Book.setProperty()`
* Added `Book.setTimeZone()`
* Added `Book.update()`

## v3.7.1 — 2020-12-10

* Added `Book.getFile()`

## v3.7.0 — 2020-11-29

* Added `Book.newFile()`
* Added `File.getSize()`
* Added `File.getContent()`
* Added `File.getBlob()`
* Added `File.setContent()`
* Added `File.setBlob()`
* Added `File.setContentType()`
* Added `File.setName()`
* Added `File.create()`
* Added `Transaction.addFile()`

## v3.6.8 — 2020-11-26

* Added `Transaction.getAgentId()`

## v3.6.6 — 2020-10-23

* Added `Book.parseValue()`

## v3.6.5 — 2020-10-22

* Added `Book.batchCreateTransactions()`
* Added `Book.batchCreateAccounts()`
* Added `Book.batchCreateGroups()`
* Deprecated `Book.record()`
* Deprecated `Book.createGroups()`
* Deprecated `Book.createAccounts()`

## v3.6.4 — 2020-10-15

* Improved `Transaction.setDate()` to accept Date object
* Improved `Transaction.setAmount()` to accept string

## v3.6.3 — 2020-10-05

* Added `Book.audit()`

## v3.6.2 — 2020-10-01

* Added `Account.deleteProperty()`
* Added `Group.deleteProperty()`
* Added `Transaction.deleteProperty()`

## v3.6.1 — 2020-09-18

* Added `Group.isHidden()`
* Added `Group.setHidden()`

## v3.6.0 — 2020-09-10

* Added `Transaction.getProperties()`
* Added `Transaction.getProperty()`
* Added `Transaction.setProperty()`
* Added `Transaction.setProperties()`

## v3.5.9 — 2020-08-24

* Deprecated `BalancesDataTableBuilder.hideNames()`

## v3.5.8 — 2020-08-23

* Added `Account.hasTransactionPosted()`

## v3.5.4 — 2020-08-19

* Added `Transaction.getRemoteIds()`
* Added `Transaction.addRemoteId()`

## v3.5.3 — 2020-08-18

* Added `Account.isArchived()`
* Added `Account.setArchived()`

## v3.5.2 — 2020-08-18

* Added `Account.setProperties()`
* Added `Group.setProperties()`

## v3.5.0 — 2020-08-17

* Added `Book.newTransaction()`
* Added `Book.newAccount()`
* Added `Book.newGroup()`
* Added `Account.setName()`
* Added `Account.setType()`
* Added `Account.setProperty()`
* Added `Account.addGroup()`
* Added `Account.setGroups()`
* Added `Account.removeGroup()`
* Added `Account.create()`
* Added `Account.update()`
* Added `Account.delete()`
* Added `Group.setName()`
* Added `Group.setProperty()`
* Added `Group.create()`
* Added `Group.update()`
* Added `Group.delete()`
* Added `Transaction.setUrls()`
* Added `Transaction.addUrl()`
* Added `Transaction.create()`
* Added `Transaction.post()`
* Added `Transaction.update()`
* Deprecated `Book.createAccount()`
* Deprecated `Account.isActive()`

## v3.3.0 — 2020-08-13

* Added `Book.getTransaction()`

## v3.2.0 — 2020-08-12

* Added `Transaction.setCreditAccount()`
* Added `Transaction.from()`
* Added `Transaction.setDebitAccount()`
* Added `Transaction.to()`
* Added `Transaction.setDescription()`
* Added `Transaction.remove()`
* Added `Transaction.restore()`
* Added `Transaction.isChecked()`
* Added `Transaction.isTrashed()`
* Added `Transaction.getDate()`
* Added `Transaction.setDate()`
* Added `Transaction.getDateObject()`
* Added `Transaction.getDateValue()`
* Added `Transaction.getDateFormatted()`
* Added `Transaction.getCreatedAt()`
* Added `Transaction.getCreatedAtFormatted()`
* Deprecated `Transaction.getInformedDateValue()`
* Deprecated `Transaction.getInformedDateText()`
* Deprecated `Transaction.getPostDate()`
* Deprecated `Transaction.getPostDateText()`

## v3.1.0 — 2020-08-11

* Added `Transaction.check()`
* Added `Transaction.uncheck()`

## v3.0.3 — 2020-08-09

* Added `File`
* Added `Transaction.getFiles()`

## v1.11.0 — 2020-07-22

* Added `Collection`
* Added `Book.getCollection()`

## v1.10.0 — 2020-07-19

* Added `Book.createAccounts()`
* Added `Book.createGroups()`

## v1.9.0 — 2020-07-16

* Added `AccountType`
* Added `Account.getType()`
* Added `AccountsDataTableBuilder`
* Added `Book.createAccountsDataTable()`

## v1.8.4 — 2020-07-02

* Added `BalancesDataTableBuilder.hideDates()`

## v1.8.2 — 2020-06-23

* Added `Book.round()`

## v1.8.1 — 2020-06-15

* Added `Account.getGroups()`

## v1.8.0 — 2020-06-15

* Added `Group.getProperties()`
* Added `Group.getProperty()`

## v1.6.2 — 2020-04-07

* Added `Bkper.setOAuthTokenProvider()`

## v1.6.0 — 2020-04-07

* Added `OAuthTokenProvider` interface to allow custom OAuth token providers

## v1.5.1 — 2020-04-06

* Added `Bkper.setApiKey()`

## v1.3.3 — 2020-03-14

* Added `Account.getProperties()`
* Added `Account.getProperty()`
* Added `Book.getProperties()`
* Added `Book.getProperty()`

## v1.2.0 — 2019-11-12

* Added `BalanceCheckedType` enum
* Added `BalancesReport.getBalanceCheckedType()`
* Added `Balance.getCheckedCumulativeBalance()`
* Added `Balance.getUncheckedCumulativeBalance()`
* Added `Balance.getCheckedPeriodBalance()`
* Added `Balance.getUncheckedPeriodBalance()`

## Unversioned history

* Added `Transaction.getInformedDateText()` (December 2015)
* Added `Transaction.getInformedDateValue()` (December 2015)
* Added `Book.getTimeZone()` (December 2015)
* Added `Book.getTimeZoneOffset()` (December 2015)
* Added `Book.getFractionDigits()` (May 2015)
* Added `BalanceReport` (May 2015)
* Added `BalancesDataTableBuilder` (May 2015)
* Renamed Ledger object to Book (March 2015)
* Added `Bkper.openById()` (March 2015)
* Added `Bkper.listBooks()` (March 2015)
* Deprecated `Bkper.openLedgerById()` (March 2015)
* Deprecated `Bkper.listLedgers()` (March 2015)
* Added `Account.getDescription()` (March 2015)
* Added `Ledger.formatValue()` (March 2015)
* Added "timeZone" optional param to Ledger.record (November 2014)
* Removed "referencesToTransactionId" param from Ledger.record (November 2014)
* Added `BalancesDataTableBuilder.formatDate()` (October 2014)
* Added `BalancesDataTableBuilder.formatValue()` (October 2014)
* Added `BalancesDataTableBuilder.buildChartDataTable()` (October 2014)
* `Account.get()` (October 2014)
* Balance gets representative balance by default (October 2014)
* `Transaction.getAccountBalance()` gets representative balance by default (October 2014)
* Added `Transaction.getOther()` (October 2014)
* `AccountName(account)` (October 2014)
* Added `Ledger.getDatePattern()` (October 2014)
* Added `Ledger.getDecimalSeparator()` (October 2014)
* Deprecated `Ledger.getLocale()` (October 2014)
* List Balances (October 2014)
* List Transactions (October 2014)
* Record Transactions (October 2014)
* Added "representative" param to `Account.getBalance()` (September 2014)
* Added `Transaction.getOtherAccount(account)` (September 2014)
* Added `Transaction.getCreditAmount()` and `Transaction.getDebitAmount()` (September 2014)
* Added "representative" param to `Transaction.getAccountBalance()` (September 2014)
* Added `Transaction.getAttachmentUrl()` (September 2014)
* Removed `Ledger.getTransactionById()` (September 2014)
