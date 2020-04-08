namespace CachedProperties_ {

  const CACHE_EXPIRATION_TIME_SECONDS = 3600; // 1 hour.

  export function getCachedProperty(cache: GoogleAppsScript.Cache.Cache, properties: GoogleAppsScript.Properties.Properties, key: string): string {
    let value = cache.get(key);
    if (value == null) {
      value = properties.getProperty(key);
      cache.put(key, value, CACHE_EXPIRATION_TIME_SECONDS)
    }
    return value;
  }

  export function setCachedProperty(cache: GoogleAppsScript.Cache.Cache, properties: GoogleAppsScript.Properties.Properties, key: string, value: string): void {
    properties.setProperty(key, value);
    cache.put(key, value, CACHE_EXPIRATION_TIME_SECONDS)
  }

  export function deleteCachedProperty(cache: GoogleAppsScript.Cache.Cache, properties: GoogleAppsScript.Properties.Properties, key: string): void {
    properties.deleteProperty(key);
    cache.remove(key);
  }

}