/**
 * This class defines an amount for arbitrary-precision decimal arithmetic.
 * 
 * It inherits methods from [big.js](http://mikemcl.github.io/big.js/) library
 * 
 * @public
 */
class Amount {

  /** @internal */
  private wrapped: Big

  /**
   * The Amount constructor.
   */
  public constructor(n: number | string | Amount) {
    this.checkNumberNotNull(n);
    try {
      if (typeof n == "string") {
        n = n.trim();
        this.wrapped = new Big(n);
      } else if (n instanceof Amount) {
        this.wrapped = new Big(n.wrapped)
      } else if (n.toString) {
        this.wrapped = new Big(n.toString())
      } else {
        this.wrapped = new Big(+n);
      }
    } catch (err) {
      this.throwInvalidAmount(n)
    }
  }

  private throwInvalidAmount(n: any) {
    throw new Error(`Invalid amount: ${n}`);
  }

  /** 
   * Returns an absolute Amount.
   */
  public abs(): Amount {
    let big = this.wrapped.abs();
    return this.wrap(big)
  }

  /**
   * Compare
   */
  public cmp(n: number | string | Amount): -1 | 0 | 1 {
    this.checkNumberNotNull(n);
    try {
      if (typeof n == "string") {
        n = n.trim();
        return this.wrapped.cmp(n);
      } else if (n instanceof Amount) {
        return this.wrapped.cmp(n.wrapped)
      } else if (n.toString) {
        return this.wrapped.cmp(n.toString())
      } else {
        return this.wrapped.cmp(+n);
      }
    } catch (err) {
      this.throwInvalidAmount(n)
    }
  }

  /**
   * Divide by
   */
  public div(n: number | string | Amount): Amount {
    this.checkNumberNotNull(n);
    let big: Big;
    try {
      if (typeof n == "string") {
        n = n.trim();
        big = this.wrapped.div(n);
      } else if (n instanceof Amount) {
        big = this.wrapped.div(n.wrapped)
      } else if (n.toString) {
        big = this.wrapped.div(n.toString())
      } else {
        big = this.wrapped.div(+n);
      }
      return this.wrap(big);
    } catch (err) {
      this.throwInvalidAmount(n)
    }
  }

  /**
   * Equals to
   */
  public eq(n: number | string | Amount): boolean {
    this.checkNumberNotNull(n);
    try {
      if (typeof n == "string") {
        n = n.trim();
        return this.wrapped.eq(n);
      } else if (n instanceof Amount) {
        return this.wrapped.eq(n.wrapped)
      } else if (n.toString) {
        return this.wrapped.eq(n.toString())
      } else {
        return this.wrapped.eq(+n);
      }
    } catch (err) {
      this.throwInvalidAmount(n)
    }
  }

  /**
   * Greater than
   */
  public gt(n: number | string | Amount): boolean {
    this.checkNumberNotNull(n);
    try {
      if (typeof n == "string") {
        n = n.trim();
        return this.wrapped.gt(n);
      } else if (n instanceof Amount) {
        return this.wrapped.gt(n.wrapped)
      } else if (n.toString) {
        return this.wrapped.gt(n.toString())
      } else {
        return this.wrapped.gt(+n);
      }
    } catch (err) {
      this.throwInvalidAmount(n)
    }
  }

  /**
   * Greater than or equal
   */
  public gte(n: number | string | Amount): boolean {
    this.checkNumberNotNull(n);
    try {
      if (typeof n == "string") {
        n = n.trim();
        return this.wrapped.gte(n);
      } else if (n instanceof Amount) {
        return this.wrapped.gte(n.wrapped)
      } else if (n.toString) {
        return this.wrapped.gte(n.toString())
      } else {
        return this.wrapped.gte(+n);
      }
    } catch (err) {
      this.throwInvalidAmount(n)
    }
  }


  /**
   * Less than
   */
  public lt(n: number | string | Amount): boolean {
    this.checkNumberNotNull(n);
    try {

      if (typeof n == "string") {
        n = n.trim();
        return this.wrapped.lt(n);
      } else if (n instanceof Amount) {
        return this.wrapped.lt(n.wrapped)
      } else if (n.toString) {
        return this.wrapped.lt(n.toString())
      } else {
        return this.wrapped.lt(+n);
      }
    } catch (err) {
      this.throwInvalidAmount(n)
    }
  }


