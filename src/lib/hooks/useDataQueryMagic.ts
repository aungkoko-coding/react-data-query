import { useCallback, useMemo } from "react";
import { useDataQueryContext } from "../context/DataQueryProvider";
import { clearAllCache, clearCache, getFromCache } from "../utils/cache-utils";
import { DataQueryKeyType } from "../context/ProviderTypes.type";

type QuerySetterType = (prevData: any) => void | any;

/**
 * Controls cache and network requests
 * @returns {Object} queryMagic instance
 */
export const useDataQueryMagic = () => {
  const { mutateQuery, notifyInvalidation, notifyCancellationOfQuery } =
    useDataQueryContext();

  /**
   * When we invalidate query, the components who use Hooks with the same dataQueryKey will initiate a new network request. Not multiple requests. But every components with the same dataQueryKey will get isFetching and isValidating indicators as true i.e. Every components with the same dataQueryKey will be re-rendered
   * @param {*} dataQueryKey
   */
  const invalidateQuery = useCallback(
    (dataQueryKey: DataQueryKeyType) => {
      if (!dataQueryKey) throw new TypeError("Falsy values are not allowed");
      if (notifyInvalidation) {
        notifyInvalidation(dataQueryKey.toString());
      }
    },
    [notifyInvalidation]
  );

  /**
   * Invalidate all data queries with the same data queries. All components in which Hooks with the same dataQueryKeys will be re-rendered
   * @param {*} dataQueryKeys an array of dataQueryKey
   */
  const invalidateQueries = useCallback(
    (dataQueryKeys: DataQueryKeyType[]) => {
      if (!Array.isArray(dataQueryKeys))
        throw new TypeError("Please provide an array of dataQueryKeys!");
      for (const dataQueryKey of dataQueryKeys) {
        invalidateQuery(dataQueryKey);
      }
    },
    [invalidateQuery]
  );

  /**
   * Set data query without triggering new network request.
   *
   * @param {*} dataQueryKey is used to set data query. Data type that don't have toString method is not allowed
   * @param {*} querySetter is used to set new data. function or any value are allowed
   */
  const setQueryData = useCallback(
    (dataQueryKey: DataQueryKeyType, querySetter: QuerySetterType) => {
      if (!dataQueryKey)
        throw new TypeError("Don't provide falsy value as dataQueryKey");
      let data = null;
      if (typeof querySetter === "function") {
        const cache = getFromCache(dataQueryKey.toString());
        let cacheObj = data;
        if (cache && cache.data) {
          cacheObj = cache.data;
        }
        data = querySetter(cacheObj);
      } else data = querySetter;

      if (mutateQuery) mutateQuery(dataQueryKey.toString(), data);
    },
    [mutateQuery]
  );

  /**
   * Set data queries without triggering new network requests.
   * @param {object} dataQueries an array of dataQuery objects in which must contain dataQueryKey, querySetter.
   */
  const setQueriesData = useCallback(
    (
      dataQueries: {
        dataQueryKey: DataQueryKeyType;
        querySetter: QuerySetterType;
      }[]
    ) => {
      if (!Array.isArray(dataQueries))
        throw new TypeError(
          "Please provide an array of dataQuery objects in which must contain dataQueryKey and querySetter!"
        );
      for (const dataQuery of dataQueries) {
        const { dataQueryKey, querySetter } = dataQuery;
        setQueryData(dataQueryKey, querySetter);
      }
    },
    [setQueryData]
  );

  /**
   * Retrieve data from cache
   * @param {*} dataQueryKey
   * @returns {Object | undefined}
   */
  const getQueryData = useCallback((dataQueryKey: DataQueryKeyType) => {
    if (!dataQueryKey)
      throw new TypeError("Don't provide dataQueryKey as falsy value!");
    let data = null;
    const cache = getFromCache(dataQueryKey.toString());
    if (cache && cache.data) {
      data = cache.data;
    }

    return data;
  }, []);

  /**
   * Retrieve more than one data from cache
   * @param {*} dataQueryKeys must be an array
   * @returns {Array<Object> | Array<undefined>} array of data from the cache
   */
  const getQueriesData = useCallback(
    (dataQueryKeys: DataQueryKeyType[]) => {
      if (!Array.isArray(dataQueryKeys))
        throw new TypeError("dataQueryKeys must be an array!");
      const dataArr = [];
      for (const dataQueryKey of dataQueryKeys) {
        dataArr.push(getQueryData(dataQueryKey));
      }
      return dataArr;
    },
    [getQueryData]
  );

  /**
   * Cancel the ongoing network request
   * @param {*} dataQueryKey
   * @returns {Promise<void>} promise which will be resolved when the function finish executing
   */
  const cancelQuery = useCallback(
    async (dataQueryKey: DataQueryKeyType) => {
      if (!dataQueryKey)
        throw new TypeError("Don't provide dataQueryKey as falsy value!");
      if (notifyCancellationOfQuery)
        notifyCancellationOfQuery(dataQueryKey.toString());
    },
    [notifyCancellationOfQuery]
  );

  /**
   * Clear specific data from cache
   * @param {*} dataQueryKey
   */
  const clearCacheData = useCallback((dataQueryKey: DataQueryKeyType) => {
    if (!dataQueryKey)
      throw new TypeError("Don't provide dataQueryKey as falsy value!");
    clearCache(dataQueryKey.toString());
  }, []);

  /**
   * Clear all data from cache
   */
  const clearAllCachesData = useCallback(() => {
    clearAllCache();
  }, []);

  const dataQueryMagicInstance = useMemo(
    () =>
      Object.freeze({
        setQueryData,
        setQueriesData,
        getQueryData,
        getQueriesData,
        cancelQuery,
        clearAllCachesData,
        clearCacheData,
        invalidateQuery,
        invalidateQueries,
      }),
    [
      setQueryData,
      setQueriesData,
      invalidateQuery,
      invalidateQueries,
      getQueryData,
      getQueriesData,
      cancelQuery,
      clearAllCachesData,
      clearCacheData,
    ]
  );

  return dataQueryMagicInstance;
};
