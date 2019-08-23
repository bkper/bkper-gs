// Type definitions for BkperApp
// Project: https://developers.bkper.com
// Definitions by: maelcaldas <https://github.com/maelcaldas>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.2

/// <reference types="google-apps-script" />

declare namespace Bkper {


  export interface BkperApp {

    /**
     * Returns the [[Book]] with the specified bookId from url param.
     *
     * This is the main Entry Point to start interacting with BkperApp
     *
     * Example:
     *
     * ```
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
   * It contains all [[Account]]s where [[Transaction]]s are recorded/posted;
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
     * @return The permission for the current user
     */
    getPermission(): Enums.Permission

  }

  /**
   * 
   * This class defines an [Account](https://en.wikipedia.org/wiki/Account_(bookkeeping)) of a [[Book]].
   * 
   * It mantains a balance of all amount [credited and debited](http://en.wikipedia.org/wiki/Debits_and_credits) in it by [[Transaction]]s.
   * 
   * An Account can be grouped by [[Group]]s.
   * 
   */
  export interface Account {

    /**
     * @returns The name of this Account without spaces and special characters
     */
    getNormalizedName(): string;

    /**
     * Gets the balance based on credit nature of this Account
     *  
     * @param raw True to get the raw balance, no matter the credit nature of this Account.
     * 
     * @returns The balance of this Account
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
}

declare var BkperApp: Bkper.BkperApp;

