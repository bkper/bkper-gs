var expect = require('chai').expect;

describe('Book.batchUpdateTransactions()', () => {
    const transactionService = TransactionService_ as unknown as {
        updateTransactionsBatch: (
            bookId: string,
            transactions: bkper.Transaction[],
            updateChecked?: boolean
        ) => bkper.Transaction[];
    };
    let originalUpdateTransactionsBatch: (
        bookId: string,
        transactions: bkper.Transaction[],
        updateChecked?: boolean
    ) => bkper.Transaction[];

    beforeEach(() => {
        originalUpdateTransactionsBatch = transactionService.updateTransactionsBatch;
    });

    afterEach(() => {
        transactionService.updateTransactionsBatch = originalUpdateTransactionsBatch;
    });

    it('should return only the transactions returned by the batch update endpoint', () => {
        const book = new Book('book-1', { id: 'book-1' });
        const unchanged = book.newTransaction().setDescription('Unchanged');
        const changed = book.newTransaction().setDescription('Changed');
        const calls: { bookId: string; count: number; updateChecked?: boolean }[] = [];
        transactionService.updateTransactionsBatch = (
            bookId: string,
            transactions: bkper.Transaction[],
            updateChecked?: boolean
        ) => {
            calls.push({ bookId: bookId, count: transactions.length, updateChecked: updateChecked });
            return [{ id: 'changed-id', description: 'Changed' }];
        };

        const updated = book.batchUpdateTransactions([unchanged, changed], true);

        expect(calls).to.deep.equal([{ bookId: 'book-1', count: 2, updateChecked: true }]);
        expect(updated.map(transaction => transaction.getId())).to.deep.equal(['changed-id']);
        expect(updated[0].book).to.equal(book);
    });
});
