
function TransactionPage_(book, query, lastCursor) {

  var transactionResponse = TransactionService_.searchTransactions(book, query, 800, lastCursor);

  this.transactions = transactionResponse.items;
  this.cursor = transactionResponse.cursor;
  this.index = 0;

  if (this.transactions == null || this.transactions.length == 0 || this.cursor == null || this.cursor == "") {
    this.reachEnd = true;
  } else {
    this.reachEnd = false;
  }


  TransactionPage_.prototype.getCursor = function() {
    return this.cursor;
  }

  TransactionPage_.prototype.hasNext = function() {
    return this.index < this.transactions.length;
  }

  TransactionPage_.prototype.hasReachEnd = function() {
    return this.reachEnd;
  }

  TransactionPage_.prototype.getIndex = function() {
    if (this.index >= this.transactions.length) {
      return 0;
    } else {
      return this.index;
    }

  }

  TransactionPage_.prototype.setIndex = function(index) {
    this.index = index;
  }

  TransactionPage_.prototype.next = function() {
    if (this.index < this.transactions.length) {
      var transaction = this.transactions[this.index];
      this.index++;
      return transaction;
    } else {
      return null;
    }
  }
}