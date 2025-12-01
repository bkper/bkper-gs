/**
*
* An iterator that allows scripts to iterate over a potentially large collection of Events.
* 
* Example:
*
* ```js
* var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
*
* var eventIterator = book.getEvents('2023-10-01', '2023-11-01', true);
*
* while (eventIterator.hasNext()) {
*  var event = eventIterator.next();
*  Logger.log(event);
* }
* ```
*
* @public
*/
class EventIterator {

    private book: Book;

    private afterDate: string | null = null;
    private beforeDate: string | null = null;
    private onError = false;
    private resourceId: string | null = null;

    private currentPage: EventPage_;
    private nextPage: EventPage_;
    private lastCursor: string;

    constructor(book: Book, afterDate?: string, beforeDate?: string, onError?: boolean, resourceId?: string) {
        this.book = book;
        if (afterDate) {
            this.afterDate = afterDate;
        }
        if (beforeDate) {
            this.beforeDate = beforeDate;
        }
        if (onError) {
            this.onError = onError;
        }
        if (resourceId) {
            this.resourceId = resourceId;
        }
        this.currentPage = null;
        this.nextPage = null;
        this.lastCursor = null;
    }

    /**
     * Gets the Book that originated the iterator
     * 
     * @returns The Book object
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
     * 
     * @returns The continuation token
     */
    public getContinuationToken(): string {
        if (this.currentPage == null) {
            return null;
        }
        let cursor = this.lastCursor;
        if (cursor == null) {
            cursor = "null";
        }
        let continuationToken = cursor + "_bkperpageindex_" + this.currentPage.getIndex();
        return continuationToken;
    }

    /**
     * Sets a continuation token from a previous paused iteration.
     */
    public setContinuationToken(continuationToken: string): void {
        if (continuationToken == null) {
            return;
        }
        let cursorIndexArray = continuationToken.split("_bkperpageindex_");
        if (cursorIndexArray.length != 2) {
            return;
        }
        let cursor = cursorIndexArray[0];
        let index = cursorIndexArray[1];
        if ("null" != cursor) {
            this.lastCursor = cursor;
        }
        let indexNum = new Number(index).valueOf();
        this.currentPage = new EventPage_(this.book, this.afterDate, this.beforeDate, this.onError, this.resourceId, this.lastCursor);
        this.currentPage.setIndex(indexNum);
    }

    /**
     * Determines whether calling next() will return a transaction.
     */
    public hasNext(): boolean {
        if (this.currentPage == null) {
            this.currentPage = new EventPage_(this.book, this.afterDate, this.beforeDate, this.onError, this.resourceId, this.lastCursor);
        }
        if (this.currentPage.hasNext()) {
            return true;
        } else if (!this.currentPage.hasReachEnd()) {
            this.lastCursor = this.currentPage.getCursor();
            if (this.nextPage == null) {
                this.nextPage = new EventPage_(this.book, this.afterDate, this.beforeDate, this.onError, this.resourceId, this.lastCursor);
            }
            return this.nextPage.hasNext();
        } else {
            return false;
        }
    }

    /**
     * Gets the next event in the collection of events.
     * 
     * @returns The next Event object
     */
    public next(): Event {
        if (this.currentPage == null) {
            this.currentPage = new EventPage_(this.book, this.afterDate, this.beforeDate, this.onError, this.resourceId, this.lastCursor);
        }
        if (this.currentPage.hasNext()) {
            return this.currentPage.next();
        } else if (!this.currentPage.hasReachEnd()) {
            this.lastCursor = this.currentPage.getCursor();
            if (this.nextPage != null) {
                this.currentPage = this.nextPage;
                this.nextPage = null;
            } else {
                this.currentPage = new EventPage_(this.book, this.afterDate, this.beforeDate, this.onError, this.resourceId, this.lastCursor);
            }
            return this.currentPage.next();
        } else {
            return null;
        }
    }

}
