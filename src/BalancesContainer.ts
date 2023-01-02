/**
 * The container of balances of an [[Account]] or [[Group]]
 * 
 * The container is composed of a list of [[Balances]] for a window of time, as well as its period and cumulative totals.
 * 
 * @public
 */
interface BalancesContainer {

    /**
     * The parent BalancesReport of the container
     */
    getBalancesReport(): BalancesReport;

    /**
     * The [[Account]] or [[Group]] name
     */
    getName(): string;

    /**
     * The [[Account]] or [[Group]] name without spaces or special characters.
     */
    getNormalizedName(): string;

    /**
     * The [[Group]] associated with this container
     */
    getGroup(): Group;

    /**
     * The [[Account]] associated with this container
     */
    getAccount(): Account;

    getDepth(): number;

    /**
     * All [[Balances]] of the container
     */
    getBalances(): Balance[];

    /**
     * The parent BalanceContainer
     */
    getParent(): BalancesContainer;

    /**
     * Gets the credit nature of the BalancesContainer, based on [[Account]] or [[Group]].
     * 
     * For [[Account]], the credit nature will be the same as the one from the Account
     * 
     * For [[Group]], the credit nature will be the same, if all accounts containing on it has the same credit nature. False if mixed.
     * 
     */
    isCredit(): boolean;

    /**
     * 
     * Tell if this balance container is permament, based on the [[Account]] or [[Group]].
     * 
     * Permanent are the ones which final balance is relevant and keep its balances over time.
     *  
     * They are also called [Real Accounts](http://en.wikipedia.org/wiki/Account_(accountancy)#Based_on_periodicity_of_flow)
     * 
     * Usually represents assets or liabilities, capable of being perceived by the senses or the mind, like bank accounts, money, debts and so on.
     * 
     * @returns True if its a permanent Account
     */
    isPermanent(): boolean;

    /**
     * Tell if this balance container if from an [[Account]] 
     */
    isFromAccount(): boolean;

    /**
     * Tell if this balance container if from a [[Group]] 
     */
    isFromGroup(): boolean;

    /**
     * Tell if the balance container is from a parent group
     */
    hasGroupBalances(): boolean;

    /**
     * The cumulative balance to the date.
     */
    getCumulativeBalance(): Amount;

    /**
     * The cumulative raw balance to the date.
     */
    getCumulativeBalanceRaw(): Amount;

    /**
     * The cumulative credit to the date.
     */
    getCumulativeCredit(): Amount;

    /**
     * The cumulative debit to the date.
     */
    getCumulativeDebit(): Amount;

    /**
     * The cumulative balance formatted according to [[Book]] decimal format and fraction digits.
     */
    getCumulativeBalanceText(): string;

    /**
     * The cumulative raw balance formatted according to [[Book]] decimal format and fraction digits.
     */
    getCumulativeBalanceRawText(): string;

    /**
     * The cumulative credit formatted according to [[Book]] decimal format and fraction digits.
     */
    getCumulativeCreditText(): string;

    /**
     * The cumulative credit formatted according to [[Book]] decimal format and fraction digits.
     */
    getCumulativeDebitText(): string;

    /**
     * The balance on the date period.
     */
    getPeriodBalance(): Amount;

    /**
     * The raw balance on the date period.
     */
    getPeriodBalanceRaw(): Amount;

    /**
     * The credit on the date period.
     */
    getPeriodCredit(): Amount;

    /**
     * The debit on the date period.
     */
    getPeriodDebit(): Amount;

    /**
     * The balance on the date period formatted according to [[Book]] decimal format and fraction digits
     */
    getPeriodBalanceText(): string;

    /**
     * The raw balance on the date period formatted according to [[Book]] decimal format and fraction digits
     */
    getPeriodBalanceRawText(): string;

    /**
     * The credit on the date period formatted according to [[Book]] decimal format and fraction digits
     */
    getPeriodCreditText(): string;

    /**
     * The debit on the date period formatted according to [[Book]] decimal format and fraction digits
     */
    getPeriodDebitText(): string;

    /**
     * Gets all child [[BalancesContainers]].
     * 
     * **NOTE**: Only for Group balance containers. Accounts returns null.
     */
    getBalancesContainers(): BalancesContainer[];

    /**
     * Gets a specific [[BalancesContainer]].
     */
    getBalancesContainer(name: string): BalancesContainer;

    /**
     * Gets all [[Account]] [[BalancesContainers]]. 
     */
    getAccountBalancesContainers(): BalancesContainer[];

    /**
     * Creates a BalancesDataTableBuilder to generate a two-dimensional array with all [[BalancesContainers]]
     */
    createDataTable(): BalancesDataTableBuilder;

    /**
     * Gets the custom properties stored in this Account or Group.
     */
    getProperties(): { [key: string]: string };

    /**
     * 
     * Gets the property value for given keys. First property found will be retrieved
     * 
     * @param keys The property key
     */
    getProperty(...keys: string[]): string;


    /**
     * Gets the custom properties keys stored in the associated [[Account]] or [[Group]].
     */
    getPropertyKeys(): string[];

    /**
     * Adds an [[Account]] container to a [[Group]] container.
     * 
     * **NOTE**: Only for Group balance containers.
     * 
     * @param container The account container to be added
     */
    addBalancesContainer(container: BalancesContainer): BalancesContainer;

    /**
     * Removes an [[Account]] container from a [[Group]] container.
     * 
     * **NOTE**: Only for Group balance containers.
     * 
     * @param container The account container to be removed
     */
    removeBalancesContainer(container: BalancesContainer): BalancesContainer;

}
