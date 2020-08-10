namespace TransactionService_ {

  export interface TransactionResponse {
    items: Transaction[]
    cursor: string
    account: Account
  }

  export function searchTransactions(book: Book, query: string, limit: number, cursor?: string): TransactionResponse {
    if (query == null) {
      query = "";
    }
    var request = new HttpBooksApiV3Request(`${book.getId()}/transactions`);
    request.addParam('query', query);
    request.addParam('limit', limit);
    if (cursor != null) {
      request.setHeader('cursor', cursor);
    }

    var responseJSON = request.fetch().getContentText();
    
    var transactionResponse: TransactionResponse = {
      items: [],
      cursor: null,
      account: null
    };
    
    if (responseJSON == null || responseJSON == "") {
      transactionResponse;
    }    
    var transactionsPlain: bkper.TransactionList = JSON.parse(responseJSON);

    if (transactionsPlain == null) {
      return transactionResponse;
    }
    transactionResponse.items = Utils_.wrapObjects(new Transaction(), transactionsPlain.items);
    book.configureTransactions_(transactionResponse.items);
    transactionResponse.cursor = transactionsPlain.cursor;
    if (transactionsPlain.account) {
      transactionResponse.account = book.getAccount(transactionsPlain.account)
    }
    return transactionResponse;
  }

  export function record(book: Book, transactions: string | any[] | any[][], timezone?: string): string {

    let transactionList: bkper.TransactionList = {
      items: []
    }

    if (Array.isArray(transactions)) {
      for (var i = 0; i < transactions.length; i++) {
        var row = transactions[i];
        if (Array.isArray(row)) {
          transactionList.items.push(arrayToTransaction_(row, book, timezone))
        } else if (typeof row == "string") {
          transactionList.items.push({description: row})
        }
      }
    } else if (typeof transactions == "string") {
      transactionList.items.push({description: transactions})
    }

    var payload = JSON.stringify(transactionList);

    Logger.log(payload)

    return new HttpBooksApiV3Request(`${book.getId()}/transactions/batch`)
          .setMethod('post')
          .setPayload(payload)
          .fetch()
          .getContentText();
  }

  function arrayToTransaction_(row: any[], book: Book, timezone?: string): bkper.Transaction {
    for (var j = 0; j < row.length; j++) {
      var cell = row[j];
      if (typeof cell == "string" || typeof cell == "boolean") {
        row[j] = cell;
      }
      else if (Object.prototype.toString.call(cell) === '[object Date]') {
        row[j] = book.formatDate(cell, timezone);
      } else if (!isNaN(cell)) {
        row[j] = Utils_.formatValue_(cell, book.getDecimalSeparator(), book.getFractionDigits());
      }
    }
    return {description: row.join(" ")};
  }



}