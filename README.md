# [React Data Query](https://www.npmjs.com/package/react-data-query)

## Features

- auto caching
- data are in sync across multiple Hooks.
- ability to combine the same multiple network requests (determined by `dataQueryKey`) into a single one.
- ability to avoid race conditions.
- reducing the number of render times as much as possible.
- freshness of data are guaranteed (depends on passed `options` object).
- can also be used to manage state as it has been built using callbacks and guarantee to re-render only affected components.

## Description

Client side data fetching and callback-based state management library. Library's syntaxes and functionalities are very similar to and inspired by [`react-query`](https://www.npmjs.com/package/@tanstack/react-query) library. RDQ makes network requests and cache the results along with the `dataQueryKey`.

> I know this library is decreasing popularity because I initially released using JavaScript. So people who are using this have to look back documentation to know how to use exactly. But from version `2.1.0`, you will get the helps of Intellisense.

> I am not sure that this library is production-grade. So don't take it seriously.

## Version History

- `1.0.0` and `2.0.0` were deprecated. Because of unexpected Error.
- `2.0.2`, `2.0.3` and `2.0.4` were unpublished. Because I made a small change and published it without testing. As the result, it causes the Error. I will try not to happen like that again.
- `2.0.9` - Fixed setting data of `useInfiniteDataQuery` via `setQueryData` and `setQueriesData`. Read API Reference of `useInfiniteDataQuery`
- `2.1.0` integrated with TypeScript.
- From `2.1.9`, you can import TypeScript types.
- `2.2.0` - From this version, giving you the flexibilities to describe what `data` type will be returned and how the shape of the `context` will be look like. And more...
  <br />
  > Please install the latest version

## Live Demos

<!-- https://promptopia-akk-rdq.vercel.app/
<a href="https://github.com/AKK-soft-dev/promptopia-akk-rdq">
<img src="https://github.com/fluidicon.png" alt="GitHub Icon" width="15" height="15">
</a>

<br /><br /> -->

Coming soon!

## Installation

```sh
npm install react-data-query
```

Please note that `react-data-query` was built using react `^18.2.0`and react-dom with the same version.

## Usage Example

> Note: before you start using Hooks, you need to wrap your components with`DataQueryProvider`, which is a context provider for all Hooks. You should put `DataQueryProvider` on top of all your components. For example :

```jsx
import { DataQueryProvider } from "react-data-query";

export default function App(props) {
  return <DataQueryProvider>{/* your components */}</DataQueryProvider>;
}
```

Now you can start using Hooks provided by `react-data-query` library!

```jsx
import { useDataQuery } from "react-data-query";

const fetchPets = (context) => {
  return fetch("url").then((res) => res.json());
};

export const Pets = (props) => {
  const queryInstance = useDataQuery(["pets"], fetchPets);

  return <div>{/* some jsx elements */}</div>;
};
```

## API References

### Context

#### `DataQueryProvider`

`DataQueryProvider` is a context provider for all components in which they are using library's Hooks. Hooks that were not passed any `options` by library users, will gains the default `options` from this provider.

`DataQueryProvider` accepts only two props called `options` and `children`. `options` accepts only `object` type. For example :

```jsx
<DataQueryProvider options={{...}}>
```

##### `options`'s properties

