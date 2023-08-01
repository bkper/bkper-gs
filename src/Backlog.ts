/**
 * 
 * This class defines the Backlog of a [[Book]].
 * 
 * A Backlog is a list of pending bot tasks in a Book
 * 
 * @public
 */
class Backlog {

    private json: bkper.Backlog;

    constructor(backlogPlain: bkper.Backlog) {
        this.json = backlogPlain;
    }

    /**
     * @return The count of this Backlog
     */
    public getCount(): number {
        return this.json.count;
    }

}
