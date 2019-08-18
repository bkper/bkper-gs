namespace Enums {

  /**
  The Periodicity of the query. It may depend on the way you write the range params.
  */
  export enum Periodicity {

    /**
    *Example: after:25/01/1983, before:04/03/2013, after:$d-30, before:$d, after:$d-15/$m 
    */
    DAILY = "DAILY",

    /**
    *Example: after:jan/2013, before:mar/2013, after:$m-1, before:$m
    */
    MONTHLY = "MONTHLY",

    /**
    *Example: on:2013, after:2013, $y
    */
    YARLY = "YARLY"
  }

  export enum DecimalSeparator {
    COMMA = "COMMA",
    DOT = "DOT"
  }
}