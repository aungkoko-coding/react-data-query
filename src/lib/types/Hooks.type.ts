import { DataQueryKeyType, OptionsType } from "../context/ProviderTypes.type";

export { DataQueryKeyType };

export type ReasonType = Error | string | null;

export type MutatorFunType<T> = (newData: T) => Promise<any>;

export type Context = { dataQueryKey: DataQueryKeyType; param: any };
export type FetcherType =
  | null
  | undefined
  | ((context: Context) => Promise<any>);

export type OnSuccessFunType<T> = (data: T) => void;
export type OnErrorFunType = (err: ReasonType) => void;
export type OnSettledFunType<T> = (data: T, reason: ReasonType) => void;
export type OnMutatedFunType<T> = (data: T) => void;

export type UseDataQueryOptionsType<T> = Omit<OptionsType, "offsetBottom"> & {
  initialData?: T;
} & {
  onSuccess?: OnSuccessFunType<T>;
  onError?: OnErrorFunType;
  onSettled?: OnSettledFunType<T>;
  onMutated?: OnMutatedFunType<T>;
};

export type MetadataType = {
  isInitialCall: boolean;
  beforeStaleTime: number;
  staleTimeOutId: number | undefined;
  prevKey: string;
  previouslyEnabledAutoFetch: boolean;
};
