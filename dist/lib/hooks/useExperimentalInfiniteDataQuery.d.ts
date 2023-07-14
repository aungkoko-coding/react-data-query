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
export declare const useExperimentalInfiniteDataQuery: (dataQueryKey: DataQueryKeyType, fetcher: FetcherType, containerRef: {
    current: HTMLElement;
}, options: InfiniteDataQueryOptionsType & {
    offsetBottom: number;
}) => Readonly<{
    data: any;
    reset: () => void;
    fetchPage: (pageParam: any) => void;
    hasNextPage: boolean | undefined;
    isLoading: boolean;
    isFetching: boolean;
    isFetchingNextPage: boolean;
}>;
