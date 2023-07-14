export const getQueryKeyAsArray = (queryKey) => {
    return queryKey.split(",");
};
const keys = "abcdEFGhHiKjkL0m214832nN";
export const getRandomID = () => {
    let length = keys.length;
    let randomId = "";
    for (let i = 0; i < length; i++) {
        randomId += keys[Math.floor(Math.random() * length)];
    }
    return randomId;
};
/**
 * Utility function for avoiding race condition within single Hook
 * @param {string} initialQueryKey used to set initial value
 * @returns helper object
 */
export const getRaceHelper = (initialQueryKey) => {
    let queryKeyInOperation = initialQueryKey;
    return {
        cancelOperation: () => {
            queryKeyInOperation = null;
        },
        setActiveOperation: (newQueryKey) => {
            queryKeyInOperation = newQueryKey;
        },
        isActiveOperation: (queryKey) => queryKey === queryKeyInOperation,
    };
};
export const status = Object.freeze({
    success: "success",
    fail: "fail",
    mutate: "mutate",
});
