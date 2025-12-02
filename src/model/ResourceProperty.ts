/// <reference path="Resource.ts" />

/**
 * Abstract base class for Bkper resources that support custom properties.
 * 
 * Extends Resource<T> and adds property management methods for entities
 * that have a properties field in their payload.
 *
 */
abstract class ResourceProperty<T extends { properties?: { [key: string]: string } }> extends Resource<T> {

    /**
     * Checks if a property key represents a hidden property.
     * Hidden properties are those whose keys end with an underscore "_".
     *
     * @param key - The property key to check
     * @returns True if the property is hidden, false otherwise
     * 
     * @internal
     */
    private isHiddenProperty(key: string): boolean {
        return key.endsWith('_');
    }

    /**
     * Gets the custom properties stored in this resource.
     *
     * @returns Object with key/value pair properties
     */
    public getProperties(): { [key: string]: string } {
        return this.payload.properties != null
            ? { ...this.payload.properties }
            : {};
    }

    /**
     * Sets the custom properties of this resource.
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns This resource, for chaining
     */
    public setProperties(properties: { [key: string]: string }): this {
        this.payload.properties = { ...properties };
        return this;
    }

    /**
     * Gets the property value for given keys. First property found will be retrieved.
     *
     * @param keys - The property keys to search for
     *
     * @returns The property value or null if not found
     */
    public getProperty(...keys: string[]): string {
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            let value = this.payload.properties != null
                ? this.payload.properties[key]
                : null;
            if (value != null && value.trim() != "") {
                return value;
            }
        }
        return null;
    }

    /**
     * Sets a custom property in this resource.
     *
     * @param key - The property key
     * @param value - The property value
     *
     * @returns This resource, for chaining
     */
    public setProperty(key: string, value: string): this {
        if (key == null || key.trim() == "") {
            return this;
        }
        if (this.payload.properties == null) {
            this.payload.properties = {};
        }
        this.payload.properties[key] = value;
        return this;
    }

    /**
     * Deletes a custom property.
     *
     * @param key - The property key
     *
     * @returns This resource, for chaining
     */
    public deleteProperty(key: string): this {
        this.setProperty(key, null);
        return this;
    }

    /**
     * Gets the custom properties keys stored in this resource.
     *
     * @returns Array of property keys sorted alphabetically
     */
    public getPropertyKeys(): string[] {
        let properties = this.getProperties();
        let propertyKeys: string[] = [];
        if (properties) {
            for (var key in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, key)) {
                    propertyKeys.push(key);
                }
            }
        }
        propertyKeys = propertyKeys.sort();
        return propertyKeys;
    }

    /**
     * Sets a custom property in this resource, filtering out hidden properties.
     * Hidden properties are those whose keys end with an underscore "_".
     *
     * @param key - The property key
     * @param value - The property value, or null/undefined to clean it
     *
     * @returns This resource, for chaining
     */
    public setVisibleProperty(key: string, value: string | null | undefined): this {
        if (this.isHiddenProperty(key)) {
            return this;
        }
        return this.setProperty(key, value);
    }

    /**
     * Sets the custom properties of this resource, filtering out hidden properties.
     * Hidden properties are those whose keys end with an underscore "_".
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns This resource, for chaining
     */
    public setVisibleProperties(properties: { [key: string]: string }): this {
        if (properties == null) {
            return this;
        }
        const filteredProperties: { [key: string]: string } = {};
        for (const key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                if (!this.isHiddenProperty(key)) {
                    filteredProperties[key] = properties[key];
                }
            }
        }
        return this.setProperties(filteredProperties);
    }

    /**
     * Gets the visible custom properties stored in this resource.
     * Hidden properties (those ending with "_") are excluded from the result.
     *
     * @returns Object with key/value pair properties, excluding hidden properties
     */
    public getVisibleProperties(): { [key: string]: string } {
        const allProperties = this.getProperties();
        const visibleProperties: { [key: string]: string } = {};
        for (const key in allProperties) {
            if (Object.prototype.hasOwnProperty.call(allProperties, key)) {
                if (!this.isHiddenProperty(key)) {
                    visibleProperties[key] = allProperties[key];
                }
            }
        }
        return visibleProperties;
    }
}
