/// <reference path="Resource.ts" />

/**
* 
* This class defines a Bot Response associated to an [[Event]].
* 
* @public
*/
class BotResponse extends Resource<bkper.BotResponse> {

    constructor(payload: bkper.BotResponse) {
        super();
        this.payload = payload;
    }

    /**
     * @return The type of this Bot Response
     */
    public getType(): BotResponseType {
        return this.payload.type as BotResponseType;
    }

    /**
     * @return The agent id of this Bot Response
     */
    public getAgentId(): string {
        return this.payload.agentId;
    }

    /**
     * @return The message of this Bot Response
     */
    public getMessage(): string {
        return this.payload.message;
    }

}
