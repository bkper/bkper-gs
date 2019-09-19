class TransactionPage_ {

  private transactions: Transaction[]
  private cursor: string
  private index: number
  private reachEnd: boolean

  constructor(book: Book, query: string, lastCursor: string) {

    var transactionResponse = TransactionService_.searchTransactions(book, query, 500, lastCursor);

    this.transactions = transactionResponse.items;
    this.cursor = transactionResponse.cursor;
    this.index = 0;
  
    if (this.transactions == null || this.transactions.length == 0 || this.cursor == null || this.cursor == "") {
      this.reachEnd = true;
    } else {
      this.reachEnd = false;
    }
  } 

  public getCursor(): string {
    return this.cursor;
  }

  public hasNext(): boolean {
    return this.index < this.transactions.length;
  }

  public hasReachEnd(): boolean {
    return this.reachEnd;
  }

  public getIndex(): number {
    if (this.index >= this.transactions.length) {
      return 0;
    } else {
      return this.index;
    }

  }

  public setIndex(index: number) {
    this.index = index;
  }

  public next(): Transaction {
    if (this.index < this.transactions.length) {
      var transaction = this.transactions[this.index];
      this.index++;
      return transaction;
    } else {
      return null;
    }
  }
}