import { useState } from "react";
import { MutatorFunType } from "../types/Hooks.type";

type DefaultOptionsType = {
  onSuccess?: (data: any, context: any) => any;
  onError?: (err: Error, data: any, context: any) => any;
  onSettled?: (data: any, err: Error | null, context: any) => any;
  onMutate?: (newData: any) => Promise<any>;
};

/**
 * Use to mutate remote data and will not cache
 * @param {*} mutator function that make the network request with POST method
 * @param {*} callbacks an object that contains callback methods such as onSuccess, onError, onSettled and onMutate
 * @returns
 */
export const useDataMutation = (
  mutator: MutatorFunType,
  callbacks: DefaultOptionsType
) => {
  const [isMutating, setIsMutating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const { onSuccess, onError, onSettled, onMutate } = callbacks;

  const mutate = async (newData: any) => {
    setIsMutating(true);
    setIsError(false);

    if (!isMutating) {
      let isError = false;
      let error: Error | null = null;
      let context: any = {};
      let data: any = null;

      try {
        if (typeof onMutate === "function") {
          context = await onMutate(newData);
        }
        data = await mutator(newData);
        onSuccess && onSuccess(data, context);
      } catch (err) {
        isError = true;
        error = err as Error | null;
        onError && onError(error as Error, newData, context);
      } finally {
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
