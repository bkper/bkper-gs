/**
*
* An iterator that allows scripts to iterate over a potentially large collection of transactions.
* 
* Example:
*
* ```js
* var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
*
* var transactionIterator = book.getTransactions("account:CreditCard after:28/01/2013 before:29/01/2013");
*
* while (transactionIterator.hasNext()) {
*  var transaction = transactions.next();
*  Logger.log(transaction.getDescription());
* }
* ```
*
* @public
*/
class TransactionIterator {

    private book: Book
    private query: string
    private currentPage: TransactionPage_
    private nextPage: TransactionPage_
    private lastCursor: string

    constructor(book: Book, query?: string) {
        this.book = book
        this.query = query
        if (this.query == null) {
            this.query = "";
        }
        this.currentPage = null;
        this.nextPage = null;
        this.lastCursor = null;
    }

    /**
     * Gets the Book that originate the iterator
     */
    public getBook(): Book {
        return this.book;
    }


    /**
     * Gets a token that can be used to resume this iteration at a later time.
     * 
     * This method is useful if processing an iterator in one execution would exceed the maximum execution time.
     * 
     * Continuation tokens are generally valid short period of time.
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
     * @returns The account, when filtering by a single account.
     */
    public getAccount(): Account {
        if (this.currentPage == null) {
            this.currentPage = new TransactionPage_(this.book, this.query, this.lastCursor);
        }
        return this.currentPage.getAccount();
    }

    /**
     * @deprecated
     */
    getFilteredByAccount(): Account {
        return this.getAccount();
    }

}


