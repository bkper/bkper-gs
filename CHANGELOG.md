2025
----

**July 2025**
* Released version 3.37.0
* Fixed `BalancesDataTableBuilder` to only expand all groups when filtering by group
* Updated `BalancesDataTableBuilder.formatDate()` to use ISO YYYY-MM-DD format
* Reverted time table transpose behavior in `BalancesDataTableBuilder.transpose()`


2024
----

**December 2024**
* Added `Group.isLocked()`
* Added `Group.setLocked()`

**November 2024**
* Added `Group.getParentGroupsChain()`
* Added `Collection.setName()`
* Added `Collection.update()`

**January 2024**
* Added `Book.batchUpdateTransactions()`
* Added `Transaction.setChecked()`
* Added `Transaction.isLocked()`

2023
----

**December 2023**
* Added `BotResponseType`
* Added `BotResponse`
* Added `BotResponse.getType()`
* Added `BotResponse.getAgentId()`
* Added `BotResponse.getMessage()`
* Added `Event.getBotResponses()`

**November 2023**
* Added `Event`
* Added `Event.getId()`
* Added `EventIterator`
* Added `EventIterator.getBook()`
* Added `EventIterator.getContinuationToken()`
* Added `EventIterator.hasNext()`
* Added `EventIterator.next()`
* Added `EventIterator.setContinuationToken()`
* Added `Book.getEvents()`

**October 2023**
* Added `Book.countTransactions()`

**August 2023**
* Added `Backlog`
* Added `Backlog.getCount()`
* Added `Book.getBacklog()`

2022
----

**December 2022**
* Added `BalancesDataTableBuilder.properties`

**November 2022**
* Added `BalancesContainer.addBalancesContainer()`
* Added `BalancesContainer.removeBalancesContainer()`

**September 2022**
* Added `Account.getPropertyKeys()`
* Added `AccountsDataTableBuilder.includeGroups()`
* Added `AccountsDataTableBuilder.includeProperties()`
* Added `Book.createGroupsDataTable()`
* Added `Group.getPropertyKeys()`
* Added `GroupsDataTableBuilder`
* Added `GroupsDataTableBuilder.includeProperties()`
* Added `GroupsDataTableBuilder.build()`

**June 2022**
* Added `Group.getRoot()`
* Added `BalancesContainer.getAccountBalancesContainers()`
* Added `BalancesReport.getAccountBalancesContainers()`

**May 2022**
* Added `Book.getTotalTransactions()`
* Added `Book.getTotalTransactionsCurrentMonth()`
* Added `Book.getTotalTransactionsCurrentYear()`
* Added `Book.batchCheckTransactions()`
* Added `Book.batchUncheckTransactions()`
* Added `Book.batchTrashTransactions()`
* Added `Transaction.trash()`
* Added `Transaction.untrash()`
* Deprecated `Transaction.remove()`
* Deprecated `Transaction.restore()`

**April 2022**
* Added `Book.getClosingDate()`
* Added `Book.setClosingDate()`

**February 2022**
* Added `Book.deleteProperty()`
* Added `BalancesContainer.isPermanent()`
* Added `Balance.getCumulativeBalanceRaw()`
* Added `Balance.getPeriodBalanceRaw()`

2021
----

**December 2021**
* Added `Group.isCredit()`
* Added `Group.isPermanent()`
* Added `Group.isMixed()`
* Added `Group.getType()`

**November 2021**
* Added `Book.getPeriodStartMonth()`
* Added `Book.setPeriodStartMonth()`
* Added `Month`

**September 2021**
* Added `Book.parseDate()`
* Added `Book.parseAmount()`
* Added `Book.formatAmount()`
* Deprecated `Book.parseValue()`
* Deprecated `Book.formatValue()`

