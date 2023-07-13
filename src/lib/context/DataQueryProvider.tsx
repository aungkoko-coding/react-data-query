import React, {
  createContext,
  useCallback,
  useContext,
  isValidElement,
} from "react";
import { status } from "../utils/utils";
import { cacheData } from "../utils/cache-utils";
import {
  getCancelQueryCallbacks,
  getInvalidationCallbacks,
  getQueryChangesCallbacks,
  removeFromOngoingRequestQueue,
} from "../utils/queue-utils";
import {
  DataQueryKeyType,
  DefaultOptionsContextType,
  NotifyQueryChangesParamType,
  ProviderPropsType,
} from "./ProviderTypes.type";

const defaultOptions = {
  cacheTime: 1000 * 60 * 5, // default 5 mins. set the cache time duration. If it has elapsed, state data will be initialized with empty data when the component mounts or on dataQueryKey changes.
  staleTime: 1000 * 10, // 10 secs by default. This will be used to determine whether the data is stale or not. When staleTime has elapsed, the component will be notified that the data is stale i.e the component will be re-rendered.
  keepCacheAlways: false, // when we set to true, the state data will always get from cache when initializing state. It takes precedence over cacheTime
  keepValueOnKeyChanges: true, // When the query key change, the data with previous key will always be showed, this is useful if we want users to see the screen with previous data until the data for next screen is ready
  dataStayInSync: true, // use to determine whether the hook want to stay in sync when the data was changed(due to new network request) with the same data query key.
  autoFetchEnabled: true, // Set to false, if you want to manually fetch data
  refetchOnWindowFocus: true, // Set to false unless you want fetch data after gaining focus again. This ensure that the app will receive fresh data
  markUpdatesAsTransitions: false, // Mark state updates as transition i.e wrap state setter function in startTransition. If the state update is not critical to the immediate rendering or user experience, you can consider setting to `true`.
  offsetBottom: 0, // set any value that can be converted to number. This option is useful when you want to fetch data before the scroll position reaches the bottom. Use with infinite scroll Hook.
};

const statuses = status;

const DataQueryContext = createContext<DefaultOptionsContextType>({
  options: defaultOptions,
});

export const DataQueryProvider = ({
  options = defaultOptions,
  children,
}: ProviderPropsType) => {
  const finalOptions = { ...defaultOptions, ...options };
  const {
    cacheTime,
    staleTime,
    keepCacheAlways,
    keepValueOnKeyChanges,
    dataStayInSync,
    autoFetchEnabled,
    refetchOnWindowFocus,
    markUpdatesAsTransitions,
    offsetBottom,
  } = finalOptions;

  if (typeof options !== "object")
    throw new TypeError("'options' must be an object!");
  if (!isValidElement(children))
    throw new TypeError("'children' must be valid element");
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
  if (offsetBottom < 0 || Number.isNaN(offsetBottom))
    throw new TypeError(
      "'offsetBottom' options must be number type which is greater than or equal to zero"
    );
  /**
   * This function will also set status state in every subscription callbacks
   */
  const notifyInvalidation = useCallback((dataQueryKey: DataQueryKeyType) => {
    getInvalidationCallbacks(dataQueryKey.toString())?.forEach((callback) =>
      callback()
    );
  }, []);

  /**
   *  Cancel ongoing network request
   * @param {*} dataQueryKey
   */
  const notifyCancellationOfQuery = useCallback(
    (dataQueryKey: DataQueryKeyType) => {
      getCancelQueryCallbacks(dataQueryKey.toString())?.forEach((callback) =>
        callback()
      );
      removeFromOngoingRequestQueue(dataQueryKey.toString());
    },
    []
  );

  const notifyQueryChanges = useCallback(
    ({ dataQueryKey, data, status, reason }: NotifyQueryChangesParamType) => {
      if (status !== statuses.fail) {
        cacheData({
          key: dataQueryKey.toString(),
          data,
        });
      }

      getQueryChangesCallbacks(dataQueryKey.toString())?.forEach((callback) =>
        callback(data, status, reason)
      );
      if (status !== statuses.mutate) {
        // We need to remove it from request queue when the data has arrived
        removeFromOngoingRequestQueue(dataQueryKey.toString());
      }
    },
    []
  );

  const mutateQuery = useCallback(
    (dataQueryKey: any[] | string, data: any) => {
      notifyQueryChanges({
        dataQueryKey,
        data,
        status: statuses.mutate,
        reason: "Mutate",
      });
    },
    [notifyQueryChanges]
  );

  return (
    <DataQueryContext.Provider
      value={{
        options: finalOptions,
        notifyQueryChanges,
        notifyInvalidation,
        notifyCancellationOfQuery,
        mutateQuery,
      }}
    >
      {children}
    </DataQueryContext.Provider>
  );
};

export const useDataQueryContext = () => useContext(DataQueryContext);
