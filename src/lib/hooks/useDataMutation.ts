import { useState } from "react";
import { MutatorFunType } from "../types/Hooks.type";
export { MutatorFunType };

export type MutationCallbacksType<MutatorInput, ReturnedData, Context> = {
  onSuccess?: (data: ReturnedData | null | undefined, context: Context) => void;
  onError?: (
    err: Error,
    data: ReturnedData | null | undefined,
    context: Context
  ) => void;
  onSettled?: (
    data: ReturnedData | null | undefined,
    err: Error | null,
    context: Context
  ) => void;
  onMutate?: (newData: MutatorInput) => Promise<Context>;
};

/**
 * Use to mutate remote data and will not cache
 * @param {*} mutator function that make the network request with POST method
 * @param {*} callbacks an object that contains callback methods such as onSuccess, onError, onSettled and onMutate
 * @returns
 */
export const useDataMutation = <
  MutatorInput = any,
  ReturnedData = any,
  Context = any
>(
  mutator: MutatorFunType<ReturnedData>,
  callbacks?: MutationCallbacksType<MutatorInput, ReturnedData, Context>
) => {
  const [status, setStatus] = useState({
    isMutating: false,
    isSuccess: false,
    isError: false,
  });
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ReturnedData | null | undefined>(null);

  const { onSuccess, onError, onSettled, onMutate } = callbacks || {};

  const mutate = async (newData: any) => {
    setStatus({ isMutating: true, isSuccess: false, isError: false });

    if (!status.isMutating) {
      let isError = false;
      let error: Error | null = null;
      let context: Context = null as Context;
      let data: ReturnedData | null = null;

      try {
        if (typeof onMutate === "function") {
          context = await onMutate(newData);
        }
        data = await mutator(newData);
        typeof onSuccess === "function" && onSuccess(data, context);
      } catch (err) {
        isError = true;
        error = err as Error | null;
        typeof onError === "function" &&
          onError(error as Error, newData, context);
      } finally {
        setError(error);
        setStatus({ isMutating: false, isError, isSuccess: !isError });
        setData(data);
        typeof onSettled === "function" && onSettled(newData, error, context);
      }
    }
  };

  return Object.freeze({
    data,
    ...status,
    error,
    mutate,
  });
};