**May 2021**
* Added `Group.getParent()`
* Added `Group.hasChildren()`
* Added `BalancesContainer.getAccount()`
* Added `BalancesContainer.getGroup()`
* Added `BalancesContainer.getParent()`
* Added `BalancesContainer.isFromAccount()`
* Added `BalancesContainer.isFromGroup()`
* Added `BalancesContainer.hasGroupBalances()`
* Added `BalancesContainer.getProperties()`
* Added `BalancesContainer.getProperty()`

**April 2021**
* Added `Book.getLockDate()`
* Added `Book.setLockDate()`
* Added `TransactionsDataTableBuilder.includeIds()`
* Added `BalancesContainer.getCumulativeBalanceRaw()`
* Added `BalancesContainer.getCumulativeBalanceRawText()`
* Added `BalancesDataTableBuilder.raw()`
* Added `Account.getGetBalanceRaw()`

**March 2021**
* Added `Balance.getCumulativeCredit()`
* Added `Balance.getCumulativeDebit()`
* Added `Balance.getPeriodCredit()`
* Added `Balance.getPeriodDebit()`
* Added `BalancesDataTableBuilder.trial()`
* Added `BalancesDataTableBuilder.period()`
* Added `BalancesContainer.getCumulativeCredit()`
* Added `BalancesContainer.getCumulativeCreditText()`
* Added `BalancesContainer.getCumulativeDebit()`
* Added `BalancesContainer.getCumulativeDebitText()`
* Added `Transaction.getPropertyKeys()`
* Added `TransactionsDataTableBuilder.includeProperties()`

**January 2021**
* Added `Amount`
* Added `Bkper.newAmount()`

2020
----

**December 2020**
* Added `Book.getFile()`
* Added `Book.setName()`
* Added `Book.setDatePattern()`
* Added `Book.setDecimalSeparator()`
* Added `Book.setFractionDigits()`
* Added `Book.setProperties()`
* Added `Book.setProperty()`
* Added `Book.setTimeZone()`
* Added `Book.update()`

**November 2020**
* Added `Book.newFile()`
* Added `File.getSize()`
* Added `File.getContent()`
* Added `File.getBlob()`
* Added `File.setContent()`
* Added `File.setBlob()`
* Added `File.setContentType()`
* Added `File.setName()`
* Added `File.create()`
* Added `Transaction.getAgentId()`
* Added `Transaction.addFile()`

**October 2020**
* Added `Book.audit()`
* Added `Book.batchCreateTransactions()`
* Added `Book.batchCreateAccounts()`
* Added `Book.batchCreateGroups()`
* Added `Book.parseValue()`
* Added `Account.deleteProperty()`
* Added `Group.deleteProperty()`
* Added `Transaction.deleteProperty()`
* Improved `Transaction.setDate()` to accept Date object
* Improved `Transaction.setAmount()` to accept string
* Deprecated `Book.record()`
* Deprecated `Book.createGroups()`
* Deprecated `Book.createAccounts()`

**September 2020**
* Added `Transaction.getProperties()`
* Added `Transaction.getProperty()`
* Added `Transaction.setProperty()`
* Added `Transaction.setProperties()`
* Added `Group.isHidden()`
* Added `Group.setHidden()`

