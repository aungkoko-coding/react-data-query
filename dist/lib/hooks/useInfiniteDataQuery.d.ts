import { DataQueryKeyType } from "../context/ProviderTypes.type";
import { FetcherType, ReasonType, UseDataQueryOptionsType } from "../types/Hooks.type";
type DefaultFunctionsType = {
    /**
     * Use to provide param for the next network request
     * @param lastPage
     * @param pages
     * @returns
     */
    getNextPageParam?: (lastPage: any[], pages: any[]) => any | undefined;
    /**
     * Use to provide param for the next network request
     * @param firstPage
     * @param pages
     * @returns
     */
    getPrevPageParam?: (firstPage: any[], pages: any[]) => any | undefined;
    onReset?: (fetcher: (pageParams: any) => void) => void;
};
export type InfiniteDataQueryOptionsType = DefaultFunctionsType & Omit<UseDataQueryOptionsType, "autoFetchEnabled" | "refetchOnWindowFocus">;
/**
 * Fetch data infinitely. Unlike other Hooks, will not synchronize data across multiple Hooks with the same dataQueryKey
 * @param {*} dataQueryKey to help keep the query in queue and cache
 * @param {function} fetcher function to fetch the data
 * @param {*} options to override the functionalities
 * @returns infiniteDataQuery instance
 */
export declare const useInfiniteDataQuery: (dataQueryKey: DataQueryKeyType, fetcher: FetcherType, options: InfiniteDataQueryOptionsType) => Readonly<{
    isError: boolean;
    isFetching: boolean;
    fetchPage: (pageParam: any) => void;
    fetchNextPage: () => void;
    fetchPrevPage: () => void;
    reset: () => void;
    hasNextPage: boolean | undefined;
    hasPreviousPage: boolean | undefined;
    isLoading: boolean;
    isFetchingNextPage: boolean;
    isFetchingPreviousPage: boolean;
    data: any;
    error: ReasonType;
}>;
export {};