| Name                       | Type      | Default                  | Description                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | --------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cacheTime`                | `number`  | `1000 * 60 * 5` (5 mins) | Set the cache time duration in milliseconds. If it has elapsed, the state data will then be set with empty data while the data is being fetched when the component mounts or on `dataQueryKey` changes.                                                                                                                                                                                                          |
| `staleTime`                | `number`  | `1000 * 10` (10 secs)    | Set the stale time duration in milliseconds. This will be used to determine whether the data is stale or not. When `staleTime` has elapsed, the component will be notified that the data is stale, i.e the component will be re-rendered. If the `staleTime` doesn't elapse yet, fresh data that was caused by new network request of other Hooks with the same `dataQueryKey` won't be set to the current Hook. |
| `keepCacheAlways`          | `boolean` | `false`                  | If set to `true`, the state data will always get from cache when initializing state. It takes precedence over `cacheTime`.                                                                                                                                                                                                                                                                                       |
| `keepValueOnKeyChanges`    | `boolean` | `true`                   | When the `dataQueryKey` changes, the data with previous key will always be shown. This is useful if we want users to see the screen with previous data until the data for the next screen is ready.                                                                                                                                                                                                              |
| `dataStayInSync`           | `boolean` | `true`                   | Use to determine whether the hook want to stay in sync when the data was changed (due to new network request) with the same `dataQueryKey`.                                                                                                                                                                                                                                                                      |
| `autoFetchEnabled`         | `boolean` | `true`                   | Set to `false` if you want to manually fetch data. Typically use in dependent queries by toggling this property.                                                                                                                                                                                                                                                                                                 |
| `refetchOnWindowFocus`     | `boolean` | `true`                   | Set to `false` unless you want to fetch data when gains focus again after losing it. This can ensure that the app receives fresh data.                                                                                                                                                                                                                                                                           |
| `markUpdatesAsTransitions` | `boolean` | `false`                  | Mark state updates as transition, i.e wrap state setter functions within the `startTransition` function. If the state update is not critical to the immediate rendering or user experience, you can consider setting to `true`.                                                                                                                                                                                  |
| `offsetBottom`             | `number`  | `0`                      | Set any value that can be converted to number. This option is useful when you want to fetch data before the scroll position reaches the bottom. Use with `useExperimentalInfiniteScrollDataQuery` Hook.                                                                                                                                                                                                          |

### Hooks

`useDataQuery`, `useDataMutation`, `useInfiniteDataQuery`, `useExperimentalInfiniteScrollDataQuery`, and `useDataQueryMagic`

### TypeScript

```tsx
// Type parameter `T` for the shape of returned `data`
useDataQuery<T>(dataQueryKey, fetcher?, options?)

// `MutatorInput` defines the shape of the argument passed to `mutate` and `onMutate` callback's parameter
// `ReturnedData` defines the shape of the returned data
// `Context` defines the shape of callbacks's parameter `onSuccess`, `onError`, and `onSettled`. `onMutate` callback should return the promise that resolve `Context` data type.
useDataMutation<MutatorInput, ReturnedData, Context>(mutator, callbacks?)

// Type parameter `T` for the shape of returned `data`. You DON'T NEED to define array type. Just need to define the shape of each item.
// For example, if you pass Color type argument, it will return like Color[][]
useInfiniteDataQuery<T>(dataQueryKey, fetcher, options);

// Same as `useInfiniteDataQuery` Hook.
useExperimentalInfiniteScrollDataQuery<T>(
  dataQueryKey,
  fetcher,
  containerRef,
  options
);

