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

    private botResponses: BotResponse[];

    /**
     * @returns The id of the Event.
     */
    public getId(): string {
        return this.wrapped.id;
    }

    /**
     * @returns The bot responses associated to this Event.
     */
    public getBotResponses(): BotResponse[] {
        if (this.botResponses !== undefined) {
            return this.botResponses;
        }
        let botResponses: BotResponse[] = [];
        if (this.wrapped.botResponses) {
            for (const botResponse of this.wrapped.botResponses) {
                botResponses.push(new BotResponse(botResponse));
            }
        }
        this.botResponses = botResponses;
        return this.botResponses;
    }

}
