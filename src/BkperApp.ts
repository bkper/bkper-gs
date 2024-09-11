/**
 * Gets the [[Book]] with the specified bookId from url param.
 *
 * This is the main Entry Point to start interacting with the [bkper-gs](https://github.com/bkper/bkper-gs) library.
 *
 * Example:
 *
 * ```js
 * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
 * book.record("#fuel for my Land Rover 126.50 28/01/2013");
 * ```
 *
 * @param id The universal book id - The same bookId param of URL you access at app.bkper.com
 * 
 * @public
 */
function getBook(id: string): Book {
  return new Book(id);
}

/**
 * Gets all [[Books]] the user has access.
 * 
 * @public
 */
function getBooks(): Book[] {
  return BookService_.listBooks().map(bookV2 => { return new Book(bookV2.id, bookV2) });
}

/**
 * Create a new [[Amount]] wrapping a given number, or arbitrary-precision math calculations.
 * 
 * @param n The number to wrapp
 * 
 * @public
 */
function newAmount(n: number | string | Amount): Amount {
  return new Amount(n);
}

/**
 * Normalize a name
 * 
 * @public
 */
function normalizeName(name: string): string {
  return Utils_.normalizeText(name, "_");
}


//DEPRECATED METHODS

/**
 * @deprecated
 */
function openById(bookId: string): Book {
  return new Book(bookId);
}

/**
 * @deprecated
 */
function listBooks(): bkper.Book[] {
  return BookService_.listBooks();
}

/**
 * @deprecated
 */
function openLedgerById(ledgerId: string): Book {
  return openById(ledgerId);
}

/**
 * @deprecated
 */
function listLedgers(): bkper.Book[] {
  return listBooks();
}


