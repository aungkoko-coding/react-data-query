import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StateInitializerProps,
  staleTimeElapsed,
  stateInitializer,
} from "../utils/cache-utils";
import {
  getQueryKeyAsArray,
  getRaceHelper,
  getRandomID,
  status,
} from "../utils/utils";
import { useDataQueryContext } from "../context/DataQueryProvider";
import {
  addToOngoingRequestQueue,
  isInOngoingRequestQueue,
  removeFromOngoingRequestQueue,
  unsubscribeChanges,
  subscribeChanges,
  isActualOngoingRequest,
} from "../utils/queue-utils";
import { DataQueryKeyType } from "../context/ProviderTypes.type";
import {
  FetcherType,
  MetadataType,
  OnErrorFunType,
  OnMutatedFunType,
  OnSettledFunType,
  OnSuccessFunType,
  ReasonType,
  UseDataQueryOptionsType,
} from "../types/Hooks.type";

export { Context } from "../types/Hooks.type";

const statuses = status;

/**
 *
 * Utility Hook to make developer's life easier. This Hook will help you in fetching data and keep you away from handling caches. You don't need to implement imperative stuffs, just focus on business logic.
 *
 * @param {*} dataQueryKey to help keep the query in queue and cache
 * @param {FetcherType} fetcher function to fetch the data
 * @param {*} options to override the functionalities
 * @returns data query instance
 */
