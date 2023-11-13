/**
 * 
 * This class defines an Event from a [[Book]].
 *
 * An event is an object that represents an action (such as posting or deleting a [[Transaction]]) made by an actor (such as a user or a [Bot](https://bkper.com/apps) acting on behalf of a user).
 * 
 * @public
 */
class Event {

    wrapped: bkper.Event;
    book: Book;

    /**
     * @returns The id of the Event.
     */
    public getId(): string {
        return this.wrapped.id;
    }

}
