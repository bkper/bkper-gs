/// <reference path="Resource.ts" />

/**
* This class defines a Collection of [[Books]].
* 
* @public
*/
class Collection extends Resource<bkper.Collection> {

    constructor(payload: bkper.Collection) {
        super();
        this.payload = payload;
    }

    /**
     * @returns The id of this Collection
     */
    public getId(): string {
        return this.payload.id;
    }

    /**
     * @returns The name of this Collection
     */
    public getName(): string {
        return this.payload.name;
    }

    /**
     * Sets the name of the Collection.
     * 
     * @returns This Collection, for chainning.
     */
    public setName(name: string): Collection {
        this.payload.name = name;
        return this;
    }

    /**
     * @returns All Books of this collection.
     */
    public getBooks(): Book[] {
        let books: Book[] = [];
        if (this.payload.books == null) {
            return books;
        }
        for (const bookPayload of this.payload.books) {
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
        this.payload = CollectionService_.updateCollection(this.payload);
        return this;
    }

}
