# [React Data Query](https://github.com/AKK-soft-dev/react-data-query)

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

## Version History

- `1.0.0` and `2.0.0` were deprecated. Because of unexpected Error.
- `2.0.2`, `2.0.3` and `2.0.4` were unpublished. Because I made a small change and published it without testing. As the result, it causes the Error. I will try not to happen like that again.
- `2.0.9` - Fixed setting data of `useInfiniteDataQuery` via `setQueryData` and `setQueriesData`. Read API Reference of `useInfiniteDataQuery`.
- `2.1.4` integrated with TypeScript.
- From `2.1.9`, you can import TypeScript types.
- `2.2.0` - From this version, giving you the flexibilities to describe what `data` type will be returned and how the shape of the `context` will be look like. And more...
  > Please install the latest version

## More Documentations

Read more documentation [here](https://github.com/AKK-soft-dev/react-data-query).
