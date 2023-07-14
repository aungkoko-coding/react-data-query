export declare const getQueryKeyAsArray: (queryKey: string) => string[];
export declare const getRandomID: () => string;
/**
 * Utility function for avoiding race condition within single Hook
 * @param {string} initialQueryKey used to set initial value
 * @returns helper object
 */
export declare const getRaceHelper: (initialQueryKey?: string) => {
    cancelOperation: () => void;
    setActiveOperation: (newQueryKey: string) => void;
    isActiveOperation: (queryKey: string) => boolean;
};
export declare const status: Readonly<{
    success: "success";
    fail: "fail";
    mutate: "mutate";
}>;
