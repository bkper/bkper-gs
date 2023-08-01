/**
 * 
 * This class defines the events Backlog from a [[Book]].
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
