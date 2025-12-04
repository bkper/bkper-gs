var expect = require('chai').expect;

describe('Transaction', () => {

    describe('#getStatus()', () => {

        it('should return TRASHED when transaction is trashed', () => {
            let transaction = new Transaction();
            transaction.payload = { trashed: true, posted: true, checked: true };

            expect(transaction.getStatus()).to.equal(TransactionStatus.TRASHED);
        });

        it('should return TRASHED when trashed even if not posted', () => {
            let transaction = new Transaction();
            transaction.payload = { trashed: true, posted: false, checked: false };

            expect(transaction.getStatus()).to.equal(TransactionStatus.TRASHED);
        });

        it('should return DRAFT when not posted and not trashed', () => {
            let transaction = new Transaction();
            transaction.payload = { trashed: false, posted: false, checked: false };

            expect(transaction.getStatus()).to.equal(TransactionStatus.DRAFT);
        });

        it('should return CHECKED when posted and checked and not trashed', () => {
            let transaction = new Transaction();
            transaction.payload = { trashed: false, posted: true, checked: true };

            expect(transaction.getStatus()).to.equal(TransactionStatus.CHECKED);
        });

        it('should return UNCHECKED when posted but not checked and not trashed', () => {
            let transaction = new Transaction();
            transaction.payload = { trashed: false, posted: true, checked: false };

            expect(transaction.getStatus()).to.equal(TransactionStatus.UNCHECKED);
        });

    });

});
