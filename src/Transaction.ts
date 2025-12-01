/**
* 
* This class defines a Transaction between [credit and debit](http://en.wikipedia.org/wiki/Debits_and_credits) [[Accounts]].
*
* A Transaction is the main entity on the [Double Entry](http://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) [Bookkeeping](http://en.wikipedia.org/wiki/Bookkeeping) system.
* 
* @public
*/
class Transaction {

    wrapped: bkper.Transaction

    book: Book;

    /** @internal */
    private pendingFiles: Map<string, File> = new Map();

    /**
     * @returns The id of the Transaction.
     */
    public getId(): string {
        return this.wrapped.id;
    }

    /**
     * @returns The id of the agent that created this transaction
     */
    public getAgentId(): string {
        return this.wrapped.agentId;
    }

    /**
     * Remote ids are used to avoid duplication.
     * 
     * @returns The remote ids of the Transaction.
     */
    public getRemoteIds(): string[] {
        return this.wrapped.remoteIds;
    }

    /**
     * Add a remote id to the Transaction.
     * 
     * @param remoteId The remote id to add.
     * 
     * @returns This Transaction, for chainning.
     */
    public addRemoteId(remoteId: string): Transaction {
        if (this.wrapped.remoteIds == null) {
            this.wrapped.remoteIds = [];
        }
        if (remoteId) {
            this.wrapped.remoteIds.push(remoteId);
        }
        return this;
    }

    /**
     * @returns True if transaction was already posted to the accounts. False if is still a Draft.
     */
    public isPosted(): boolean {
        return this.wrapped.posted;
    }

    /**
     * @returns True if transaction is checked.
     */
    public isChecked(): boolean {
        return this.wrapped.checked;
    }

    /**
      * Set the check state of the Transaction.
      * 
      * @param checked - The check state.
      * 
      * @returns This Transaction, for chainning.
    */
    public setChecked(checked: boolean): Transaction {
        this.wrapped.checked = checked;
        return this;
    }

    /**
     * @returns True if transaction is in trash.
     */
    public isTrashed(): boolean {
        return this.wrapped.trashed;
    }

    /**
     * @returns True if a transaction is locked by the book lock/closing date
     */
    public isLocked(): boolean {
        const date = this.getDate() || Utils_.formatDateISO(new Date(), this.book.getTimeZone());
        const lockOrClosingDate = this.book.getMostRecentLockDate_();
        return lockOrClosingDate != null && (Utils_.getIsoDateValue(lockOrClosingDate) >= Utils_.getIsoDateValue(date));
    }

    /**
     * @returns All #hashtags used on the transaction.
     */
    public getTags(): string[] {
        return this.wrapped.tags;
    }


    /**
     * @returns All urls of the transaction.
     */
    public getUrls(): string[] {
        return this.wrapped.urls;
    }

    /**
     * Set the Transaction urls. Url starts with https://
     * 
     * @param urls The urls array.
     * 
     * @returns This Transaction, for chainning.
     */
    public setUrls(urls: string[]): Transaction {
        this.wrapped.urls = null;
        if (urls) {
            urls.forEach(url => {
                this.addUrl(url);
            });
        }
        return this;
    }

    /**
     * Add a url to the Transaction. Url starts with https://
     * 
     * @param url The url to add.
     * 
     * @returns This Transaction, for chainning.
     */
    public addUrl(url: string): Transaction {
        if (this.wrapped.urls == null) {
            this.wrapped.urls = [];
        }
        if (url) {
            this.wrapped.urls.push(url);
        }
        return this;
    }

    /**
     * @returns The files attached to the transaction.
     */
    public getFiles(): File[] {
        if (this.wrapped.files && this.wrapped.files.length > 0) {
            const files = Utils_.wrapObjects(new File(), this.wrapped.files);
            if (files != null) {
                for (const file of files) {
                    file.book = this.book;
                }
            }
            return files
        } else {
            return [];
        }
    }

    /**
     * Add a File attachment to the Transaction.
     *
     * Files not previously created in the Book will be automatically created when the Transaction is persisted.
     *
     * @param file The File to add to this Transaction
     *
     * @returns This Transaction, for chainning.
     */
    public addFile(file: File | GoogleAppsScript.Base.Blob): Transaction {

        //@ts-ignore
        if (file.copyBlob) {
            file = this.book.newFile().setBlob(file as GoogleAppsScript.Base.Blob);
        }
        file = file as File;

        if (this.wrapped.files == null) {
            this.wrapped.files = [];
        }

        // Store file reference for later creation if needed
        const fileId = file.getId();
        const fileBookId = file.book?.getId();
        if (fileId == null || fileBookId != this.book.getId()) {
            // Generate temporary ID if file doesn't have one
            if (fileId == null) {
                file.wrapped.id = `temporary_${Utilities.getUuid()}`;
            }
            this.pendingFiles.set(file.getId(), file);
        }

        this.wrapped.files.push(file.wrapped);
        return this;
    }

