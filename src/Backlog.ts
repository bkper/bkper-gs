/// <reference path="Resource.ts" />

/**
 * 
 * This class defines the Backlog of a [[Book]].
 * 
 * A Backlog is a list of pending bot tasks in a Book
 * 
 * @public
 */
class Backlog extends Resource<bkper.Backlog> {

    constructor(payload: bkper.Backlog) {
        super();
        this.payload = payload;
    }

    /**
     * @return The count of this Backlog
     */
    public getCount(): number {
        return this.payload.count;
    }

}
