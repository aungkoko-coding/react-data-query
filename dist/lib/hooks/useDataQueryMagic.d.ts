import { DataQueryKeyType } from "../context/ProviderTypes.type";
type QuerySetterType = (prevData: any) => void | any;
/**
 * Controls cache and network requests
 * @returns {Object} queryMagic instance
 */
export declare const useDataQueryMagic: () => Readonly<{
    setQueryData: (dataQueryKey: DataQueryKeyType, querySetter: QuerySetterType) => void;
    setQueriesData: (dataQueries: {
        dataQueryKey: DataQueryKeyType;
        querySetter: QuerySetterType;
    }[]) => void;
    getQueryData: (dataQueryKey: DataQueryKeyType) => any;
    getQueriesData: (dataQueryKeys: DataQueryKeyType[]) => any[];
    cancelQuery: (dataQueryKey: DataQueryKeyType) => Promise<void>;
    clearAllCachesData: () => void;
    clearCacheData: (dataQueryKey: DataQueryKeyType) => void;
    invalidateQuery: (dataQueryKey: DataQueryKeyType) => void;
    invalidateQueries: (dataQueryKeys: DataQueryKeyType[]) => void;
}>;
export {};
