export type OptionsType = {
  cacheTime?: number;
  staleTime?: number;
  keepCacheAlways?: boolean;
  keepValueOnKeyChanges?: boolean;
  dataStayInSync?: boolean;
  autoFetchEnabled?: boolean;
  refetchOnWindowFocus?: boolean;
  markUpdatesAsTransitions?: boolean;
  offsetBottom?: number;
};

export type DefaultOptionsContextType = {
  options: OptionsType;
  notifyQueryChanges?: (params: any) => void;
  notifyInvalidation?: (params: any) => void;
  notifyCancellationOfQuery?: (params: any) => void;
  mutateQuery?: (dataQueryKey: any[] | string, data: any) => void;
};

export type ProviderPropsType = {
  options?: OptionsType;
  children: React.ReactNode;
};

export type DataQueryKeyType = any[] | string;

export type NotifyQueryChangesParamType = {
  dataQueryKey: DataQueryKeyType;
  data: any;
  status: string;
  reason: string;
};