    /** @internal */
    private createPendingFiles_(): void {

        if (this.pendingFiles.size === 0) {
            return;
        }

        if (this.wrapped.files == null) {
            this.wrapped.files = [];
        }

        // Create all pending files
        for (const [fileId, file] of this.pendingFiles.entries()) {
            file.book = this.book;
            file.setProperty('upload_method', 'attachment');
            const createdFile = file.create();
            // Update payload with the created file
            const fileIndex = this.wrapped.files.findIndex(f => f.id === fileId);
            if (fileIndex >= 0) {
                this.wrapped.files[fileIndex] = createdFile.wrapped;
            } else {
                this.wrapped.files.push(createdFile.wrapped);
            }
        }

        // Clear pending files after creation
        this.pendingFiles.clear();
    }

    /**
     * Check if the transaction has the specified tag.
     */
    public hasTag(tag: string): boolean {

        var tags = this.getTags();

        for (var i = 0; i < tags.length; i++) {
            if (tags[i] == tag) {
                return true;
            }
        }

        return false;
    }


    /**
     * Gets the custom properties stored in this Transaction.
     */
    public getProperties(): { [key: string]: string } {
        return this.wrapped.properties != null ? { ...this.wrapped.properties } : {};
    }

    /**
     * Gets the custom properties keys stored in this Transaction.
     */
    public getPropertyKeys(): string[] {
        let properties = this.getProperties();
        let propertyKeys: string[] = []
        if (properties) {
            for (var key in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, key)) {
                    propertyKeys.push(key)
                }
            }
        }
        propertyKeys = propertyKeys.sort();
        return propertyKeys;
    }

    /**
     * Set the custom properties of the Transaction
     * 
     * @param properties Object with key/value pair properties
     * 
     * @returns This Transaction, for chainning. 
     */
    public setProperties(properties: { [key: string]: string }): Transaction {
        this.wrapped.properties = { ...properties };
        return this;
    }

    /**
     * Gets the property value for given keys. First property found will be retrieved
     * 
     * @param keys The property key
     */
    public getProperty(...keys: string[]): string {
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
     * Set a custom property in the Transaction.
     * 
     * @param key The property key
     * @param value The property value
     * 
     * @returns This Transaction, for chainning. 
     */
    public setProperty(key: string, value: string): Transaction {
        if (key == null || key.trim() == '') {
            return this;
        }
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
     * @returns This Transaction, for chainning. 
     */
    public deleteProperty(key: string): Transaction {
        this.setProperty(key, null);
        return this;
    }

    /**
     * Checks if a property key represents a hidden property.
     * Hidden properties are those whose keys end with an underscore "_".
     *
     * @param key - The property key to check
     * @returns True if the property is hidden, false otherwise
     */
    private isHiddenProperty(key: string): boolean {
        return key.endsWith('_');
    }

    /**
     * Sets a custom property in this Transaction, filtering out hidden properties.
     * Hidden properties are those whose keys end with an underscore "_".
     *
     * @param key - The property key
     * @param value - The property value, or null/undefined to clean it
     *
     * @returns This Transaction, for chaining
     */
    public setVisibleProperty(key: string, value: string | null | undefined): Transaction {
        if (this.isHiddenProperty(key)) {
            return this;
        }
        return this.setProperty(key, value);
    }

    /**
     * Sets the custom properties of this Transaction, filtering out hidden properties.
     * Hidden properties are those whose keys end with an underscore "_".
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns This Transaction, for chaining
     */
    public setVisibleProperties(properties: { [key: string]: string }): Transaction {
        if (properties == null) {
            return this;
        }
        const filteredProperties: { [key: string]: string } = {};
        for (const key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                if (!this.isHiddenProperty(key)) {
                    filteredProperties[key] = properties[key];
                }
            }
        }
        return this.setProperties(filteredProperties);
    }

    /**
     * Gets the visible custom properties stored in this Transaction.
     * Hidden properties (those ending with "_") are excluded from the result.
     *
     * @returns Object with key/value pair properties, excluding hidden properties
     */
    public getVisibleProperties(): { [key: string]: string } {
        const allProperties = this.getProperties();
        const visibleProperties: { [key: string]: string } = {};
        for (const key in allProperties) {
            if (Object.prototype.hasOwnProperty.call(allProperties, key)) {
                if (!this.isHiddenProperty(key)) {
                    visibleProperties[key] = allProperties[key];
                }
            }
        }
        return visibleProperties;
    }


    //ORIGIN ACCOUNT
    /**
     * @returns The credit account. The same as origin account.
     */
    public getCreditAccount(): Account {
        return this.wrapped.creditAccount != null ? this.book.getAccount(this.wrapped.creditAccount.id) : null;;
    }

    /**
     * @returns The credit account name.
     */
    public getCreditAccountName(): string {
        if (this.getCreditAccount() != null) {
            return this.getCreditAccount().getName();
        } else {
            return "";
        }
    }

    /**
     * 
     * Set the credit/origin Account of the Transaction. Same as from().
     * 
     * @param account Account id, name or object.
     * 
     * @returns This Transaction, for chainning.
     */
    public setCreditAccount(account: string | Account): Transaction {
        if (typeof account == "string") {
            account = this.book.getAccount(account)
        }
        if (account != null && account.getId() != null) {
            this.wrapped.creditAccount = account.wrapped
        }
        return this;
    }

    /**
     * 
     * Set the credit/origin Account of the Transaction. Same as setCreditAccount().
     * 
     * @param account Account id, name or object.
     * 
     * @returns This Transaction, for chainning.
     */
    public from(account: string | Account): Transaction {
        return this.setCreditAccount(account);
    }


    //DESTINATION ACCOUNT
    /**
     * @returns The debit account. The same as destination account.
     * 
     */
    public getDebitAccount(): Account {
        return this.wrapped.debitAccount != null ? this.book.getAccount(this.wrapped.debitAccount.id) : null;
    }

    /**
     * @returns The debit account name.
     */
    public getDebitAccountName(): string {
        if (this.getDebitAccount() != null) {
            return this.getDebitAccount().getName();
        } else {
            return "";
        }
    }

    /**
     * 
     * Set the debit/destination Account of the Transaction. Same as to().
     * 
     * @param account Account id, name or object.
     * 
     * @returns This Transaction, for chainning.
     */
    public setDebitAccount(account: string | Account): Transaction {
        if (typeof account == "string") {
            account = this.book.getAccount(account)
        }
        if (account != null && account.getId() != null) {
            this.wrapped.debitAccount = account.wrapped
        }
        return this;
    }

    /**
     * 
     * Set the debit/destination Account of the Transaction. Same as setDebitAccount().
     * 
     * @param account Account id, name or object.
     * 
     * @returns This Transaction, for chainning.
     */
    public to(account: string | Account): Transaction {
        return this.setDebitAccount(account);
    }


    //AMOUNT
    /**
     * @returns The amount of the transaction.
     */
    public getAmount(): Amount {
        return this.wrapped.amount != null && this.wrapped.amount.trim() != '' ? new Amount(this.wrapped.amount) : null;
    }

    /**
     * 
     * Set the amount of the Transaction.
     * 
     * @returns This Transaction, for chainning.
     */
    public setAmount(amount: Amount | number | string): Transaction {

        if (typeof amount == "string") {
            amount = Utils_.parseValue(amount, this.book.getDecimalSeparator()) + '';
            this.wrapped.amount = amount.toString();
            return this;
        }

        amount = new Amount(amount);

        if (amount.eq(0)) {
            this.wrapped.amount = null;
            return this;
        }

        this.wrapped.amount = amount.abs().toString();

        return this;
    }

    /**
     * Get the absolute amount of this transaction if the given account is at the credit side, else null.
     * 
     * @param account The account object, id or name.
     */
    public getCreditAmount(account: Account | string): Amount {
        let accountObject = this.getAccount_(account);
        if (this.isCredit(accountObject)) {
            return this.getAmount();
        }
        return null;
    }

    /**
     * Gets the absolute amount of this transaction if the given account is at the debit side, else null.
     * 
     * @param account The account object, id or name.
     */
    public getDebitAmount(account: Account | string): Amount {
        let accountObject = this.getAccount_(account);
        if (this.isDebit(accountObject)) {
            return this.getAmount();
        }
        return null;
    }

    /**
     * Gets the [[Account]] at the other side of the transaction given the one in one side.
     * 
     * @param account The account object, id or name.
     */
    public getOtherAccount(account: Account | string): Account {
        let accountObject = this.getAccount_(account);
        if (this.isCredit(accountObject)) {
            return this.getDebitAccount();
        }
        if (this.isDebit(accountObject)) {
            return this.getCreditAccount();
        }
        return null;
    }

    /**
     * 
     * The account name at the other side of the transaction given the one in one side.
     * 
     * @param account The account object, id or name.
     */
    public getOtherAccountName(account: string | Account): string {
        var otherAccount = this.getOtherAccount(account);
        if (otherAccount != null) {
            return otherAccount.getName();
        } else {
            return "";
        }
    }

    /**
     * 
     * Tell if the given account is credit on the transaction
     * 
     * @param account The account object
     */
    public isCredit(account: Account) {
        return this.getCreditAccount() != null && account != null && this.getCreditAccount().getNormalizedName() == account.getNormalizedName();
    }

    /**
     * 
     * Tell if the given account is debit on the transaction
     * 
     * @param account The account object
     */
    public isDebit(account: Account) {
        return this.getDebitAccount() != null && account != null && this.getDebitAccount().getNormalizedName() == account.getNormalizedName();
    }

    private getAccount_(account: Account | string): Account {
        if (account == null || account instanceof Account) {
            return account as Account;
        }
        return this.book.getAccount(account);
    }



    //DESCRIPTION
    /**
     * @returns The description of this transaction.
     */
    public getDescription(): string {
        if (this.wrapped.description == null) {
            return "";
        }
        return this.wrapped.description;
    }

    /**
     * 
     * Set the description of the Transaction.
     * 
     * @returns This Transaction, for chainning.
     */
    public setDescription(description: string): Transaction {
        this.wrapped.description = description;
        return this;
    }


    //DATE

    /**
     * @returns The Transaction date, in ISO format yyyy-MM-dd.
     */
    public getDate(): string {
        return this.wrapped.date;
    }

    /**
     * 
     * Set the date of the Transaction.
     * 
     * @returns This Transaction, for chainning
     */
    public setDate(date: string | Date): Transaction {
        if (typeof date == "string") {
            if (date.indexOf('/') > 0) {
                let dateObject = Utils_.parseDate(date, this.book.getDatePattern(), this.book.getTimeZoneOffset())
                this.wrapped.date = Utils_.formatDateISO(dateObject, this.book.getTimeZone())
            } else if (date.indexOf('-')) {
                this.wrapped.date = date;
            }
        } else if (Object.prototype.toString.call(date) === '[object Date]') {
            this.wrapped.date = Utils_.formatDateISO(date, this.book.getTimeZone())
        }
        return this;
    }

    /**
     * @returns The Transaction Date object, on the time zone of the [[Book]].
     */
    public getDateObject(): Date {
        return Utils_.convertValueToDate(this.getInformedDateValue(), this.book.getTimeZoneOffset());
    }

    /**
     * @returns The Transaction date number, in format YYYYMMDD.
     */
    public getDateValue(): number {
        return this.wrapped.dateValue;
    }

    /**
     * @returns The Transaction date, formatted on the date pattern of the [[Book]].
     */
    public getDateFormatted(): string {
        return this.wrapped.dateFormatted;
    }

    /**
     * @returns The date the transaction was created.
     */
    public getCreatedAt(): Date {
        return new Date(new Number(this.wrapped.createdAt).valueOf());
    }

    /**
     * @returns The date the transaction was created, formatted according to the date pattern of [[Book]].
     */
    public getCreatedAtFormatted(): string {
        return Utilities.formatDate(this.getCreatedAt(), this.book.getTimeZone(), this.book.getDatePattern() + " HH:mm:ss");
    }


    //EVOLVED BALANCES
    private getCaEvolvedBalance_(): Amount {
        return this.wrapped.creditAccount != null && this.wrapped.creditAccount.balance != null ? new Amount(this.wrapped.creditAccount.balance) : null;
    }

    private getDaEvolvedBalance_(): Amount {
        return this.wrapped.debitAccount != null && this.wrapped.debitAccount.balance != null ? new Amount(this.wrapped.debitAccount.balance) : null;
    }

    /**
     * Gets the balance that the [[Account]] has at that day, when listing transactions of that Account.
     * 
     * Evolved balances is returned when searching for transactions of a permanent [[Account]].
     * 
     * Only comes with the last posted transaction of the day.
     * 
     * @param raw True to get the raw balance, no matter the credit nature of the [[Account]].
     */
    public getAccountBalance(raw?: boolean): Amount {
        var accountBalance = this.getCaEvolvedBalance_();
        var isCa = true;
        if (accountBalance == null) {
            accountBalance = this.getDaEvolvedBalance_();
            isCa = false;
        }
        if (accountBalance != null) {
            if (!raw) {
                var account = isCa ? this.getCreditAccount() : this.getDebitAccount();
                accountBalance = Utils_.getRepresentativeValue(accountBalance, account.isCredit());
            }
            return new Amount(accountBalance);
        } else {
            return null;
        }
    }

    /**
     * Perform create new draft transaction.
     */
    public create(): Transaction {
        this.createPendingFiles_();
        let operation = TransactionService_.createTransaction(this.book.getId(), this.wrapped);
        this.wrapped = operation.transaction;
        this.book.updateAccountsCache(operation.accounts);
        return this;
    }

    /**
     * Upddate transaction, applying pending changes.
     */
    public update(): Transaction {
        this.createPendingFiles_();
        let operation = TransactionService_.updateTransaction(this.book.getId(), this.wrapped);
        this.wrapped = operation.transaction;
        this.book.updateAccountsCache(operation.accounts);
        return this;
    }


    /**
     * Perform check transaction.
     */
    public check(): Transaction {
        let operation = TransactionService_.checkTransaction(this.book.getId(), this.wrapped);
        this.wrapped.checked = operation.transaction.checked;
        this.book.updateAccountsCache(operation.accounts);
        return this;
    }

    /**
     * Perform uncheck transaction.
     */
    public uncheck(): Transaction {
        let operation = TransactionService_.uncheckTransaction(this.book.getId(), this.wrapped);
        this.wrapped.checked = operation.transaction.checked;
        this.book.updateAccountsCache(operation.accounts);
        return this;
    }

    /**
     * Perform post transaction, changing credit and debit [[Account]] balances.
     */
    public post(): Transaction {
        this.createPendingFiles_();
        let operation = TransactionService_.postTransaction(this.book.getId(), this.wrapped);
        this.wrapped = operation.transaction;
        this.book.updateAccountsCache(operation.accounts);
        return this;
    }

    /**
     * Perform trash transaction.
     */
    public trash(): Transaction {
        let operation = TransactionService_.trashTransaction(this.book.getId(), this.wrapped);
        this.wrapped.trashed = operation.transaction.trashed;
        this.book.updateAccountsCache(operation.accounts);
        return this;
    }

    /**
     * Perform untrash transaction.
     */
    public untrash(): Transaction {
        let operation = TransactionService_.untrashTransaction(this.book.getId(), this.wrapped);
        this.wrapped.trashed = operation.transaction.trashed;
        this.book.updateAccountsCache(operation.accounts);
        return this;
    }


    //DEPRECATED

    /**
     * Remove the transaction, sending to trash.
     * @deprecated
     */
    public remove(): Transaction {
        let operation = TransactionService_.trashTransaction(this.book.getId(), this.wrapped);
        this.wrapped.trashed = operation.transaction.trashed;
        this.book.updateAccountsCache(operation.accounts);
        return this;
    }

    /**
     * Restore the transaction from trash.
     * @deprecated
     */
    public restore(): Transaction {
        let operation = TransactionService_.untrashTransaction(this.book.getId(), this.wrapped);
        this.wrapped.trashed = operation.transaction.trashed;
        this.book.updateAccountsCache(operation.accounts);
        return this;
    }

    /**
    * @returns The date the user informed for this transaction, adjusted to book's time zone.
    * 
    * @deprecated Use getDateObject instead.
    */
    public getInformedDate(): Date {
        return this.getDateObject();
    }


    /**
     * @returns The date numbe. The number format is YYYYMMDD.
     * 
     * @deprecated use getDateValue instead.
     */
    public getInformedDateValue(): number {
        return this.getDateValue();
    }

    /**
     * @returns The date the user informed for this transaction, formatted according to the date pattern of [[Book]].
     * 
     * @deprecated use getDateFormatted instead
     */
    public getInformedDateText(): string {
        return this.getDateFormatted();
    }


    /**
     * @returns {Date} The date time user has recorded/posted this transaction.
     * 
     * @deprecated use getCreatedAt instead.
     */
    public getPostDate(): Date {
        return this.getCreatedAt();
    }

    /**
     * @returns The date time user has recorded/posted this transaction, formatted according to the date pattern of [[Book]].
     * 
     * @deprecated use getCreatedAtFormatted instead.
     */
    public getPostDateText(): string {
        return this.getCreatedAtFormatted();
    }

    edit(): Transaction {
        return this.update();
    }


}
