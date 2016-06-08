/**

@classdesc

An iterator that allows scripts to iterate over a potentially large collection of transactions.

@see {@link Book#search}

@constructor

*/
function TransactionIterator(book, query) {

  this.book = book;
  this.query = query;
  if (this.query == null) {
    this.query = "";
  }
  this.currentPage = null;
  this.nextPage = null;
  this.lastCursor = null;
  this.filteredByAccount = "NOT_PROCESSED"

  /**
  Gets a token that can be used to resume this iteration at a later time.
  <br/>
  <br/>
  This method is useful if processing an iterator in one execution would exceed the maximum execution time.
  Continuation tokens are generally valid short period of time.

  @returns {string} a continuation token that can be used to resume this iteration with the items that remained in the iterator when the token was generated
  */
  TransactionIterator.prototype.getContinuationToken = function() {

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

  TransactionIterator.prototype.setContinuationToken = function(continuationToken) {

    if (continuationToken == null) {
      return;
    }

    var cursorIndexArray = continuationToken.split("_bkperpageindex_");
    if (cursorIndexArray.length != 2) {
      return;
    }

    var cursor = cursorIndexArray[0];
    var index = cursorIndexArray[1];
    if ("null" != cursor) {
      this.lastCursor = cursor;
    }

    this.currentPage = new TransactionPage_(this.book, this.query, this.lastCursor);
    this.currentPage.setIndex(index);
  }

  /**
  Determines whether calling next() will return a transaction.

  @returns {boolean} true if next() will return an item; false if not
  */
  TransactionIterator.prototype.hasNext = function() {

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
  Gets the next transaction in the collection of transactions.

  @returns {Transaction} the next transaction in the collection
  */
  TransactionIterator.prototype.next = function() {

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


  TransactionIterator.prototype.getFilteredByAccount = function() {

    if (this.filteredByAccount == "NOT_PROCESSED") {

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
      }
    }

    return this.filteredByAccount;

  }

  TransactionIterator.prototype.matchFromIndex_ = function(start, source, target) {

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


