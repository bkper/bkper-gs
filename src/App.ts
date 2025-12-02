/// <reference path="Resource.ts" />

/**
* 
* This class defines an App installed in a [[Book]].
* 
* @public
*/
class App extends Resource<bkper.App> {

    constructor(payload: bkper.App) {
        super();
        this.payload = payload;
    }

    /**
     * @return The name of this App
     */
    public getName(): string {
        return this.payload.name;
    }

    /**
     * @return The id of this App
     */
    public getId(): string {
        return this.payload.id;
    }

    /**
     * @return The description of this App
     */
    public getDescription(): string {
        return this.payload.description;
    }

}