  /**
   * Less than or equal to
   */
  public lte(n: number | string | Amount): boolean {
    this.checkNumberNotNull(n);
    try {

      if (typeof n == "string") {
        n = n.trim();
        return this.wrapped.lte(n);
      } else if (n instanceof Amount) {
        return this.wrapped.lte(n.wrapped)
      } else if (n.toString) {
        return this.wrapped.lte(n.toString())
      } else {
        return this.wrapped.lte(+n);
      }
    } catch (err) {
      this.throwInvalidAmount(n)
    }
  }

  /**
   * Sum
   */
  public plus(n: number | string | Amount): Amount {
    this.checkNumberNotNull(n);
    let big: Big;
    try {
      if (typeof n == "string") {
        n = n.trim();
        big = this.wrapped.plus(n);
      } else if (n instanceof Amount) {
        big = this.wrapped.plus(n.wrapped)
      } else if (n.toString) {
        big = this.wrapped.plus(n.toString())
      } else {
        big = this.wrapped.plus(+n);
      }
      return this.wrap(big);
    } catch (err) {
      this.throwInvalidAmount(n)
    }
  }

  /**
   * Minus
   */
  public minus(n: number | string | Amount): Amount {
    this.checkNumberNotNull(n);
    let big: Big;
    try {
      if (typeof n == "string") {
        n = n.trim();
        big = this.wrapped.minus(n);
      } else if (n instanceof Amount) {
        big = this.wrapped.minus(n.wrapped)
      } else if (n.toString) {
        big = this.wrapped.minus(n.toString())
      } else {
        big = this.wrapped.minus(+n);
      }
      return this.wrap(big);
    } catch (err) {
      this.throwInvalidAmount(n)
    }
  }

  /**
   * Modulo - the integer remainder of dividing this Amount by n.
   * 
   * Similar to % operator
   *
   */
  public mod(n: number | string | Amount): Amount {
    this.checkNumberNotNull(n);
    let big: Big;
    try {
      if (typeof n == "string") {
        n = n.trim();
        big = this.wrapped.mod(n);
      } else if (n instanceof Amount) {
        big = this.wrapped.mod(n.wrapped)
      } else if (n.toString) {
        big = this.wrapped.mod(n.toString())
      } else {
        big = this.wrapped.mod(+n);
      }
      return this.wrap(big);
    } catch (err) {
      this.throwInvalidAmount(n)
    }
  }


  /**
   * Round to a maximum of dp decimal places.
   */
  public round(dp?: number): Amount {
    let big = this.wrapped.round(dp);
    return this.wrap(big);
  }



  /**
   * Multiply
   */
  public times(n: number | string | Amount): Amount {
    this.checkNumberNotNull(n);
    let big: Big;
    try {

      if (typeof n == "string") {
        n = n.trim();
        big = this.wrapped.times(n);
      } else if (n instanceof Amount) {
        big = this.wrapped.times(n.wrapped)
      } else if (n.toString) {
        big = this.wrapped.times(n.toString())
      } else {
        big = this.wrapped.times(+n);
      }
      return this.wrap(big);
    } catch (err) {
      this.throwInvalidAmount(n)
    }
  }

  /**
   * Returns a string representing the value of this Amount in normal notation to a fixed number of decimal places dp.
   */
  public toFixed(dp?: number): string {
    return this.wrapped.toFixed(dp);
  }

  /**
   * Returns a string representing the value of this Amount.
   */
  public toString(): string {
    return this.wrapped.toString();
  }

  /**
   * Returns a primitive number representing the value of this Amount.
   */
  public toNumber(): number {
    return this.wrapped.toNumber();
  }


  /** @internal */
  private checkNumberNotNull(amount: string | number | Amount) {
    if (amount == null) {
      throw new Error(`Invalid amount: null`);
    }
  }

  /** @internal */
  static create() {
    return Object.create(this.prototype);
  }

  /** @internal */
  private wrap(big: Big): Amount {
    let amount = Amount.create();
    amount.wrapped = big;
    return amount;
  }
}
