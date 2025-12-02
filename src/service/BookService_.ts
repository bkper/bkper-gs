namespace BookService_ {

    export function listBooks(): bkper.Book[] {

        var responseJSON = new HttpBooksApiV5Request('').fetch().getContentText();

        if (responseJSON == null || responseJSON == "") {
            return [];
        }

        var bookListPlain: bkper.BookList = JSON.parse(responseJSON);

        var booksJson = bookListPlain.items;

        if (booksJson == null) {
            return [];
        }

        booksJson.sort(function (a, b) {
            {
                var aName = a.name.toLowerCase();
                var bName = b.name.toLowerCase();
                if (aName < bName) {
                    return -1;
                } else if (aName > bName) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
        return booksJson;
    }

    export function loadBookWrapped(bookId: string): bkper.Book {

        if (bookId == null) {
            throw new Error("Book id null!");
        }
        let responseJSON = new HttpBooksApiV5Request(bookId).addParam('loadAccounts', true).fetch().getContentText();

        var bookPlain = JSON.parse(responseJSON);
        return bookPlain;
    }

    export function addCollaborator(book: Book, collaborator: bkper.Collaborator): void {
        let payload = JSON.stringify(collaborator);
        new HttpBooksApiV5Request(`${book.getId()}/collaborators`).setMethod('post').setPayload(payload).fetch();
    }

    export function removeCollaborator(book: Book, email: string): void {
        new HttpBooksApiV5Request(`${book.getId()}/collaborators/${email}`).setMethod('delete').fetch();
    }

    export function updateBook(bookId: string, book: bkper.Book): bkper.Book {
        var payload = JSON.stringify(book);
        var responseJSON = new HttpBooksApiV5Request(`${bookId}`).setMethod('put').setPayload(payload).fetch().getContentText();
        return JSON.parse(responseJSON);
    }

    export function audit(book: Book): void {
        new HttpBooksApiV5Request(`${book.getId()}/audit`).setMethod('patch').fetch();
    }

}



