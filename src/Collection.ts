/**
 * This class defines a Collection of [[Books]].
 * 
 * @public
 */
class Collection {

  wrapped: bkper.CollectionV2Payload

  constructor(wrapped: bkper.CollectionV2Payload) {
    this.wrapped = wrapped;
  }

  /**
   * @returns The id of this Collection
   */
  public getId(): string {
    return this.wrapped.id;
  }

  /**
   * @returns The name of this Collection
   */
  public getName(): string {
    return this.wrapped.name;
  }

  /**
   * @returns All Books of this collection.
   */
  public getBooks(): Book[] {
    let books: Book[] = [];
    if (this.wrapped.books == null) {
      return books;
    }
    for (const bookPayload of this.wrapped.books) {
      let book = new Book(bookPayload.id, bookPayload);
      books.push(book);
    }
    return books;
  }

}
