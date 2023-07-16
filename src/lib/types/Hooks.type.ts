import { DataQueryKeyType, OptionsType } from "../context/ProviderTypes.type";

export { DataQueryKeyType };

export type ReasonType = Error | string | null;

export type MutatorFunType = (newData: any) => Promise<any>;

export type Context = { dataQueryKey: DataQueryKeyType; param: any };
export type FetcherType =
  | null
  | undefined
  | ((context: Context) => Promise<any>);

export type OnSuccessFunType = (data: any) => void;
export type OnErrorFunType = (err: ReasonType) => void;
export type OnSettledFunType = (data: any, reason: ReasonType) => void;
export type OnMutatedFunType = (data: any) => void;

export type UseDataQueryOptionsType = Omit<OptionsType, "offsetBottom"> & {
  onSuccess?: OnSuccessFunType;
  onError?: OnErrorFunType;
  onSettled?: OnSettledFunType;
  onMutated?: OnMutatedFunType;
};

export type MetadataType = {
  isInitialCall: boolean;
  beforeStaleTime: number;
  staleTimeOutId: number | undefined;
  prevKey: string;
  previouslyEnabledAutoFetch: boolean;
};
