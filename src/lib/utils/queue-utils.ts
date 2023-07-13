type OnInvalidateFunctionType = () => void;
type OnQueryChangesFunctionType = (
  data: any,
  status: string,
  reason: string | Error
) => void;
type OnCancelQueryFunctionType = () => void;

// type CBType = {
//   [hookID: string]: [
//     onQueryChanges: OnQueryChangesFunctionType,
//     onInvalidate: OnInvalidateFunctionType,
//     onCancelQuery: OnCancelQueryFunctionType
//   ];
// };

type CallbacksType = {
  [queryKey: string]: {
    [hookID: string]: [
      onQueryChanges: OnQueryChangesFunctionType,
      onInvalidate: OnInvalidateFunctionType,
      onCancelQuery: OnCancelQueryFunctionType
    ];
  };
};

const callbacks: CallbacksType = {};
const ongoingRequestQueue = new Map();

export const subscribed = (hookId: string, queryKey: string): boolean => {
  if (!callbacks[queryKey]) {
    return false;
  }
  return !!callbacks[queryKey][hookId];
};

export const subscribeChanges = (
  hookId: string,
  queryKey: string,
  onQueryChanges: OnQueryChangesFunctionType,
  onInvalidate: OnInvalidateFunctionType,
  onCancelQuery: OnCancelQueryFunctionType
) => {
  if (!subscribed(hookId, queryKey)) {
    if (!callbacks[queryKey]) {
      callbacks[queryKey] = {};
    }
    callbacks[queryKey][hookId] = [onQueryChanges, onInvalidate, onCancelQuery];
    // console.log("subscribed", callbacks[queryKey]);
  }
};

export const unsubscribeChanges = (hookId: string, queryKey: string) => {
  if (!callbacks[queryKey]) return;

  delete callbacks[queryKey][hookId];
  // console.log("unsubscribed", callbacks[queryKey]);
  if (Object.keys(callbacks[queryKey]).length === 0) {
    delete callbacks[queryKey];
  }
};

const getCallbacks = (queryKey: string, index: number) => {
  if (!callbacks[queryKey]) {
    return null;
  }
  return Object.values(callbacks[queryKey]).map((c) => c[index]);
};

export const getQueryChangesCallbacks = (queryKey: string) => {
  return getCallbacks(queryKey, 0) as OnQueryChangesFunctionType[] | null;
};

export const getInvalidationCallbacks = (queryKey: string) => {
  return getCallbacks(queryKey, 1) as OnInvalidateFunctionType[] | null;
};

export const getCancelQueryCallbacks = (queryKey: string) => {
  return getCallbacks(queryKey, 2) as OnCancelQueryFunctionType[] | null;
};

export const addToOngoingRequestQueue = (
  queryKey: string,
  requestID: string
): void => {
  // console.log("added ongoing queue", { queryKey, requestID });
  // We need to store requestID too. Because when the user cancels query or queryKey changes, we need to check requestID inside "then" callback function of promise who initiated network request. So that there will not be race conditions
  ongoingRequestQueue.set(queryKey, requestID);
};

export const removeFromOngoingRequestQueue = (queryKey: string): boolean => {
  const removed = ongoingRequestQueue.delete(queryKey.toString());
  // console.log("remove ongoing queue", { queryKey, removed });
  return removed;
};

export const isInOngoingRequestQueue = (queryKey: string): boolean => {
  return ongoingRequestQueue.has(queryKey);
};

export const isActualOngoingRequest = (
  queryKey: string,
  requestID: string
): boolean => {
  return (
    ongoingRequestQueue.has(queryKey) &&
    ongoingRequestQueue.get(queryKey) === requestID
  );
};
