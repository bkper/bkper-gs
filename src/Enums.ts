
  /**
   * The Periodicity of the query. It may depend on the way you write the range params.
   */
  enum Periodicity {

    /**
     *Example: after:25/01/1983, before:04/03/2013, after:$d-30, before:$d, after:$d-15/$m 
     */
    DAILY = "DAILY",

    /**
     * Example: after:jan/2013, before:mar/2013, after:$m-1, before:$m
     */
    MONTHLY = "MONTHLY",

    /**
     * Example: on:2013, after:2013, $y
     */
    YARLY = "YARLY"
  }

  enum DecimalSeparator {
    COMMA = "COMMA",
    DOT = "DOT"
  }

  enum Permission {
    NONE = "NONE",
    VIEWER = "VIEWER",
    POST = "POST",
    EDITOR = "EDITOR",
    OWNER = "OWNER"
  }

  /**
   * Enum that represents balance types.
   */
  enum BalanceType {
    TOTAL = "TOTAL",
    PERIOD = "PERIOD",
    CUMULATIVE = "CUMULATIVE"
  }