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
    var text = "";
    if (Array.isArray(transactions)) {
      var hasManyRows = false;
      for (var i = 0; i < transactions.length; i++) {
        var row = transactions[i];
        if (Array.isArray(row)) {
          transactions[i] = arrayToTransaction_(row, book, timezone);
          hasManyRows = true;
        }
      }
      if (hasManyRows) {
        text = transactions.join("\n");
      } else {
        text = arrayToTransaction_(transactions, book, timezone);
      }
    } else if (typeof transactions == "string") {
      text = transactions;
    }
    var body = "text=" +  encodeURIComponent(text);

    return new HttpBooksApiV2Request(`${book.getId()}/drafts`)
          .setMethod('post')
          .setPayload(body)
          .setContentType('application/x-www-form-urlencoded; charset=UTF-8')
          .fetch()
          .getContentText();
  }

  function arrayToTransaction_(row: any[], book: Book, timezone?: string) {
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
    return row.join(" ");
  }



}