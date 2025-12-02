
/**
 * Abstract base class for all Bkper resources.
 * Provides common functionality for payload management and JSON serialization.
 *
 */
abstract class Resource<T = any> {
    /**
     * The underlying payload data for this resource
     */
    public payload: T;

    /**
     * Gets an immutable copy of the JSON payload for this resource.
     * @returns An immutable copy of the json payload
     */
    public json(): T {
        return { ...this.payload };
    }
}