**August 2020**
* Added `File`
* Added `Book.getTransaction()`
* Added `Book.newTransaction()`
* Added `Book.newAccount()`
* Added `Book.newGroup()`
* Added `Account.setName()`
* Added `Account.isArchived()`
* Added `Account.setArchived()`
* Added `Account.hasTransactionPosted()`
* Added `Account.setType()`
* Added `Account.setProperty()`
* Added `Account.setProperties()`
* Added `Account.addGroup()`
* Added `Account.setGroups()`
* Added `Account.removeGroup()`
* Added `Account.create()`
* Added `Account.update()`
* Added `Account.delete()`
* Added `Group.setName()`
* Added `Group.setProperty()`
* Added `Group.setProperties()`
* Added `Group.create()`
* Added `Group.update()`
* Added `Group.delete()`
* Added `Transaction.getFiles()`
* Added `Transaction.setCreditAccount()`
* Added `Transaction.from()`
* Added `Transaction.setDebitAccount()`
* Added `Transaction.to()`
* Added `Transaction.setDescription()`
* Added `Transaction.setUrls()`
* Added `Transaction.addUrl()`
* Added `Transaction.getRemoteIds()`
* Added `Transaction.addRemoteId()`
* Added `Transaction.create()`
* Added `Transaction.post()`
* Added `Transaction.update()`
* Added `Transaction.check()`
* Added `Transaction.uncheck()`
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
* Deprecated `BalancesDataTableBuilder.hideNames()`
* Deprecated `Transaction.getInformedDateValue()`
* Deprecated `Transaction.getInformedDateText()`
* Deprecated `Transaction.getPostDate()`
* Deprecated `Transaction.getPostDateText()`
* Deprecated `Book.createAccount()`
* Deprecated `Account.isActive()`

**July 2020**
* Added `Collection`
* Added `AccountType`
* Added `Account.getType()`
* Added `AccountsDataTableBuilder`
* Added `Book.createAccountsDataTable()`
* Added `Book.createAccounts()`
* Added `Book.createGroups()`
* Added `Book.getCollection()`
* Added `BalancesDataTableBuilder.hideDates()`

**June 2020**
* Added `Group.getProperties()`
* Added `Group.getProperty()`
* Added `Account.getGroups()`
* Added `Book.round()`

**March 2020**
* Added `Bkper.setApiKey()`
* Added `OAuthTokenProvider` interface to allow custom OAuth token providers
* Added `Bkper.setOAuthTokenProvider()`

**February 2020**
* Added `Account.getProperties()`
* Added `Account.getProperty()`
* Added `Book.getProperties()`
* Added `Book.getProperty()`

2019
----

**November 2019**
* Added `BalanceCheckedType` enum
* Added `BalancesReport.getBalanceCheckedType()`
* Added `Balance.getCheckedCumulativeBalance()`
* Added `Balance.getUncheckedCumulativeBalance()`
* Added `Balance.getCheckedPeriodBalance()`
* Added `Balance.getUncheckedPeriodBalance()`

2015
----

**December 2015**
* Added `Transaction.getInformedDateText()`
* Added `Transaction.getInformedDateValue()`
* Added `Book.getTimeZone()`
* Added `Book.getTimeZoneOffset()`

**May 2015**
* Added `Book.getFractionDigits()`
* Added `BalanceReport`
* Added `BalancesDataTableBuilder`

**March 2015**
* Renamed Ledger object to Book
* Added `Bkper.openById()`
* Added `Bkper.listBooks()`
* Deprecated `Bkper.openLedgerById()`
* Deprecated `Bkper.listLedgers()`
* Added `Account.getDescription()`
* Added `Ledger.formatValue()`

2014
----

**November 2014**
* Added "timeZone" optional param to Ledger.record
* Removed "referencesToTransactionId" param from Ledger.record

**October 2014**
* Added `BalancesDataTableBuilder.formatDate()`
* Added `BalancesDataTableBuilder.formatValue()`
* Added `BalancesDataTableBuilder.buildChartDataTable()`
* `Account.get()`
* Balance gets representative balance by default
* `Transaction.getAccountBalance()` gets representative balance by default
* Added `Transaction.getOther()`
* `AccountName(account)`
* Added `Ledger.getDatePattern()`
* Added `Ledger.getDecimalSeparator()`
* Deprecated `Ledger.getLocale()`
* List Balances
* List Transactions
* Record Transactions

**September 2014**
* Added "representative" param to `Account.getBalance()`
* Added `Transaction.getOtherAccount(account)`
* Added `Transaction.getCreditAmount()` and `Transaction.getDebitAmount()`
* Added "representative" param to `Transaction.getAccountBalance()`
* Added `Transaction.getAttachmentUrl()`
* Removed `Ledger.getTransactionById()`