import { InfiniteDataQueryOptionsType } from "./useInfiniteDataQuery";
import { DataQueryKeyType } from "../context/ProviderTypes.type";
import { FetcherType } from "../types/Hooks.type";
/**
 * Fetch data infinitely. Like useInfiniteDataQuery Hook, will not synchronize data across multiple Hooks with the same dataQueryKey
 * @param {*} dataQueryKey to help keep the query in queue and cache
 * @param {function} fetcher function to fetch the data
 * @param {*} containerRef ref to register scroll event listener. This Hook wil fetch data automatically whenever the scroll top position reaches the bottom of the container
 * @param {*} options to override the functionalities
 * @returns
 */
export declare const useExperimentalInfiniteDataQuery: <T = any>(dataQueryKey: DataQueryKeyType, fetcher: FetcherType, containerRef: {
    current: HTMLElement;
}, options: {
    getNextPageParam?: ((lastPage: [] | T[], pages: ([] | T[])[]) => any) | undefined;
    getPrevPageParam?: ((firstPage: [] | T[], pages: ([] | T[])[]) => any) | undefined;
    onReset?: ((fetcher: (pageParams: any) => void) => void) | undefined;
} & Omit<import("../types/Hooks.type").UseDataQueryOptionsType<[] | T[][]>, "autoFetchEnabled" | "refetchOnWindowFocus"> & {
    offsetBottom?: number | undefined;
}) => Readonly<{
    data: [] | T[][];
    reset: () => void;
    fetchPage: (pageParam: any) => void;
    hasNextPage: boolean;
    isLoading: boolean;
    isFetching: boolean;
    isFetchingNextPage: boolean;
}>;