```

#### `useDataQuery`

A Hook to make developer's life easier. This Hook will help you in fetching data and keep you away from handling caches. You don't need to implement imperative stuffs. You can also use this Hook to manage state. Other Hooks, except `useDataMutation`, were built on top of this Hook.

```jsx
useDataQuery(dataQueryKey, fetcher?, options?)
```

**Parameters**

- `dataQueryKey` - can be any type. Better avoid falsy values. This helps to keep the query in queue and cache. When this value changed, the new data has to be initialized, i.e the new network request will be initiated. You don't need to worry about network request duplications as `react-data-query` will internally handle it.
- `fetcher` - the function who initiates network request. Must return promise that will be resolved by the result of network request completion. For example:

```js
const fetcher = (context) => fetch('url`).then(res => res.json());
```

> `context` is an object that contains `dataQueryKey` and `param` properties. `param` can be of any type that is passed as the argument of `refetch` function returned by `useDataQuery`.
> Note also that you should not try to catch network related error in `fetcher` function. `useDataQuery` will notify you whenever the error occurs.

- `options` - to override the `options` received from `DataQueryProvider`. You can also pass callback functions such as `onSuccess`, `onError`, `onSettled`, and `onMutated`.

  - `initialData`(v2.2.0) - initial data to return. It will be cached silently i.e other Hooks with same `dataQueryKey` will not be notified when it is being cached. Please note that if the data with the same `dataQueryKey` already exists in the cache, that cached data will return instead of `initialData`.
  - `onSuccess(data)` - which will be invoked when network request successfully completed.
  - `onError(reason)` - which will be invoked when network related error has occurred. All `onError` callbacks passed to library Hooks will not automatically be invoked on Server Error (HTTP statuses like `404`, `500`). You must explicitly throw it in your fetcher function.

  ```js
  fetch(...).then(res => {
    if(!res.ok) throw new Error(...)
    return res.json();
  })
  ```

  - `onSettled(data, reason)` - which will be invoked whether or not succeeded or failed`.
  - `onMutated(data)` - which will be invoked when you invoke `setQueryData` and `setQueriesData` functions returned from `useDataQueryMagic` Hook.

  ```

  ```

**Return**
Read only query instance object whose properties are :
| Name | Type | Description |
| ------- | ----- | ---- |
| `dataQueryKey` | `any` | the first argument of `useDataQuery` Hook |
| `data` | `any` | the value that resolved to the returned Promise of your fetcher function |
| `error` | `any` | The reason why error occurred |
| `isLoading` | `boolean` | Indicating whether the data is being fetched. `true` for only first time network request. But if you have disabled `keepValueOnKeyChanges`, this will be set to true if there is no cache for new `dataQueryKey`. |
| `isFetching` | `boolean` | Indicating whether the data is being fetched. This will always be `true` on every network requests. |
| `isError` | `boolean` | Indicating whether the network related error has occurred. |
| `isStale` | `boolean` | Indicating whether the data becomes stale or not. The component will be re-rendered when the data becomes stale. |
|`refetch` | `function` | A function to manually fetch data. When you call this function, the new network request will be initiated only if there is no already ongoing request with the same `dataQueryKey`. When the data becomes available, the Hook will be notified with new data and update the `data` state with that new data. |
| `forceRefetch` | `function` | Unlike `refetch` function, this will cancel ongoing network request with the same `dataQueryKey` and initiate the new network request. |

> Cancelling network request doesn't actually cancel the request. It is just protecting from race conditions. However, future releases will actually cancel the network request by using `AbortController`.

**Parallel Data Query**

```jsx
const { data: users } = useDataQuery("users", fetcher, options);
const { data: pets } = useDataQuery("pets", fetcher, options);
```

**Dependent Data Query**
_Fetch channel after the user becomes available_

```jsx
const { data: user } = useDataQuery(`user`, fetcher, options);
const { data: channel } = useDataQuery(["channel", user?.id], fetcher, {
  autoFetchEnabled: !!user?.id,
});
```

**Paginated Data Query**

You can fetch paginated data using this Hook. For example :

```jsx
import { useState } from "react";
import { useDataQuery } from "react-data-query";

const fetcher = (context) => {
  const { dataQueryKey } = context;
  return fetch(`https://.../pets?page=${dataQueryKey[1]}`).then((res) =>
    res.json()
  );
};

