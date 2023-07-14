const cacheProvider = new Map();
export const staleTimeElapsed = (staleTime, beforeStaleTime) => {
    // const current = Date.now();
    // const timeDifferent = current - beforeStaleTime;
    // console.log({ current, beforeStaleTime, timeDifferent, staleTime });
    return Date.now() - beforeStaleTime >= staleTime;
};
export const getFromCache = (key) => {
    return cacheProvider.get(key);
};
/**
 *  Initialize state when the component mounts or when dataQueryKey changed
 * @param {string} key is used to get data from cache
 * @returns {any | null} object, or expectType if cache doesn't exist
 */
export const stateInitializer = ({ key, cacheTime, keepCacheAlways = false, }) => {
    // console.log("Initializing state...", key);
    // console.log(expectType);
    const cacheData = getFromCache(key.toString());
    if (!cacheData) {
        // console.log("cache not exist for " + key.toString());
        return null;
    }
    const { cachedDateTimestamp, data } = cacheData;
    const isStale = staleTimeElapsed(cacheTime, cachedDateTimestamp);
    let res = data;
    if (cacheTime !== Infinity && isStale && !keepCacheAlways) {
        res = null;
    }
    return res;
};
/**
 *
 * Cache data along with key so that we can retreat it later
 * @param {*} param an object in which must contain key, data and cachedDateTimestamp
 */
export const cacheData = ({ key, data, }) => {
    if (!key) {
        throw new Error("Falsy values are not allowed!");
    }
    const cacheObj = { data, cachedDateTimestamp: Date.now() };
    cacheProvider.set(key.toString(), cacheObj);
};
export const clearCache = (key) => {
    if (!key)
        throw new TypeError("Don't provide falsy value");
    cacheProvider.delete(key.toString());
};
export const clearAllCache = () => {
    cacheProvider.clear();
};
