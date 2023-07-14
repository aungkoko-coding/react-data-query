import { DataQueryKeyType } from "../context/ProviderTypes.type";
export declare const staleTimeElapsed: (staleTime: number, beforeStaleTime: number) => boolean;
export declare const getFromCache: (key: string) => any;
export type StateInitializerProps = {
    key: DataQueryKeyType;
    cacheTime: number;
    keepCacheAlways?: boolean;
};
/**
 *  Initialize state when the component mounts or when dataQueryKey changed
 * @param {string} key is used to get data from cache
 * @returns {any | null} object, or expectType if cache doesn't exist
 */
export declare const stateInitializer: ({ key, cacheTime, keepCacheAlways, }: StateInitializerProps) => any | null;
/**
 *
 * Cache data along with key so that we can retreat it later
 * @param {*} param an object in which must contain key, data and cachedDateTimestamp
 */
export declare const cacheData: ({ key, data, }: {
    key: DataQueryKeyType;
    data: any;
}) => void;
export declare const clearCache: (key: DataQueryKeyType) => void;
export declare const clearAllCache: () => void;