// To keep previous value until the data for the next page is ready
const options = { keepValueOnKeyChanges: true };
export const Pets = (props) => {
  const [page, setPage] = useState(0);
  const { data: pets, isFetching } = useDataQuery(
    [`pets`, page],
    fetcher,
    options
  );

  return (
    <div>
      {isFetching && <p class="status">Fetching...</p>}
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
      <button onClick={() => setPage((p) => p - 1)}>Prev</button>
      <div>
        {pets?.map((pet) => {
          // return your jsx
        })}
      </div>
    </div>
  );
};
```

> Further explanations with examples will come soon!

#### `useDataMutation`

A Hook that can be used to mutate remote data. Very similar to `useMutation` Hook of [`react-query`](https://www.npmjs.com/package/@tanstack/react-query).

```jsx
useDataMutation(mutator, callbacks?)
```

**Parameters**

- `mutator` - a function to mutate remote data. For example :

```js
const mutatePets = (newPet) => fetch(url, { method: 'POST', body: JSON.stringfy(newPet), ... }).then(res => res.json());
```

- `callbacks` - an object with a collection of callback functions.
  - `onMutate(newData)` - asynchronous function that will be invoked before actual mutation. Other callbacks accept context object returned from this function.
  - `onSuccess(mutatedData, context)` - will be invoked when the remote data has been mutated.
  - `onError(err, newData, context)` - will be invoked if mutation failed.
  - `onSettled(newData, err, context)` - will be invoked whether or not succeeded or failed.

**Return**
an object with the set of properties :
| Name | Type | Description |
| ------ | ---- | ---- |
| `data` | any \| `null`| Data that represents mutated data |
| `error` | `Error` object| The reason why error occurred |
| `isMutating` | `boolean` | Indicating whether data is mutating |
| `isSuccess` | `boolean` | Indicating whether remote data is successfully mutated |
| `isError` | `boolean` | Indicating whether the error has occurred |
| `mutate` | `function` | It accepts one argument. When you call this function, it invokes `mutator` function with its argument. Before actual mutation, it invokes `onMutate` callback function first with its argument. |

> There is one example below of `useDataQueryMagic`'s API reference.

> Further explanations with examples will come soon!

#### `useInfiniteDataQuery`

A Hook that can be used to fetch data infinitely. Unlike other Hooks, will not synchronize data across multiple Hooks with the same `dataQueryKey`. Syntaxes are very similar to `useInfiniteQuery` Hook of [`react-query`](https://www.npmjs.com/package/@tanstack/react-query).

```jsx
useInfiniteDataQuery(dataQueryKey, fetcher, options);
```

> Unlike `useDataQuery`, this Hook will not synchronize data between of this Hooks. If you use this Hook in two components with the same `dataQueryKey`, unexpected behaviors will occur.

> If you want to update data of this Hooks via `setQueryData` or `setQueriesData`, you should not pass `querySetter` as a function. Instead, pass `array` that represent a new page.

**Parameters**

- `dataQueryKey` - same as `useDataQuery`.
- `fetcher` - function who initiate network request.

```jsx
const fetcher = (context) => {
  // extract pageParam from param
  const { pageParam } = context.param;
  return fetch(`https://...${pageParam}`).then((res) => res.json());
};
```

- `options` - to override default `options` received from `DataQueryProvider`. `autoFetchEnabled` and `refetchOnWindowFocus` are disabled. You can't modify it. There are another two properties you need to pass. They are callback function : `getNextPageParam` and `getPrevPageParam`. `onSuccess`, `onError` and `onSettled` are optional.
  - `getNextPageParam(lastPage, pages) ` - This function will be used to determine `pageParam` for the next page and for the `hasNextPage` status. Return `undefined` if there is no more pages. Don't rely on the number of invoked times as it will generally be invoked three times for one page. Will fix it in future releases.
  - `getPrevPageParam(firstPage, pages)` - This function will be used to determine `pageParam` for the previous page and for the `hasPrevPage` status. Return `undefined` if there is no more pages. Don't rely on the number of invoked times as it will generally be invoked three times for one page. Will fix it in future releases.
  - `onReset(fetchPage`) - Will be invoked when you invoke `reset` function returned from `useInfiniteDataQuery`. Read more about `fetchPage` function below.

**Return** <br/>
an object with a set of properties:
| Name | Type | Description |
| ---- | --- | -- |
| `data` | `array` | an array of array that represent pages |
| `error` | `Error` | reason why error has occurred. |
| `isFetching` | `boolean` |Indicating whether the data is being fetched. This will always be `true` on every network requests. |
| `isLoading` | `boolean` | Indicating whether the data is being fetched. `true` for only first time network request. But if you have disabled `keepValueOnKeyChanges`, this will be set to true if there is no cache for new `dataQueryKey`.|
| `isFetchingNextPage` | `boolean`| Indicating whether the data for the next page is being fetched. |
| `isFetchingPrevPage` | `boolean` |Indicating whether the data for the previous page is being fetched. |
| `hasNextPage` | `boolean` | Indicating whether the data for the next page exists.|
| `hasPrevPage` | `boolean` | Indicating whether the data for the previous page exists. |
| `isError` | `boolean` | Indicating whether the network related error has occurred. |
| `fetchPage` | `function` | Fetch specific page. It accepts one argument that will be passed as the `pageParam` property of `param` object which is the property of `context` object received in`fetcher` function.<br /><br />If you invoke `fetchPage` function like this: <br/> `fetchPage(2);`<br/><br/> Your fetcher function will received it via `pageParam` property : <br/> `const fetcher = ({param: { pageParam }) => {}` |
| `fetchNextPage` | `function` | Fetch next page. Your `fetcher` function will received `pageParam` via `getNextPageParam` callback function which is passed as the property of `options` object. |
| `fetchPrevPage` | `function` | Fetch previous page. Your `fetcher` function will received `pageParam` via `getPrevPageParam` callback function which is passed as the property of `options` object. |
| `reset` | `function` | Clear cache and reset `data`. It will invoke `onReset` callback function passed as the property of `options` object. |

**Usage Example**

```jsx
import { Fragment } from "react";

import { useInfiniteDataQuery } from "../lib/hooks/useInfiniteDataQuery";

const fetchColors = ({  param  }) => {
	return  fetch(`http://.../users?_limit=10&_page=${param.pageParam}`).then((res)  =>  res.json());
};

export default function InfiniteDataQuery()  {

	const { data: pages, fetchNextPage, hasNextPage, hasPreviousPage, isLoading, isFetching, isFetchingNextPage } = useInfiniteDataQuery("colors",  fetchColors,  {
							getNextPageParam(_lastPage,  pages)  {
								if (pages.length  <  4) {
									return  pages.length  +  1;
								}
								return  undefined;
							},
							getPrevPageParam(_firstPage,  pages) {
								if (pages.length  >  1) {
									return  pages.length  -  1;
								}
								return  undefined;
							});

  if (isLoading) return  <div>Loading...</div>;

  return (
	  <div>
		  {isFetching  &&  <p>Fetching...</p>}
		  {isFetchingNextPage  &&  <p>Fetching Next Page...</p>}
		  <div>
			  {pages?.map((page,  i)  => (
				  <Fragment  key={i}>
					  {
						  page.map((color)  => (
							  <h2  key={color.id}>
								  {color.id}. {color.label}
							  </h2>
							 ));
					  }
				  </Fragment>
			 ))}
		 </div>
		 <div>
			 <button  onClick={fetchNextPage} disabled={!hasNextPage}>Load more</button>
		 </div>
	</div>
);
}
```

> Further explanations with examples will come soon!

#### `useExperimentalInfiniteScrollDataQuery`

A Hook that can be used to fetch data infinitely. Like `useInfiniteDataQuery ` Hook, will not synchronize data across multiple Hooks with the same `dataQueryKey`. This Hook was built on top of `useInfiniteDataQuery`. As the name implies, this Hook is just for experimenting. It's not stable yet.

> This Hook will invoke `fetchNextPage` function automatically when the scroll position reaches the bottom.

```jsx
useExperimentalInfiniteScrollDataQuery(
  dataQueryKey,
  fetcher,
  containerRef,
  options
);
```

**Parameters**

- `dataQueryKey` - same as `useInfiniteDataQuery`
- `fetcher` - same as `useInfiniteDataQuery`
- `containerRef` - ref created with `useRef` that is passed as the `ref` prop to the element.

```jsx
const containeRef = useRef(null);
const queryInstance = useExperimentalInfiniteDataQuery(
  dataQueryKey,
  fetcher,
  containerRef,
  options
);
//....
//....
<div ref={containerRef}> ... </div>;
```

- `options` - same as `useInfiniteDataQuery`. There is an extra option `offsetBottom` It can be set any value that can be converted to number. This option is useful when you want to fetch data before the scroll position reaches the bottom most part. It is used in calculation like `scrollTop + offsetBottom`.

**Return**<br/>
an object with a set of properties :
| Name | Type | Description |
| --- | --- | --- |
| `data` | `array` | an array of array that represent pages |
| `hasNextPage` | `boolean` |Indicating whether the data for the next page exists. |
| `isLoading` | `boolean` | Indicating whether the data is being fetched. `true` for only first time network request. But if you have disabled `keepValueOnKeyChanges`, this will be set to true if there is no cache for new `dataQueryKey`.|
| `isFetching` | `boolean` |Indicating whether the data is being fetched. This will always be `true` on every network requests. |
| `isFetchingNextPage` | `boolean` | Indicating whether the data for the next page is being fetched.|
| `reset` | `function` |Clear cache and reset `data`. It will invoke `onReset` callback function passed as the property of `options` object. |
| `fetchPage` | `function` |Fetch specific page. It accepts one argument that will be passed as the `pageParam` property of `param` object which is the property of `context` object received in`fetcher` function.<br /><br />If you invoke `fetchPage` function like this: <br/> `fetchPage(2);`<br/><br/> Your fetcher function will received it via `pageParam` property : <br/> `const fetcher = ({param: { pageParam }) => {}` |

**Usage Example**

```jsx
import { Fragment, useRef } from "react";
import { useExperimentalInfiniteDataQuery } from "../lib/hooks/useExperimentalInfiniteDataQuery";

const fetchUsers = ({ param }) => {
  return fetch(`http://.../users?_limit=5&_page=${param.pageParam}`).then(
    (res) => res.json()
  );
};

const options = {
  offsetBottom: 0,
  getNextPageParam(_lastPage, pages) {
    if (pages.length < 5) {
      return pages.length + 1;
    }
    return undefined;
  },
  onReset: (fetchPage) => {
    fetchPage(1);
  },
};

export default function InfiniteScrollDataQuery() {
  const containerRef = useRef(null);
  const {
    data: usersPages,
    isFetchingNextPage,
    isFetching,
    reset,
  } = useExperimentalInfiniteDataQuery(
    ["users"],
    fetchUsers,
    containerRef,
    options
  );

  return (
    <div style={{ position: "relative" }}>
      {(isFetchingNextPage || isFetching) && (
        <p style={{ width: "100px", position: "absolute", top: 0, right: 0 }}>
          Fetching...
        </p>
      )}
      <div
        ref={containerRef}
        style={{
          height: "600px",
          overflowY: "auto",
          padding: "10px 20px",
          background: "rgba(0, 0, 0, 0.2)",
          border: "2px solid red",
        }}
      >
        {usersPages?.map((usersPage, i) => (
          <Fragment key={i}>
            {usersPage.map((user) => (
              <div
                key={user.id}
                style={{
                  minHeight: "200px",
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "space-around",
                  border: "1px solid yellow",
                  background: "rgba(255, 255, 255, 0.9)",
                  padding: "10px 15px",
                  marginBottom: "10px",
                }}
              >
                <h2>
                  {user.id}. {user.name}
                </h2>
                <p>{user.alterEgo}</p>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
```

> Further explanations with examples will come soon!

#### `useDataQueryMagic`

A Hook that can be used to control caches and network requests. Mostly uses to manage state.

```jsx
useDataQueryMagic();
```

**No parameters**
<br/><br/>
**Return**
an object with a set of functions
| Function| Parameter| Description |
| --- | --- | --- |
| `setQueryData` | (`dataQueryKey`, `querySetter` ) | Can be used to synchronize data across multiple Hooks with the same `dataQueryKey`. <br />`querySetter` can be of any type. If it is a function, that function will be invoked with the data from cache as argument and its return value will be used to set new data for all Hooks with the same `dataQueryKey`. If is not a function, its value will be used like a returned value of the function. |
| `setQueriesData` | (`dataQueries`) | Can be used to synchronize multiple data with just one function. <br /> `dataQueries` is an array of `dataQuery` objects in which must contain `dataQueryKey`and `querySetter` properties just like the argument of `setQueryData` function.|
| `getQueryData` | (`dataQueryKey`) | Can be used to get data from cache with the same `dataQueryKey`. |
| `getQueriesData` | (`dataQueryKeys`) | Get more than one data according to the order list of `dataQueryKeys`. <br /> `dataQueryKeys` is an array of `dataQueryKey`.|
| `cancelQuery` | (`dataQueryKey`) | Cancel ongoing network request with the same `dataQueryKey`. It is an `async` function. |
| `clearCacheData` | (`dataQueryKey`) | Remove cache data associated with your `dataQueryKey`. |
| `clearAllCachesData` | ( ) | Clear all cache data. |
| `invalidateQuery` | (`dataQueryKey`) | Invalidate the data from cache, i.e the new network request will be initiated if there is no already ongoing network request associated with same `dataQuerykey`. Whether or not network request is initiated within the Hook, its status will be updated. such as `isFetching`: `true`. |
| `invalidateQueries` | (`dataQueryKeys`) | Invalidate all data associated with each `dataQueryKey` of `dataQueryKeys` array. |

> You can use this Hook in optimistic updates

**Optimistic Update**
Assume that `Pets` component display a list of pets.

```jsx
import { useDataQuery } from "react-data-query";

const fetcher = (context) => { //... your implementations };
const options = { cacheTime: 1000 * 60 * 10, ...};

export const Pets = (props) => {
	const { data: pets, isFetching } = useDataQuery(`pets`, fetcher, options);
	return (
		<div>
			{isFetching && <p>Fetching...</p>
			{pets?.map(pet => {
				// ... return your jsx
			});
		</div>
	)
}
```

Somewhere in other components or within `Pets` component :

```jsx
const { setDataQuery, getDataQuery, cancelQuery, invalidateQuery } = useDataQueryMagic();
const { isMutating, mutate: addNewPet } = useDataMutation((newPet) => {
								return fetch(url, { body: JSON.stringfy(newPet), ... }).then(res => res.json());
							},
							{
								// this callback will be invoked before `mutator` function with the same argument.
								onMutate(newPet) {
									const prevPets = getDataQuery(`pets`);
									// Cancel ongoing network request if it exists. So that there will not be like data conflicts due to optimistic update.
									await cancelQuery(`pets`);
									// Users will see immediate result before acutal mutation begins
									setDataQuery(`pets`, (oldPets) => ({...oldPets, newPet});
									// return context object
									return { prevPets };
								},
								onError(_err, _newPet, context) {
									// consumes context returned from onMutate callback. If mutation failed, set previous pets.
									setDataQuery(`pets`, context.prevPets);
								},
								onSettled(_newPet, _error, context) {
									// invalidate to ensure the data is fresh
									invalidateQuery(`pets`);
								}
							});
const handleAddPet = (newPet) => {
	addPet(newPet);
}
```

**Manage State**
_You can use `useDataQuery` and `useDataQueryMagic` to synchronize data between multiple components._

_Header.jsx_

```jsx
const { setQueryData } = useDataQueryMagic();
// Function that synchronize data(theme) between multiple components
const toggleTheme = () => setQueryData("theme", (light) => !light);
```

_Profile.jsx_

```jsx
const { data: theme } = useDataQuery("theme", undefined, {
  autoFetchEnabled: false,
}); // Don't forget to disable autoFetchEnabled
```

_Settings.jsx_

```jsx
const { data: theme } = useDataQuery("theme", undefined, {
  autoFetchEnabled: false,
});
```

> Further explanations with examples will come soon!

## License

**MIT**

## Author

[Aung Ko Ko](https://github.com/AKK-soft-dev)
