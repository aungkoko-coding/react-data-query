import { MutatorFunType } from "../types/Hooks.type";
export { MutatorFunType };
export type MutationCallbacksType<MutatorInput, ReturnedData, Context> = {
    onSuccess?: (data: ReturnedData | null | undefined, context: Context) => void;
    onError?: (err: Error, data: ReturnedData | null | undefined, context: Context) => void;
    onSettled?: (data: ReturnedData | null | undefined, err: Error | null, context: Context) => void;
    onMutate?: (newData: MutatorInput) => Promise<Context>;
};
/**
 * Use to mutate remote data and will not cache
 * @param {*} mutator function that make the network request with POST method
 * @param {*} callbacks an object that contains callback methods such as onSuccess, onError, onSettled and onMutate
 * @returns
 */
export declare const useDataMutation: <MutatorInput = any, ReturnedData = any, Context = any>(mutator: MutatorFunType<ReturnedData>, callbacks?: MutationCallbacksType<MutatorInput, ReturnedData, Context> | undefined) => Readonly<{
    error: Error | null;
    mutate: (newData: any) => Promise<void>;
    isMutating: boolean;
    isSuccess: boolean;
    isError: boolean;
    data: ReturnedData | null | undefined;
}>;
