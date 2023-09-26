"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, createContext, useContext } from "react";
import { status } from "../utils/utils";
import { cacheData } from "../utils/cache-utils";
import { getCancelQueryCallbacks, getInvalidationCallbacks, getQueryChangesCallbacks, removeFromOngoingRequestQueue, } from "../utils/queue-utils";
const defaultOptions = {
    cacheTime: 1000 * 60 * 5,
    staleTime: 1000 * 10,
    keepCacheAlways: false,
    keepValueOnKeyChanges: true,
    dataStayInSync: true,
    autoFetchEnabled: true,
    refetchOnWindowFocus: true,
    markUpdatesAsTransitions: false,
    offsetBottom: 0, // set any value that can be converted to number. This option is useful when you want to fetch data before the scroll position reaches the bottom. Use with infinite scroll Hook.
};
const statuses = status;
const DataQueryContext = createContext({
    options: defaultOptions,
});
export const DataQueryProvider = ({ options = defaultOptions, children, }) => {
    const finalOptions = { ...defaultOptions, ...options };
    const { cacheTime, staleTime, keepCacheAlways, keepValueOnKeyChanges, dataStayInSync, autoFetchEnabled, refetchOnWindowFocus, markUpdatesAsTransitions, offsetBottom, } = finalOptions;
    if (typeof options !== "object")
        throw new TypeError("'options' must be an object!");
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
        throw new TypeError("Please provide markUpdatesAsTransitions as boolean type");
    if (offsetBottom < 0 || Number.isNaN(offsetBottom))
        throw new TypeError("'offsetBottom' options must be number type which is greater than or equal to zero");
    /**
     * This function will also set status state in every subscription callbacks
     */
    const notifyInvalidation = useCallback((dataQueryKey) => {
        getInvalidationCallbacks(dataQueryKey.toString())?.forEach((callback) => callback());
    }, []);
    /**
     *  Cancel ongoing network request
     * @param {*} dataQueryKey
     */
    const notifyCancellationOfQuery = useCallback((dataQueryKey) => {
        getCancelQueryCallbacks(dataQueryKey.toString())?.forEach((callback) => callback());
        removeFromOngoingRequestQueue(dataQueryKey.toString());
    }, []);
    const notifyQueryChanges = useCallback(({ dataQueryKey, data, status, reason }) => {
        if (status !== statuses.fail) {
            cacheData({
                key: dataQueryKey.toString(),
                data,
            });
        }
        getQueryChangesCallbacks(dataQueryKey.toString())?.forEach((callback) => callback(data, status, reason));
        if (status !== statuses.mutate) {
            // We need to remove it from request queue when the data has arrived
            removeFromOngoingRequestQueue(dataQueryKey.toString());
        }
    }, []);
    const mutateQuery = useCallback((dataQueryKey, data) => {
        notifyQueryChanges({
            dataQueryKey,
            data,
            status: statuses.mutate,
            reason: "Mutate",
        });
    }, [notifyQueryChanges]);
    return (_jsx(DataQueryContext.Provider, { value: {
            options: finalOptions,
            notifyQueryChanges,
            notifyInvalidation,
            notifyCancellationOfQuery,
            mutateQuery,
        }, children: children }));
};
export const useDataQueryContext = () => useContext(DataQueryContext);
