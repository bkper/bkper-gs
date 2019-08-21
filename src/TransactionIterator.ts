/**
 * 
 * An iterator that allows scripts to iterate over a potentially large collection of transactions.
 * 
 * @see {@link Book.search}
 *
*/
class TransactionIterator {

  private book: Book
  private query: string
  private currentPage: TransactionPage_
  private nextPage: TransactionPage_
  private lastCursor: string
  private filteredByAccount: Account
  private alreadyProcessedAccountFilter: boolean

  /**
   * @ignore
   */
  constructor(book: Book, query: string) {
    this.book = book
    this.query = query
    if (this.query == null) {
      this.query = "";
    }
    this.currentPage = null;
    this.nextPage = null;
    this.lastCursor = null;
    this.filteredByAccount = null
    this.alreadyProcessedAccountFilter = false
  }

  public getBook(): Book {
    return this.book;
  }


  /**
  * Gets a token that can be used to resume this iteration at a later time.
  * 
  * This method is useful if processing an iterator in one execution would exceed the maximum execution time.
  * 
  * Continuation tokens are generally valid short period of time.
  * 
  */
  public getContinuationToken(): string {

    if (this.currentPage == null) {
      return null;
    }

    var cursor = this.lastCursor;
    if (cursor == null) {
      cursor = "null"
    }

    var continuationToken = cursor + "_bkperpageindex_" + this.currentPage.getIndex();

    return continuationToken;
  }

  /**
   * Sets a continuation token from previous paused iteration
   * 
   * @param continuationToken 
   */
  public setContinuationToken(continuationToken: string): void {

    if (continuationToken == null) {
      return;
    }

    var cursorIndexArray = continuationToken.split("_bkperpageindex_");
    if (cursorIndexArray.length != 2) {
      return;
    }

    var cursor = cursorIndexArray[0]
    var index = cursorIndexArray[1]
    if ("null" != cursor) {
      this.lastCursor = cursor
    }
    let indexNum = new Number(index).valueOf()
    this.currentPage = new TransactionPage_(this.book, this.query, this.lastCursor)
    this.currentPage.setIndex(indexNum);
  }

  /**
  * Determines whether calling next() will return a transaction.
  */
  public hasNext(): boolean {

    if (this.currentPage == null) {
      this.currentPage = new TransactionPage_(this.book, this.query, this.lastCursor);
    }

    if (this.currentPage.hasNext()) {
      return true;
    } else if (!this.currentPage.hasReachEnd()) {
      this.lastCursor = this.currentPage.getCursor();
      if (this.nextPage == null) {
        this.nextPage = new TransactionPage_(this.book, this.query, this.lastCursor);
      }
      return this.nextPage.hasNext();
    } else {
      return false;
    }
  }

  /**
  * Gets the next transaction in the collection of transactions.
  */
  public next(): Transaction {

    if (this.currentPage == null) {
      this.currentPage = new TransactionPage_(this.book, this.query, this.lastCursor);
    }

    if (this.currentPage.hasNext()) {
      return this.currentPage.next();
    } else if (!this.currentPage.hasReachEnd()) {
      this.lastCursor = this.currentPage.getCursor();
      if (this.nextPage != null) {
        this.currentPage = this.nextPage;
        this.nextPage = null;
      } else {
        this.currentPage = new TransactionPage_(this.book, this.query, this.lastCursor);
      }
      return this.currentPage.next();
    } else {
      return null;
    }
  }

  /**
   * Return an account if query is filtering by a single account
   */
  public getFilteredByAccount(): Account {

    if (!this.alreadyProcessedAccountFilter) {

      this.filteredByAccount = null;

      try {
        var query = this.query.toLowerCase();

        var indexOfAcc = query.indexOf("acc:");
        var lastIndexOf = query.lastIndexOf("acc:");

        if (indexOfAcc >= 0 && query.length > (indexOfAcc + 5) && indexOfAcc == lastIndexOf) {

          query = query.substring(indexOfAcc + "acc:".length);
          query = query.trim();


          var accountsArray = this.book.getAccounts();
          var largestAccountName = 0;
          for (var j = 0; j < accountsArray.length; j++) {
            var account = accountsArray[j];
            var accountName = account.getName().toLowerCase();
            if (this.matchFromIndex_(0, query, accountName)) {
              if (accountName.length > largestAccountName) {
                this.filteredByAccount = account;
                largestAccountName = accountName.length;
              }
            }
          }
        }
      } catch (e) {
        //OK. Any error, the filteredByAccount will be null
        Logger.log(e);
      } finally {
        this.alreadyProcessedAccountFilter = true;
      }
    }

    return this.filteredByAccount;

  }

  private matchFromIndex_(start: number, source: string, target: string) {

    if (start >= source.length) {
      return false;
    }

    var indexOf = source.indexOf(target, start);

    if (indexOf == start || indexOf == (start + 1)) {
      return true;
    }

    return false;
  }


}


