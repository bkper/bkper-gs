/**
 * 
 * This class defines an App installed in a [[Book]].
 * 
 * @public
 */
class App {

    private wrapped: bkper.App;

    constructor(appPlain: bkper.App) {
        this.wrapped = appPlain;
    }

    /**
     * @return The name of this App
     */
    public getName(): string {
        return this.wrapped.name;
    }

    /**
     * @return The id of this App
     */
    public getId(): string {
        return this.wrapped.id;
    }

    /**
     * @return The description of this App
     */
    public getDescription(): string {
        return this.wrapped.description;
    }

}
