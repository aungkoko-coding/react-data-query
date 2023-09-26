import { DataQueryKeyType } from "../context/ProviderTypes.type";
import { FetcherType, OnErrorFunType, OnMutatedFunType, OnSettledFunType, OnSuccessFunType, ReasonType, UseDataQueryOptionsType, Context } from "../types/Hooks.type";
export { Context, DataQueryKeyType, FetcherType, UseDataQueryOptionsType, OnErrorFunType, OnMutatedFunType, OnSettledFunType, OnSuccessFunType, ReasonType, };
/**
 *
 * Utility Hook to make developer's life easier. This Hook will help you in fetching data and keep you away from handling caches. You don't need to implement imperative stuffs, just focus on business logic.
 *
 * @param {*} dataQueryKey to help keep the query in queue and cache
 * @param {FetcherType} fetcher function to fetch the data
 * @param {*} options to override the functionalities
 * @returns data query instance
 */
export declare const useDataQuery: <T = any>(dataQueryKey: DataQueryKeyType, fetcher: FetcherType, options?: UseDataQueryOptionsType<T>) => Readonly<{
    dataQueryKey: DataQueryKeyType;
    data: T | null | undefined;
    isFetching: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    isStale: boolean;
    error: ReasonType;
    refetch: (param?: any) => void;
    forceRefetch: (param?: any) => void;
}>;
