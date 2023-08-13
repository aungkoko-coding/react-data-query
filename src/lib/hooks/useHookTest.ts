import { useDataMutation } from "./useDataMutation";
import { useExperimentalInfiniteDataQuery } from "./useExperimentalInfiniteDataQuery";
import { useInfiniteDataQuery } from "./useInfiniteDataQuery";

type Color = {
  id: number;
  label: string;
};
export const useHookTest = () => {
  const { data } = useInfiniteDataQuery<Color>(
    [1, "test"],
    () => Promise.resolve(0),
    {
      getNextPageParam(lastPage, pages) {},
      getPrevPageParam(firstPage, pages) {
        firstPage[0].label;
      },
    }
  );
  const { data: d } = useExperimentalInfiniteDataQuery<Color>(
    [2],
    undefined,
    { current: document.createElement("div") },
    {
      onReset(fetcher) {
        fetcher(23);
      },
    }
  );

  useDataMutation<
    { age: number },
    { name: string },
    { hero: { name: string }[] }
  >(() => Promise.resolve(22), {
    onError(err, data, context) {},
    onMutate: (newData) => {
      newData;
      return Promise.resolve({ hero: [{ name: "akk" }] });
    },
  });

  return { data, d };
};
