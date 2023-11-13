class EventPage_ {

    private events: Event[];
    private cursor: string;
    private index: number;
    private reachEnd: boolean;

    constructor(book: Book, afterDate: string | null, beforeDate: string | null, onError: boolean, resourceId: string | null, lastCursor: string) {
        let eventList = EventsService_.searchEvents(book, afterDate, beforeDate, onError, resourceId, 1000, lastCursor);
        if (eventList.items == null) {
            eventList.items = [];
        }
        this.events = Utils_.wrapObjects(new Event(), eventList.items);
        book.configureEvents_(this.events);
        this.cursor = eventList.cursor;
        this.index = 0;
        if (this.events == null || this.events.length == 0 || this.cursor == null || this.cursor == "") {
            this.reachEnd = true;
        } else {
            this.reachEnd = false;
        }
    }

    public getCursor(): string {
        return this.cursor;
    }

    public hasNext(): boolean {
        return this.index < this.events.length;
    }

    public hasReachEnd(): boolean {
        return this.reachEnd;
    }

    public getIndex(): number {
        if (this.index >= this.events.length) {
            return 0;
        } else {
            return this.index;
        }

    }

    public setIndex(index: number) {
        this.index = index;
    }

    public next(): Event {
        if (this.index < this.events.length) {
            let event = this.events[this.index];
            this.index++;
            return event;
        } else {
            return null;
        }
    }

}
