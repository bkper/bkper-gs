/// <reference path="ResourceProperty.ts" />

/**
 * 
 * This class defines an [Account](https://en.wikipedia.org/wiki/Account_(bookkeeping)) of a [[Book]].
 * 
 * It mantains a balance of all amount [credited and debited](http://en.wikipedia.org/wiki/Debits_and_credits) in it by [[Transactions]].
 * 
 * An Account can be grouped by [[Groups]].
 * 
 * @public
 */
class Account extends ResourceProperty<bkper.Account> {

    book: Book;

    /**
     * Gets the account internal id.
     */
    public getId(): string {
        return this.payload.id;
    }

    /**
     * Gets the account name.
     */
    public getName(): string {
        return this.payload.name;
    }

    /**
     * 
     * Sets the name of the Account.
     * 
     * @returns This Account, for chainning.
     */
    public setName(name: string): Account {
        this.payload.name = name;
        return this;
    }


    /**
     * @returns The name of this account without spaces or special characters.
     */
    public getNormalizedName(): string {
        if (this.payload.normalizedName) {
            return this.payload.normalizedName;
        } else {
            return Utils_.normalizeText(this.getName())
        }
    }

    /**
     * @return The type for of this account.
     */
    public getType(): AccountType {
        return this.payload.type as AccountType;
    }

    /**
     * 
     * Sets the type of the Account.
     * 
     * @returns This Account, for chainning
     */
    public setType(type: AccountType): Account {
        this.payload.type = type;
        return this;
    }

    /**
     * Gets the balance on the current month, based on the credit nature of this Account.
     * @returns The balance of this account.
     */
    public getBalance(): Amount {
        return this.book.getBalancesReport(`account:'${this.payload.name}' on:$m`).getBalancesContainer(this.payload.name).getCumulativeBalance();
    }

    /**
     * Gets the raw balance on the current month, no matter the credit nature of this Account.
     * @returns The balance of this account.
     */
    public getBalanceRaw(): Amount {
        return this.book.getBalancesReport(`account:'${this.payload.name}' on:$m`).getBalancesContainer(this.payload.name).getCumulativeBalanceRaw();
    }

    /**
     * Tell if this account is archived.
     */
    public isArchived(): boolean {
        return this.payload.archived;
    }

    /**
     * Set account archived/unarchived.
     * 
     * @returns This Account, for chainning.
     */
    public setArchived(archived: boolean): Account {
        this.payload.archived = archived;
        return this;
    }

    /**
     * Tell if the Account has any transaction already posted.
     * 
     * Accounts with transaction posted, even with zero balance, can only be archived.
     */
    public hasTransactionPosted(): boolean {
        return this.payload.hasTransactionPosted;
    }


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
     */
    public isPermanent(): boolean {
        return this.payload.permanent;
    }

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
    public isCredit(): boolean {
        return this.payload.credit;
    }


    /**
     * Get the [[Groups]] of this account.
     */
    public getGroups(): Group[] {
        let groups = new Array<Group>();
        if (this.payload.groups != null) {
            for (var i = 0; i < this.payload.groups.length; i++) {
                let groupId = this.payload.groups[i];
                let group = this.book.getGroup(groupId.id);
                if (group) {
                    groups.push(group);
                }
            }
        }
        return groups;
    }

    /**
     * Sets the groups of the Account.
     * 
     * @returns This Account, for chainning.
     */
    public setGroups(groups: string[] | Group[]): Account {
        this.payload.groups = null;
        if (groups != null) {
            groups.forEach((group: string | Group) => this.addGroup(group))
        }
        return this;
    }

    /**
     * Add a group to the Account.
     * 
     * @returns This Account, for chainning.
     */
    public addGroup(group: string | Group): Account {
        if (this.payload.groups == null) {
            this.payload.groups = [];
        }

        let groupObject: Group = null;
        if (group instanceof Group) {
            groupObject = group;
        } else if (typeof group == "string") {
            groupObject = this.book.getGroup(group);
        }

        if (groupObject) {
            this.payload.groups.push(groupObject.payload)
        }

        return this;
    }

    /**
     * Remove a group from the Account.
     */
    public removeGroup(group: string | Group): Account {

        if (this.payload.groups != null) {
            let groupObject: Group = null;
            if (group instanceof Group) {
                groupObject = group;
            } else if (typeof group == "string") {
                groupObject = this.book.getGroup(group);
            }
            if (groupObject) {
                for (let i = 0; i < this.payload.groups.length; i++) {
                    const group = this.payload.groups[i];
                    if (group.id == groupObject.getId()) {
                        this.payload.groups.splice(i, 1);
                    }
                }
            }
        }

        return this;

    }

    /**
     * Tell if this account is in the [[Group]]
     * 
     * @param  group The Group name, id or object
     */
    public isInGroup(group: string | Group): boolean {
        if (group == null) {
            return false;
        }

        //Group object
        if (group instanceof Group) {
            return this.isInGroupObject_(group);
        }

        //id or name
        var foundGroup = this.book.getGroup(group);
        if (foundGroup == null) {
            return false;
        }
        return this.isInGroupObject_(foundGroup);
    }

    private isInGroupObject_(group: Group): boolean {
        if (this.payload.groups == null) {
            return false;
        }

        for (var i = 0; i < this.payload.groups.length; i++) {
            if (this.payload.groups[i].id == group.getId()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Perform create new account.
     * 
     * @returns The created Account, for chainning.
     */
    public create(): Account {
        try {
            this.payload = AccountService_.createAccount(this.book.getId(), this.payload);
            this.book.clearCache();
            return this;
        } catch (err) {
            this.book.clearCache();
            const account = this.book.getAccount(this.payload.name);
            if (account) {
                this.payload = account.payload;
                return this;
            } else {
                throw err;
            }
        }
    }

    /**
     * Perform update account, applying pending changes.
     */
    public update(): Account {
        this.payload = AccountService_.updateAccount(this.book.getId(), this.payload);
        this.book.clearCache();
        return this;

    }

    /**
     * Perform delete account.
     */
    public remove(): Account {
        this.payload = AccountService_.deleteAccount(this.book.getId(), this.payload);
        this.book.clearCache();
        return this;
    }


    //DEPRECATED

    /**
     * Gets the account description
     * 
     * @deprecated Use properties instead
     * 
     */
    public getDescription(): string {
        return this.getProperty('description');
    }

    /**
     * Tell if this account is Active or otherwise Archived.
     * 
     *  @deprecated Use isArchived instead
     */
    public isActive(): boolean {
        return !this.payload.archived;
    };

}
