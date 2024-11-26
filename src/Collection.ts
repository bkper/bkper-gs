/**
 * This class defines a Collection of [[Books]].
 * 
 * @public
 */
class Collection {

  wrapped: bkper.Collection

  constructor(wrapped: bkper.Collection) {
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
   * Sets the name of the Collection.
   * 
   * @returns This Collection, for chainning.
   */
  public setName(name: string): this {
    this.wrapped.name = name;
    return this;
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

  /**
   * Performs update Collection, applying pending changes.
   * 
   * @returns The updated Collection object
   */
  public update(): Collection {
    this.wrapped = CollectionService_.updateCollection(this.wrapped);
    return this;
  }

}
