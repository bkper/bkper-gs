namespace BookService_ {

  export function listBooks(): bkper.Book[] {

    var responseJSON = new HttpBooksApiV3Request('').fetch().getContentText();
    
    if (responseJSON == null || responseJSON == "") {
      return [];
    }
    
    var bookListPlain: bkper.BookList = JSON.parse(responseJSON);

    var booksJson = bookListPlain.items;

    if (booksJson == null) {
      return [];
    }

    booksJson.sort(function(a,b){
      {
        var aName = a.name.toLowerCase();
        var bName = b.name.toLowerCase();
        if (aName < bName){
          return -1;
        }else if (aName > bName){
          return  1;
        }else{
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
    let responseJSON = new HttpBooksApiV3Request(bookId).fetch().getContentText();

    var bookPlain = JSON.parse(responseJSON);
    return bookPlain;
  }

  export function audit(book: Book): void {
    new HttpBooksApiV3Request(`${book.getId()}/audit`).setMethod('patch').fetch();
  }

}



