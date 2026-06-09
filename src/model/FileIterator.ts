/**
*
* An iterator that allows scripts to iterate over a potentially large collection of files.
*
* @public
*/
class FileIterator {

    private book: Book;
    private currentPage: FilePage_;
    private nextPage: FilePage_;
    private lastCursor: string;

    constructor(book: Book) {
        this.book = book;
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
     */
    public getContinuationToken(): string {

        if (this.currentPage == null) {
            return null;
        }

        let cursor = this.lastCursor;
        if (cursor == null) {
            cursor = "null";
        }

        return cursor + "_bkperpageindex_" + this.currentPage.getIndex();
    }

    /**
     * Sets a continuation token from previous paused iteration.
     */
    public setContinuationToken(continuationToken: string): void {

        if (continuationToken == null) {
            return;
        }

        const cursorIndexArray = continuationToken.split("_bkperpageindex_");
        if (cursorIndexArray.length != 2) {
            return;
        }

        const cursor = cursorIndexArray[0];
        const index = cursorIndexArray[1];
        if ("null" != cursor) {
            this.lastCursor = cursor;
        }
        const indexNum = new Number(index).valueOf();
        this.currentPage = new FilePage_(this.book, this.lastCursor);
        this.currentPage.setIndex(indexNum);
    }

    /**
     * Determines whether calling next() will return a file.
     */
    public hasNext(): boolean {

        if (this.currentPage == null) {
            this.currentPage = new FilePage_(this.book, this.lastCursor);
        }

        if (this.currentPage.hasNext()) {
            return true;
        } else if (!this.currentPage.hasReachEnd()) {
            this.lastCursor = this.currentPage.getCursor();
            if (this.nextPage == null) {
                this.nextPage = new FilePage_(this.book, this.lastCursor);
            }
            return this.nextPage.hasNext();
        } else {
            return false;
        }
    }

    /**
     * Gets the next file in the collection of files.
     */
    public next(): File {

        if (this.currentPage == null) {
            this.currentPage = new FilePage_(this.book, this.lastCursor);
        }

        if (this.currentPage.hasNext()) {
            return this.currentPage.next();
        } else if (!this.currentPage.hasReachEnd()) {
            this.lastCursor = this.currentPage.getCursor();
            if (this.nextPage != null) {
                this.currentPage = this.nextPage;
                this.nextPage = null;
            } else {
                this.currentPage = new FilePage_(this.book, this.lastCursor);
            }
            return this.currentPage.next();
        } else {
            return null;
        }
    }

}
