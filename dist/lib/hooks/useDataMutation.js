import { useState } from "react";
/**
 * Use to mutate remote data and will not cache
 * @param {*} mutator function that make the network request with POST method
 * @param {*} callbacks an object that contains callback methods such as onSuccess, onError, onSettled and onMutate
 * @returns
 */
export const useDataMutation = (mutator, callbacks) => {
    const [isMutating, setIsMutating] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const { onSuccess, onError, onSettled, onMutate } = callbacks;
    const mutate = async (newData) => {
        setIsMutating(true);
        setIsError(false);
        if (!isMutating) {
            let isError = false;
            let error = null;
            let context = {};
            let data = null;
            try {
                if (typeof onMutate === "function") {
                    context = await onMutate(newData);
                }
                data = await mutator(newData);
                onSuccess && onSuccess(data, context);
            }
            catch (err) {
                isError = true;
                error = err;
                onError && onError(error, newData, context);
            }
            finally {
                console.log("finally", { isError });
                setIsError(isError);
                onError && setError(error);
                setIsMutating(false);
                setData(data);
                onSettled && onSettled(newData, error, context);
            }
        }
    };
    return {
        data,
        isMutating,
        isError,
        error,
        mutate,
    };
};
