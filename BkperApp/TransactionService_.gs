var TransactionService_ = {

  searchTransactions: function(book, query, limit, cursor) {
    if (query == null) {
      query = "";
    }
    var params =
        {
          "query" : query,
          "limit" : limit
        };

    if (cursor != null) {
      params.cursor = cursor;
    }
    var responseJSON = API.call_("get", "transactions", book.getId(), params);
    var transactionsPlain = JSON.parse(responseJSON);
    var transactionResponse = {
      items: new Array()
    };
    if (transactionsPlain == null) {
      return transactionResponse;
    }
    transactionResponse.items = Utils_.wrapObjects(new Transaction(), transactionsPlain.items);
    book.configureTransactions_(transactionResponse.items);
    transactionResponse.cursor = transactionsPlain.cursor;
    return transactionResponse;
  },

  record: function(book, transactions, timezone) {
    var text = "";
    if (transactions instanceof Array) {
      var hasManyRows = false;
      for (var i = 0; i < transactions.length; i++) {
        var row = transactions[i];
        if (row instanceof Array) {
          transactions[i] = TransactionService_.arrayToTransaction_(row, book, timezone);
          hasManyRows = true;
        }
      }
      if (hasManyRows) {
        text = transactions.join("\n");
      } else {
        text = TransactionService_.arrayToTransaction_(transactions, book, timezone);
      }
    } else if (typeof transactions == "string") {
      text = transactions;
    }
    var body = "text=" +  encodeURIComponent(text);

    var response = API.call_("post", "drafts", book.getId(), null, body, "application/x-www-form-urlencoded; charset=UTF-8");
    return response;
  },

  arrayToTransaction_: function(row, book, timezone) {
    for (var j = 0; j < row.length; j++) {
      var cell = row[j];
      if (typeof cell == "string") {
        row[j] = cell;
      } else if (cell instanceof Date) {
        row[j] = book.formatDate(cell, timezone);
      } else if (!isNaN(cell)) {
        row[j] = Utils_.formatValue_(cell, book.getDecimalSeparator(), book.getFractionDigits());
      }
    }
    return row.join(" ");
  },



}