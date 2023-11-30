/**
 * 
 * This class defines a Bot Response associated to an [[Event]].
 * 
 * @public
 */
class BotResponse {

    private wrapped: bkper.BotResponse;

    constructor(botResponsePlain: bkper.BotResponse) {
        this.wrapped = botResponsePlain;
    }

    /**
     * @return The type of this Bot Response
     */
    public getType(): "INFO" | "WARNING" | "ERROR" {
        return this.wrapped.type;
    }

    /**
     * @return The agent id of this Bot Response
     */
    public getAgentId(): string {
        return this.wrapped.agentId;
    }

    /**
     * @return The message of this Bot Response
     */
    public getMessage(): string {
        return this.wrapped.message;
    }

}
