import { useDataMutation } from "./useDataMutation";
import { useExperimentalInfiniteDataQuery } from "./useExperimentalInfiniteDataQuery";
import { useInfiniteDataQuery } from "./useInfiniteDataQuery";
export const useHookTest = () => {
    const { data } = useInfiniteDataQuery([1, "test"], () => Promise.resolve(0), {
        getNextPageParam(lastPage, pages) { },
        getPrevPageParam(firstPage, pages) {
            firstPage[0].label;
        },
    });
    const { data: d } = useExperimentalInfiniteDataQuery([2], undefined, { current: document.createElement("div") }, {
        onReset(fetcher) {
            fetcher(23);
        },
    });
    useDataMutation(() => Promise.resolve(22), {
        onError(err, data, context) { },
        onMutate: (newData) => {
            newData;
            return Promise.resolve({ hero: [{ name: "akk" }] });
        },
    });
    return { data, d };
};
