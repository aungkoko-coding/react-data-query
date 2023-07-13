import { useEffect, useRef } from "react";
import {
  InfiniteDataQueryOptionsType,
  useInfiniteDataQuery,
} from "./useInfiniteDataQuery";
import { useDataQueryContext } from "../context/DataQueryProvider";
import { getRaceHelper } from "../utils/utils";
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
export const useExperimentalInfiniteDataQuery = (
  dataQueryKey: DataQueryKeyType,
  fetcher: FetcherType,
  containerRef: { current: HTMLElement },
  options: InfiniteDataQueryOptionsType & { offsetBottom: number }
) => {
  if (!dataQueryKey) {
    throw new TypeError(
      "Provide dataQueryKey as any type except types that don't have toString method especially falsy value"
    );
  }

  if (typeof options !== "object")
    throw new TypeError("Please provide 'options' as an object!");
  if (
    typeof containerRef !== "object" ||
    !("current" in containerRef) ||
    !(containerRef.current instanceof HTMLElement)
  )
    throw new TypeError(
      "Please provide containerRef as a real ref object created with createRef or useRef function!"
    );
  const {
    options: { offsetBottom: defaultOffsetBottom },
  } = useDataQueryContext();
  const { offsetBottom = defaultOffsetBottom, ...otherOptions } = options;
  if ((offsetBottom && offsetBottom < 0) || Number.isNaN(offsetBottom))
    throw new TypeError(
      "'offsetBottom' options must be number type which is greater than or equal to zero"
    );

  const operation = useRef(getRaceHelper());

  const {
    data,
    reset,
    fetchPage,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteDataQuery(dataQueryKey, fetcher, {
    ...otherOptions,
    onSuccess: () => {
      operation.current.cancelOperation();
    },
    onError: () => {
      operation.current.cancelOperation();
    },
  });

  const dataQueryKeyStr = dataQueryKey.toString();
  useEffect(() => {
    const container = containerRef.current;

    container.addEventListener("scroll", handleScroll);

    function handleScroll() {
      let triggerHeight =
        container.scrollTop + (offsetBottom || 0) + container.offsetHeight;

      // console.log(
      //   "scrolling...",
      //   operation.current.isActiveOperation(dataQueryKey.toString())
      // );
      // Need to prevent in situation where user scroll top and bottom repeatedly before data arrives
      if (!operation.current.isActiveOperation(dataQueryKeyStr)) {
        if (triggerHeight >= container.scrollHeight) {
          fetchNextPage();
          operation.current.setActiveOperation(dataQueryKeyStr);
        }
      }
    }

    return () => {
      container &&
        container.removeEventListener &&
        container.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, offsetBottom, containerRef, dataQueryKeyStr]);

  return Object.freeze({
    data,
    reset,
    fetchPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  });
};
