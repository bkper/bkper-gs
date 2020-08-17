namespace TransactionService_ {
  
  export function createTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
    var payload = JSON.stringify(transaction);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/transactions`).setMethod('post').setPayload(payload).fetch().getContentText();
    return JSON.parse(responseJSON) as bkper.TransactionOperation;
  }

  export function updateTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
    var payload = JSON.stringify(transaction);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/transactions`).setMethod('put').setPayload(payload).fetch().getContentText();
    return JSON.parse(responseJSON) as bkper.TransactionOperation;
  }  

  export function postTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
    var payload = JSON.stringify(transaction);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/transactions/post`).setMethod('patch').setPayload(payload).fetch().getContentText();
    return JSON.parse(responseJSON) as bkper.TransactionOperation;
  }

  export function checkTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
    var payload = JSON.stringify(transaction);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/transactions/check`).setMethod('patch').setPayload(payload).fetch().getContentText();
    return JSON.parse(responseJSON) as bkper.TransactionOperation;
  }

  export function uncheckTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
    var payload = JSON.stringify(transaction);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/transactions/uncheck`).setMethod('patch').setPayload(payload).fetch().getContentText();
    return JSON.parse(responseJSON) as bkper.TransactionOperation;
  }  

  export function removeTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
    var payload = JSON.stringify(transaction);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/transactions/remove`).setMethod('patch').setPayload(payload).fetch().getContentText();
    return JSON.parse(responseJSON) as bkper.TransactionOperation;
  }  

  export function restoreTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
    var payload = JSON.stringify(transaction);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/transactions/restore`).setMethod('patch').setPayload(payload).fetch().getContentText();
    return JSON.parse(responseJSON) as bkper.TransactionOperation;
  }  

  export function getTransaction(bookId: string, id: string): bkper.Transaction {
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/transactions/${id}`).setMethod('get').fetch().getContentText();
    return JSON.parse(responseJSON) as bkper.Transaction;
  }  

  export function searchTransactions(book: Book, query: string, limit: number, cursor?: string): bkper.TransactionList {
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
    return JSON.parse(responseJSON);
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