export const useDataQuery = (
  dataQueryKey: DataQueryKeyType,
  fetcher: FetcherType,
  options: UseDataQueryOptionsType = {}
) => {
  if (typeof options !== "object")
    throw new TypeError("Please provide 'options' as an object!");
  const queryKey = dataQueryKey.toString();
  const hookID = useMemo(getRandomID, []);

  const { options: defaultOptions, notifyQueryChanges } = useDataQueryContext();

  const {
    staleTime = defaultOptions.staleTime,
    cacheTime = defaultOptions.cacheTime,
    keepCacheAlways = defaultOptions.keepCacheAlways,
    keepValueOnKeyChanges = defaultOptions.keepValueOnKeyChanges,
    dataStayInSync = defaultOptions.dataStayInSync,
    autoFetchEnabled = defaultOptions.autoFetchEnabled,
    refetchOnWindowFocus = defaultOptions.refetchOnWindowFocus,
    markUpdatesAsTransitions = defaultOptions.markUpdatesAsTransitions,
    onSuccess = null,
    onError = null,
    onSettled = null,
    onMutated = null,
  } = options;

  if (typeof staleTime !== "number")
    throw new TypeError("Please provide staleTime as number type");
  if (typeof cacheTime !== "number")
    throw new TypeError("Please provide cacheTime as number type");
  if (typeof keepCacheAlways !== "boolean")
    throw new TypeError("Please provide keepCacheAlways as boolean type");
  if (typeof keepValueOnKeyChanges !== "boolean")
    throw new TypeError("Please provide keepValueOnKeyChanges as boolean type");
  if (typeof dataStayInSync !== "boolean")
    throw new TypeError("Please provide dataStayInSync as boolean type");
  if (typeof autoFetchEnabled !== "boolean")
    throw new TypeError("Please provide autoFetchEnabled as boolean type");
  if (typeof refetchOnWindowFocus !== "boolean")
    throw new TypeError("Please provide refetchOnWindowFocus as boolean type");
  if (typeof markUpdatesAsTransitions !== "boolean")
    throw new TypeError(
      "Please provide markUpdatesAsTransitions as boolean type"
    );

  const [data, setData] = useState(() =>
    stateInitializer({
      key: queryKey,
      cacheTime,
      keepCacheAlways,
    } as StateInitializerProps)
  );
  const [error, setError] = useState<ReasonType>("");

  const initialStatus = {
    isFetching: autoFetchEnabled,
    isLoading: autoFetchEnabled && !data,
    isInvalidating: false,
    isError: false,
    isStale: false,
  };
  const [status, setStatus] = useState(initialStatus);

  // I know this breaks the rule. When we read reactive values, we need to put them in dependencies list.
  const memoizedOnSuccess = useCallback(onSuccess as OnSuccessFunType, [
    status,
  ]);
  const memoizedOnError = useCallback(onError as OnErrorFunType, [status]);
  const memoizedOnSettled = useCallback(onSettled as OnSettledFunType, [
    status,
  ]);
  const memoizedOnMutated = useCallback(onMutated as OnMutatedFunType, [
    status,
  ]);

  const metadata = useRef<MetadataType>({
    isInitialCall: true,
    beforeStaleTime: Date.now(),
    staleTimeOutId: undefined,
    prevKey: queryKey,
    previouslyEnabledAutoFetch: autoFetchEnabled as boolean,
  });

  const operation = useRef(getRaceHelper(queryKey));

  const { isStale, isFetching, isInvalidating } = status;

  /**
   * Will be registered as a callback to notify cancellation. Cancel ongoing network request. Set all status to false
   */
  const onCancelQuery = useCallback(() => {
    if (isFetching) {
      // console.log("cancelled status");
      setStatus((s) => ({
        ...s,
        isLoading: false,
        isFetching: false,
        isInvalidating: false,
        isStale: false,
        isError: false,
      }));
    }
    operation.current.cancelOperation();
  }, [isFetching]);

  /**
   *Will be registered as a callback to notify invalidation. Invalidate the data query i.e trigger new network request to get fresh data. When there is already ongoing network request, will wait for it.
   */
  const onInvalidate = useCallback(() => {
    if (markUpdatesAsTransitions) {
      // console.log("mark as transition");
      startTransition(() => {
        setStatus((prevStatus) => ({
          ...prevStatus,
          isLoading: false,
          isFetching: true,
          isInvalidating: true, // by setting true, the data will be refetched. See Effect logic below
          isStale: false,
          isError: false,
        }));
        setError("");
      });
    } else {
      setStatus((prevStatus) => ({
        ...prevStatus,
        isLoading: false,
        isFetching: true,
        isInvalidating: true, // by setting true, the data will be refetched. See Effect logic below
        isStale: false,
        isError: false,
      }));
      setError("");
    }
  }, [markUpdatesAsTransitions]);

  /**
   * Will be registered as a callback to notify query changes. When the new data receive due to network request or mutation, will be notified.
   */
  const onQueryChanges = useCallback(
    (resData: any, status: string, reason: ReasonType) => {
      const isInitialCall = metadata.current.isInitialCall;
      if (isInitialCall) {
        metadata.current.isInitialCall = false;
      }
      // isStale1 is used to determine whether it's stale or not when the data was changed with same key
      const isStale1 = staleTimeElapsed(
        staleTime as number,
        metadata.current.beforeStaleTime
      );
      // console.log("Callback invoked", { isStale1 });
      if (
        isFetching || // If I don't put this, the new data will not received whenever the query key changed or refetch
        ((isStale || isStale1) && dataStayInSync) ||
        isInitialCall ||
        status === statuses.mutate
      ) {
        // console.log("running callback");
        if (status === statuses.mutate) {
          if (markUpdatesAsTransitions) {
            startTransition(() => {
              setError("");
              setData(resData);
            });
          } else {
            setError("");
            setData(resData);
          }

          typeof memoizedOnMutated === "function" && memoizedOnMutated(resData);
        } else if (status === statuses.success) {
          if (markUpdatesAsTransitions) {
            startTransition(() => {
              setStatus((s) => ({
                ...s,
                isLoading: false,
                isFetching: false,
                isInvalidating: false,
                isStale: false,
                isError: false,
              }));
              setError("");
              setData(resData);
            });
          } else {
            setStatus((s) => ({
              ...s,
              isLoading: false,
              isFetching: false,
              isInvalidating: false,
              isStale: false,
              isError: false,
            }));
            setError("");
            setData(resData);
          }

          typeof memoizedOnSuccess === "function" && memoizedOnSuccess(resData);
          typeof memoizedOnSettled === "function" &&
            memoizedOnSettled(resData, reason);
        } else if (status === statuses.fail) {
          // console.log("fail");
          // When network request fails, if the user is doing computative intensive task, will block the user from interacting
          setStatus((s) => ({
            ...s,
            isStale: isStale1 || isStale,
            isLoading: false,
            isFetching: false,
            isInvalidating: false,
            isError: true,
          }));
          setError(reason);
          typeof memoizedOnError === "function" && memoizedOnError(reason);
          typeof memoizedOnSettled === "function" &&
            memoizedOnSettled(resData, reason);
          return; // Notice this return statement. If the status is fail, we don't need to set data state below
        }
        // This will set fresh data, so we need to reset beforeStaleTime
        metadata.current.beforeStaleTime = Date.now();
        // setError("");
        // setData(resData);
      }
    },
    [
      isStale,
      dataStayInSync,
      staleTime,
      isFetching,
      markUpdatesAsTransitions,
      memoizedOnError,
      memoizedOnSuccess,
      memoizedOnSettled,
      memoizedOnMutated,
    ]
  );

  // subscribe changes on every queryKey changes
  useEffect(() => {
    subscribeChanges(
      hookID,
      queryKey,
      onQueryChanges,
      onInvalidate,
      onCancelQuery
    );

    return () => {
      unsubscribeChanges(hookID, queryKey);
    };
  }, [onQueryChanges, queryKey, hookID, onInvalidate, onCancelQuery]);

  /**
   *Function to initiate network request by calling user provided fetcher function
   * @param {string} queryKey
   * @param {*} params
   */
  function fetchData(queryKey: string, params: any) {
    if (!fetcher) {
      throw new Error("You need to provide fetcher function!");
    }

    clearTimeout(metadata.current.staleTimeOutId);
    if (isInOngoingRequestQueue(queryKey)) {
      // console.log("data is already in queue", { queryKey });
      return;
    }

    // console.log("running fetcher");

    const requestID = getRandomID();
    addToOngoingRequestQueue(queryKey, requestID);
    operation.current.setActiveOperation(queryKey);
    fetcher(params)
      .then((response) => {
        // Will notify changes if this network request is still active and in ongoing queue
        // If we don't prevent this, there will be race conditions.

        //console.log({ response });
        if (
          operation.current.isActiveOperation(queryKey) &&
          isActualOngoingRequest(queryKey, requestID)
        ) {
          // console.log("receiving response", queryKey);

          if (typeof notifyQueryChanges === "function") {
            notifyQueryChanges({
              dataQueryKey: queryKey,
              data: response,
              status: statuses.success,
              reason: "Network request successfully completed",
            });
          }

          operation.current.cancelOperation();
        }
      })
      .catch((err) => {
        // console.log("error occur", { err });
        operation.current.cancelOperation();
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }
        if (typeof notifyQueryChanges === "function") {
          notifyQueryChanges({
            dataQueryKey: queryKey,
            data,
            status: statuses.fail,
            reason: err,
          });
        }
      });
  }

  /**
   * Force refetch. Will invalidate the ongoing request and restart fetching i.e if there is already ongoing request, that request will be cancelled
   * @param {*} param  provide context to fetcher function
   */
  function forceRefetch(param: any) {
    // console.log("forced refetch");

    setStatus((prevStatus) => ({
      ...prevStatus,
      isLoading: false,
      isFetching: true,
      isStale: false,
      isError: false,
    }));
    setError("");

    // When we need to force refetch, we need to remove from ongoing request queue
    removeFromOngoingRequestQueue(queryKey);
    // Cancel previous fetch
    operation.current.cancelOperation();
    fetchData(queryKey, { dataQueryKey, param });
  }

  /**
   * Useful if you set autoFetchEnabled to false. You can manually fetch data by using this function. It won't initiate new network request if there is already one exist
   * @param {any} param Pass param object if you want to provide context to fetcher function
   */
  function refetch(param?: any) {
    // console.log("refetch", { param });
    setStatus((prevStatus) => ({
      ...prevStatus,
      isLoading: false,
      isFetching: true,
      isStale: false,
      isError: false,
    }));
    setError("");

    fetchData(queryKey, { dataQueryKey, param });
  }

  // Register callback that will be invoked when window gain focus after losing it
  const isWindowFocused = useRef(
    typeof document !== "undefined" && document.hasFocus()
  );
  useEffect(() => {
    const handleFocus = () => {
      if (!isWindowFocused.current) {
        if (refetchOnWindowFocus) {
          // console.log("refetch on window focus");
          refetch();
        }
      }
      isWindowFocused.current = true;
    };

    const handleBlur = () => {
      isWindowFocused.current = false;
    };

    if (typeof window !== "undefined" && autoFetchEnabled) {
      window.addEventListener("focus", handleFocus);
      window.addEventListener("blur", handleBlur);
    }

    return () => {
      if (typeof window !== "undefined" && autoFetchEnabled) {
        window.removeEventListener("focus", handleFocus);
        window.removeEventListener("blur", handleBlur);
      }
    };
  });

  useEffect(() => {
    metadata.current.staleTimeOutId = setTimeout(() => {
      // console.log("stale");
      setStatus((prevStatus) => ({ ...prevStatus, isStale: true }));
    }, staleTime);

    return () => {
      clearTimeout(metadata.current.staleTimeOutId);
    };
  }, [data, error, staleTime]);

  // Effect will run on every queryKey changes
  useEffect(() => {
    // During subsequent renders not initial render, if the queryKey changed, Effect logic will run
    if (
      metadata.current.prevKey !== queryKey &&
      typeof window !== "undefined" &&
      !metadata.current.isInitialCall &&
      autoFetchEnabled // Even if the query key was changed, the new network request will not be initiated if we've disabled autoFetchEnable
    ) {
      // console.log("query key changed");
      setStatus((prevStatus) => ({
        ...prevStatus,
        isLoading: !keepValueOnKeyChanges,
        isFetching: true,
        isStale: false,
        isError: false,
        isInvalidating: false,
      }));

      // we need to cancel previous fetch operation, because queryKey was changed.
      // we need to start new fetch operation
      operation.current.cancelOperation();
      metadata.current.prevKey = queryKey;
      if (!keepValueOnKeyChanges) {
        setData(
          stateInitializer({
            key: queryKey,
            cacheTime,
            keepCacheAlways,
          } as StateInitializerProps)
        );
      }

      fetchData(queryKey, { dataQueryKey: getQueryKeyAsArray(queryKey) });
    }
  });
  //  [
  //   queryKey,
  //   cacheTime,
  //   autoFetchEnabled,
  //   fetchData,
  //   keepValueOnKeyChanges,
  //   keepCacheAlways,
  // ]

  useEffect(() => {
    const isInitialCall = metadata.current.isInitialCall;
    if (typeof window !== undefined) {
      // console.log("running effect");
      if (!autoFetchEnabled) {
        if (isInitialCall) {
          metadata.current.isInitialCall = false;
        }
        metadata.current.previouslyEnabledAutoFetch = false;
      }

      if (autoFetchEnabled) {
        const previouslyEnabledAutoFetch =
          metadata.current.previouslyEnabledAutoFetch;

        if (
          isInitialCall ||
          isInvalidating ||
          previouslyEnabledAutoFetch === false
        ) {
          if (previouslyEnabledAutoFetch === false) {
            metadata.current.previouslyEnabledAutoFetch = true;
          }
          fetchData(queryKey, { dataQueryKey: getQueryKeyAsArray(queryKey) });
        }
      }
    }
  });
  // [fetchData, queryKey, isInvalidating, autoFetchEnabled]

  return Object.freeze({
    dataQueryKey,
    data,
    isFetching: status.isFetching,
    isLoading: status.isLoading && !data,
    isError: status.isError,
    isStale: status.isStale,
    error,
    refetch,
    forceRefetch,
  });
};
