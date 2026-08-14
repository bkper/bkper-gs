var expect = require('chai').expect;

describe('Book.getTransactionsByIds()', () => {
    const transactionService = TransactionService_ as unknown as {
        getTransactionsByIds: (bookId: string, ids: string[]) => bkper.Transaction[];
    };
    let originalGetTransactionsByIds: (
        bookId: string,
        ids: string[]
    ) => bkper.Transaction[];
    let calls: string[][];

    beforeEach(() => {
        originalGetTransactionsByIds = transactionService.getTransactionsByIds;
        calls = [];
        transactionService.getTransactionsByIds = (_bookId: string, ids: string[]) => {
            calls.push(ids.slice());
            return ids.map(id => ({ id: id, description: `Transaction ${id}` }));
        };
    });

    afterEach(() => {
        transactionService.getTransactionsByIds = originalGetTransactionsByIds;
    });

    it('should split more than 200 ids into ordered sequential requests', () => {
        const ids = Array.from({ length: 201 }, (_, index) => `tx-${index}`);
        const book = new Book('book-1', { id: 'book-1' });

        const transactions = book.getTransactionsByIds(ids);

        expect(calls).to.have.length(2);
        expect(calls[0]).to.deep.equal(ids.slice(0, 200));
        expect(calls[1]).to.deep.equal(ids.slice(200));
        expect(transactions.map(transaction => transaction.getId())).to.deep.equal(ids);
    });

    it('should return an empty result without making a request', () => {
        const book = new Book('book-1', { id: 'book-1' });

        expect(book.getTransactionsByIds([])).to.deep.equal([]);
        expect(calls).to.deep.equal([]);
    });

    it('should fail before requests for blank or duplicate ids', () => {
        const book = new Book('book-1', { id: 'book-1' });

        expect(() => book.getTransactionsByIds(['tx-1', '   '])).to.throw(
            'Transaction IDs must be non-blank strings.'
        );
        expect(() => book.getTransactionsByIds([' tx-1', 'tx-1'])).to.throw(
            'Duplicate transaction ID: tx-1'
        );
        expect(calls).to.deep.equal([]);
    });
});
