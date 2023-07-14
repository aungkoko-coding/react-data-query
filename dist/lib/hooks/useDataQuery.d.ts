import { DataQueryKeyType } from "../context/ProviderTypes.type";
import { FetcherType, ReasonType, UseDataQueryOptionsType } from "../types/Hooks.type";
/**
 *
 * Utility Hook to make developer's life easier. This Hook will help you in fetching data and keep you away from handling caches. You don't need to implement imperative stuffs, just focus on business logic.
 *
 * @param {*} dataQueryKey to help keep the query in queue and cache
 * @param {FetcherType} fetcher function to fetch the data
 * @param {*} options to override the functionalities
 * @returns data query instance
 */
export declare const useDataQuery: (dataQueryKey: DataQueryKeyType, fetcher: FetcherType, options?: UseDataQueryOptionsType) => Readonly<{
    dataQueryKey: DataQueryKeyType;
    data: any;
    isFetching: boolean;
    isLoading: boolean;
    isError: boolean;
    isStale: boolean;
    error: ReasonType;
    refetch: (param?: any) => void;
    forceRefetch: (param: any) => void;
}>;
