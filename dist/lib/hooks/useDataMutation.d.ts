import { MutatorFunType } from "../types/Hooks.type";
export { MutatorFunType };
export type MutationCallbacksType = {
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
export declare const useDataMutation: (mutator: MutatorFunType, callbacks: MutationCallbacksType) => {
    data: any;
    isMutating: boolean;
    isError: boolean;
    error: Error | null;
    mutate: (newData: any) => Promise<void>;
};
