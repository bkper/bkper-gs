/**
 * The Periodicity of the query. It may depend on the level of granularity you write the range params.
 * 
 * @public
 */
enum Periodicity {

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
  YEARLY = "YEARLY"
}

/**
 * Decimal separator of numbers on book
 * 
 * @public
 */
enum DecimalSeparator {

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
 * 
 * @public
 */

enum Permission {

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
  RECORDER = "RECORDER",

  /**
   * View transactions, accounts, record and delete drafts
   */
  POSTER = "POSTER",

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
 * Enum that represents account types.
 * 
 * @public
 */
enum AccountType {

  /**
   * Asset account type
   */
  ASSET = "ASSET",

  /**
   * Liability account type
   */
  LIABILITY = "LIABILITY",

  /**
   * Incoming account type
   */
  INCOMING = "INCOMING",  

  /**
   * Outgoing account type
   */
  OUTGOING = "OUTGOING"
}

/**
 * Enum that represents balance types.
 * 
 * @public
 */
enum BalanceType {

  /**
   * Total balance
   */
  TOTAL = "TOTAL",

  /**
   * Period balance
   */
  PERIOD = "PERIOD",

  /**
   * Cumulative balance
   */
  CUMULATIVE = "CUMULATIVE"
}
