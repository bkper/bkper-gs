var expect = require('chai').expect;

describe('FileIterator', () => {

    let originalListFiles: typeof FileService_.listFiles;

    beforeEach(() => {
        originalListFiles = FileService_.listFiles;
    });

    afterEach(() => {
        FileService_.listFiles = originalListFiles;
    });

    it('uses page size 100 and wraps files', () => {
        const calls: { limit: number, cursor?: string }[] = [];
        FileService_.listFiles = (book: Book, limit: number, cursor?: string): bkper.FileList => {
            calls.push({ limit, cursor });
            return {
                items: [{ id: 'file-1', name: 'receipt.pdf' }],
            };
        };

        const iterator = new Book('book-1').getFiles();

        expect(iterator.hasNext()).to.equal(true);
        expect(iterator.next().getName()).to.equal('receipt.pdf');
        expect(calls).to.deep.equal([{ limit: 100, cursor: null }]);
    });

});
