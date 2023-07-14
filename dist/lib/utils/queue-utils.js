const callbacks = {};
const ongoingRequestQueue = new Map();
export const subscribed = (hookId, queryKey) => {
    if (!callbacks[queryKey]) {
        return false;
    }
    return !!callbacks[queryKey][hookId];
};
export const subscribeChanges = (hookId, queryKey, onQueryChanges, onInvalidate, onCancelQuery) => {
    if (!subscribed(hookId, queryKey)) {
        if (!callbacks[queryKey]) {
            callbacks[queryKey] = {};
        }
        callbacks[queryKey][hookId] = [onQueryChanges, onInvalidate, onCancelQuery];
        // console.log("subscribed", callbacks[queryKey]);
    }
};
export const unsubscribeChanges = (hookId, queryKey) => {
    if (!callbacks[queryKey])
        return;
    delete callbacks[queryKey][hookId];
    // console.log("unsubscribed", callbacks[queryKey]);
    if (Object.keys(callbacks[queryKey]).length === 0) {
        delete callbacks[queryKey];
    }
};
const getCallbacks = (queryKey, index) => {
    if (!callbacks[queryKey]) {
        return null;
    }
    return Object.values(callbacks[queryKey]).map((c) => c[index]);
};
export const getQueryChangesCallbacks = (queryKey) => {
    return getCallbacks(queryKey, 0);
};
export const getInvalidationCallbacks = (queryKey) => {
    return getCallbacks(queryKey, 1);
};
export const getCancelQueryCallbacks = (queryKey) => {
    return getCallbacks(queryKey, 2);
};
export const addToOngoingRequestQueue = (queryKey, requestID) => {
    // console.log("added ongoing queue", { queryKey, requestID });
    // We need to store requestID too. Because when the user cancels query or queryKey changes, we need to check requestID inside "then" callback function of promise who initiated network request. So that there will not be race conditions
    ongoingRequestQueue.set(queryKey, requestID);
};
export const removeFromOngoingRequestQueue = (queryKey) => {
    const removed = ongoingRequestQueue.delete(queryKey.toString());
    // console.log("remove ongoing queue", { queryKey, removed });
    return removed;
};
export const isInOngoingRequestQueue = (queryKey) => {
    return ongoingRequestQueue.has(queryKey);
};
export const isActualOngoingRequest = (queryKey, requestID) => {
    return (ongoingRequestQueue.has(queryKey) &&
        ongoingRequestQueue.get(queryKey) === requestID);
};
