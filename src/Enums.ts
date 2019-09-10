/**
 * The Periodicity of the query. It may depend on the level of granularity you write the range params.
 * 
 * @public
 */
enum Periodicity {

  /**
   * Example: after:25/01/1983, before:04/03/2013, after:$d-30, before:$d, after:$d-15/$m 
   * 
   * @public
   */
  DAILY = "DAILY",

  /**
   * Example: after:jan/2013, before:mar/2013, after:$m-1, before:$m
   * 
   * @public
   */
  MONTHLY = "MONTHLY",

  /**
   * Example: on:2013, after:2013, $y
   * 
   * @public
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
   * 
   * @public
   */
  COMMA = "COMMA",

  /**
   * .
   * 
   * @public
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
   * 
   * @public
   */
  NONE = "NONE",

  /**
   * View transactions, accounts and balances.
   * 
   * @public
   */
  VIEWER = "VIEWER",

  /**
   * Record and delete drafts only. Useful to collect data only
   * 
   * @public
   */
  RECORD_ONLY = "RECORD_ONLY",

  /**
   * View transactions, accounts, record and delete drafts
   * 
   * @public
   */
  POST = "POST",

  /**
   * Manage accounts, transactions, book configuration and sharing
   * 
   * @public
   */
  EDITOR = "EDITOR",

  /**
   * Manage everything, including book visibility and deletion. Only one owner per book.
   * 
   * @public
   */
  OWNER = "OWNER"
}

/**
 * Enum that represents balance types.
 * 
 * @public
 */
enum BalanceType {

  /**
   * Total balance
   * 
   * @public
   */
  TOTAL = "TOTAL",

  /**
   * Period balance
   * 
   * @public
   */
  PERIOD = "PERIOD",

  /**
   * Cumulative balance
   * 
   * @public
   */
  CUMULATIVE = "CUMULATIVE"
}