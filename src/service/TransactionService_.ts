namespace TransactionService_ {

    export function createTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
        var payload = JSON.stringify(transaction);
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/transactions`).setMethod('post').setPayload(payload).fetch().getContentText();
        return JSON.parse(responseJSON) as bkper.TransactionOperation;
    }

    export function createTransactionsBatch(bookId: string, transactions: bkper.Transaction[]): bkper.Transaction[] {

        let transactionList: bkper.TransactionList = {
            items: transactions
        }
        var payload = JSON.stringify(transactionList);

        let responseJSON = new HttpBooksApiV5Request(`${bookId}/transactions/batch`)
            .setMethod('post')
            .setPayload(payload)
            .fetch()
            .getContentText();

        transactionList = JSON.parse(responseJSON);
        return transactionList != null && transactionList.items != null ? transactionList.items : [];
    }

    export function updateTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
        var payload = JSON.stringify(transaction);
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/transactions`).setMethod('put').setPayload(payload).fetch().getContentText();
        return JSON.parse(responseJSON) as bkper.TransactionOperation;
    }

    export function postTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
        var payload = JSON.stringify(transaction);
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/transactions/post`).setMethod('patch').setPayload(payload).fetch().getContentText();
        return JSON.parse(responseJSON) as bkper.TransactionOperation;
    }

    export function checkTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
        var payload = JSON.stringify(transaction);
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/transactions/check`).setMethod('patch').setPayload(payload).fetch().getContentText();
        return JSON.parse(responseJSON) as bkper.TransactionOperation;
    }

    export function uncheckTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
        var payload = JSON.stringify(transaction);
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/transactions/uncheck`).setMethod('patch').setPayload(payload).fetch().getContentText();
        return JSON.parse(responseJSON) as bkper.TransactionOperation;
    }

    export function trashTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
        var payload = JSON.stringify(transaction);
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/transactions/trash`).setMethod('patch').setPayload(payload).fetch().getContentText();
        return JSON.parse(responseJSON) as bkper.TransactionOperation;
    }

    export function untrashTransaction(bookId: string, transaction: bkper.Transaction): bkper.TransactionOperation {
        var payload = JSON.stringify(transaction);
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/transactions/untrash`).setMethod('patch').setPayload(payload).fetch().getContentText();
        return JSON.parse(responseJSON) as bkper.TransactionOperation;
    }

    export function checkTransactionsBatch(bookId: string, transactions: bkper.Transaction[]): void {

        let transactionList: bkper.TransactionList = {
            items: transactions
        }
        var payload = JSON.stringify(transactionList);

        new HttpBooksApiV5Request(`${bookId}/transactions/check/batch`)
            .setMethod('patch')
            .setPayload(payload)
            .fetch()
    }

    export function uncheckTransactionsBatch(bookId: string, transactions: bkper.Transaction[]): void {

        let transactionList: bkper.TransactionList = {
            items: transactions
        }
        var payload = JSON.stringify(transactionList);

        new HttpBooksApiV5Request(`${bookId}/transactions/uncheck/batch`)
            .setMethod('patch')
            .setPayload(payload)
            .fetch()
    }

    export function trashTransactionsBatch(bookId: string, transactions: bkper.Transaction[], trashChecked?: boolean): void {

        let transactionList: bkper.TransactionList = { items: transactions };
        let payload = JSON.stringify(transactionList);

        new HttpBooksApiV5Request(`${bookId}/transactions/trash/batch`)
            .setMethod('patch')
            .setPayload(payload)
            .addParam('trashChecked', trashChecked)
            .fetch()
            ;

    }

    export function updateTransactionsBatch(bookId: string, transactions: bkper.Transaction[], updateChecked?: boolean): void {

        let transactionList: bkper.TransactionList = { items: transactions };
        let payload = JSON.stringify(transactionList);

        new HttpBooksApiV5Request(`${bookId}/transactions/batch`)
            .setMethod('put')
            .setPayload(payload)
            .addParam('updateChecked', updateChecked)
            .fetch()
            ;

    }

    export function getTransaction(bookId: string, id: string): bkper.Transaction {
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/transactions/${id}`).setMethod('get').fetch().getContentText();
        return JSON.parse(responseJSON) as bkper.Transaction;
    }

    export function countTransactions(bookId: string, query: string): bkper.Count {
        let responseJSON = new HttpBooksApiV5Request(`${bookId}/transactions/count`).setMethod('get').addParam('query', query).fetch().getContentText();
        return JSON.parse(responseJSON);
    }

    export function searchTransactions(book: Book, query: string, limit: number, cursor?: string): bkper.TransactionList {
        if (query == null) {
            query = "";
        }
        var request = new HttpBooksApiV5Request(`${book.getId()}/transactions`);
        request.addParam('query', query);
        request.addParam('limit', limit);
        if (cursor != null) {
            request.setHeader('cursor', cursor);
        }

        var responseJSON = request.fetch().getContentText();
        return JSON.parse(responseJSON);
    }

    /**
     * @deprecated 
     */
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
                    transactionList.items.push({ description: row })
                }
            }
        } else if (typeof transactions == "string") {
            transactionList.items.push({ description: transactions })
        }

        var payload = JSON.stringify(transactionList);

        Logger.log(payload)

        return new HttpBooksApiV5Request(`${book.getId()}/transactions/batch`)
            .setMethod('post')
            .setPayload(payload)
            .fetch()
            .getContentText();
    }

    /**
     * @deprecated 
     */
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
        return { description: row.join(" ") };
    }


}
