namespace TransactionService_ {

  export interface TransactionResponse {
    items: Array<Transaction>
    cursor: string
  }

  export function searchTransactions(book: Book, query: string, limit: number, cursor?: string): TransactionResponse {
    if (query == null) {
      query = "";
    }
    var params =
        {
          "query" : query,
          "limit" : limit
        };
    
    var headers = null;

    if (cursor != null) {
      headers = {"cursor" : cursor};
    }
    
    var responseJSON = API.call_("get", "transactions", book.getId(), params, null, null, headers);
    
    var transactionResponse: TransactionResponse = {
      items: new Array<Transaction>(),
      cursor: null
    };
    
    if (responseJSON == null || responseJSON == "") {
      transactionResponse;
    }    
    var transactionsPlain = JSON.parse(responseJSON);

    if (transactionsPlain == null) {
      return transactionResponse;
    }
    transactionResponse.items = Utils_.wrapObjects(new Transaction(), transactionsPlain.items);
    book.configureTransactions_(transactionResponse.items);
    transactionResponse.cursor = transactionsPlain.cursor;
    return transactionResponse;
  }

  export function record(book: Book, transactions: string | Array<any> | Array<Array<any>>, timezone?: string): string {
    var text = "";
    if (transactions instanceof Array) {
      var hasManyRows = false;
      for (var i = 0; i < transactions.length; i++) {
        var row = transactions[i];
        if (row instanceof Array) {
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

    var response = API.call_("post", "drafts", book.getId(), null, body, "application/x-www-form-urlencoded; charset=UTF-8");
    return response;
  }

  function arrayToTransaction_(row: Array<any>, book: Book, timezone?: string) {
    for (var j = 0; j < row.length; j++) {
      var cell = row[j];
      if (typeof cell == "string" || typeof cell == "boolean") {
        row[j] = cell;
      }
      else if (cell instanceof Date) {
        row[j] = book.formatDate(cell, timezone);
      } else if (!isNaN(cell)) {
        row[j] = Utils_.formatValue_(cell, book.getDecimalSeparator(), book.getFractionDigits());
      }
    }
    return row.join(" ");
  }



}