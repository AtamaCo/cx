# @atamaco/fetcher-json

## 5.3.1

### Patch Changes

- 482d071: Request code for placements in embeddable blueprint

## 5.3.0

### Minor Changes

- 6731a2f: Added an integration for [remix](https://remix.run/)

  - Updated `@atamaco/fetcher` and `@atamaco/fetcher-atama` to optionally accept a logger. It's a great way to hook into the internals of the CX SDK. If no logger is passed in nothing is logged to the console.
  - Updated `@atamaco/cx-core` with the `Logger` interface and added a helper method to find a component type in an experience.
  - Added `@atamaco/remix`. This is our latest framework integration. Supports rendering a path and has full support for actions ("read" actions as well as "write" actions). It also comes with optional cache support. Using some sort of cache greatly helps with performance to avoid re-fetching experiences on every request from the Delivery API. Instead e.g. an in-memory cache can be used.

### Patch Changes

- Updated dependencies [6731a2f]
  - @atamaco/fetcher@4.4.0

## 5.2.0

### Minor Changes

- a1cc90d: Added support for `actions`

### Patch Changes

- Updated dependencies [a1cc90d]
  - @atamaco/fetcher@4.3.0

## 5.1.0

### Minor Changes

- 11d6933: Removing Bundle Manifest since it will be retrieved on the backend by the delivery API and we no longer have to expose it directly to the client.
- 4ac7dae: Updating the default URL for the Delivery API. This needs to be released so we can migrate our domains

## 5.0.2

### Patch Changes

- d28f1dc: Passing in our fetch object to the GraphQL client to hopefully solve the graphql-request problem when built to be used with Deno

## 5.0.1

### Patch Changes

- 861301f: Bumping dependency version for general fetcher package
- 2886f50: Creating a minor version change to accommodate the 'updateInternalDependencies' rule
- Updated dependencies [861301f]
- Updated dependencies [2ef01d5]
- Updated dependencies [2886f50]
  - @atamaco/fetcher@4.2.0

## 5.0.0

### Major Changes

- 21c0f7b: Changing the Atama Fetcher from REST to GraphQL

### Patch Changes

- Updated dependencies [21c0f7b]
  - @atamaco/fetcher@4.1.0

## 4.0.0

### Major Changes

- fda4fdb: Added improved error handling for non-404 status codes returned from the Delivery API. Supporting one of `not_found`, `unauthorized` and a catch-all `internal_server_error`.

  This is relevant so when the Delivery API isn't functional (e.g. an outage) or an API key expired the page continues to function because ISR would continue serving the cached pages.

### Patch Changes

- Updated dependencies [fda4fdb]
  - @atamaco/fetcher@4.0.0

## 3.0.1

### Patch Changes

- 108819c: Rename Content Delivery API to just Delivery API

## 3.0.0

### Major Changes

- fa9980e: Remove `cross-fetch` from `fetcher-atama`. The `cross-fetch` package is causing issues in deno runtimes. Instead if someone is using `fetcher-atama` in Node 16 they have to add a fetch polyfill themselves

  i Please enter a summary for your changes.

## 2.1.0

### Minor Changes

- 26ff4bd: Export atama fetcher config

## 2.0.2

### Patch Changes

- ee78ffb: Should be commonjs

## 2.0.1

### Patch Changes

- Updated dependencies [65d7a39]
  - @atamaco/fetcher@3.0.0

## 2.0.0

### Major Changes

- 981935f: Added README

### Patch Changes

- Updated dependencies [981935f]
  - @atamaco/fetcher@2.0.0

## 1.0.0

### Major Changes

- 2b8cd7e: Initial release

### Patch Changes

- b9682ca: Added log statements
- Updated dependencies [2b8cd7e]
  - @atamaco/fetcher@1.0.0

## 0.1.6

### Patch Changes

- 03a89d6: Set correct `fallback` and `revalidate` properties. Also catch any responses that are not "ok" ("200")

## 0.1.5

### Patch Changes

- 5eee0f8: Comma-separate excluded/included paths

## 0.1.4

### Patch Changes

- 3ece16c: Returning `.paths` for getPaths, not for getData

## 0.1.3

### Patch Changes

- f43a726: Need to pick `.paths` from results when getting all paths

## 0.1.2

### Patch Changes

- 3469c72: Fix URL to Content Delivery API

## 0.1.1

### Patch Changes

- dd15c74: Fixed url to be used

## 0.1.0

### Minor Changes

- 450ed95: Initial release of new @atamaco/fetcher-atama package

## 2.0.3

### Patch Changes

- ccbb309: Ignore embeddable blueprints that aren't published

## 2.0.2

### Patch Changes

- eef6342: Stop using `blueprintType` and instead consistently use `blueprint`
- Updated dependencies [eef6342]
  - @atamaco/rendering-connectors-types@4.0.1
  - @atamaco/rendering-connectors-utils@5.0.1

## 2.0.1

### Patch Changes

- 67a8364: getAllPaths wasn't working correctly unless `includedDirectories` was passed in. Instead we should ignore the `includedDirectories` if it's not present

## 2.0.0

### Major Changes

- 3926d5b: Added more advanced options for trimming down results for static paths

### Patch Changes

- Updated dependencies [3926d5b]
  - @atamaco/rendering-connectors-utils@5.0.0

## 1.1.0

### Minor Changes

- c526eda: Added optional `endpoint` configuration

## 1.0.0

### Major Changes

- 6d4fb53: Supporting embedded experiences in fetcher and renderer. This change is not backwards-compatible with experiences that are still using JSONata queries in their `contentProperties`

### Minor Changes

- d5afe0b: Excluding embeddable experiences from the result set of `getAllPaths`

### Patch Changes

- Updated dependencies [6d4fb53]
  - @atamaco/rendering-connectors-types@4.0.0
  - @atamaco/rendering-connectors-utils@4.0.0

## 0.2.1

### Patch Changes

- 5bd5811: bump version of rendering-connectors-utils to 3.0.1

## 0.2.0

### Minor Changes

- 4c34a27: Added a new package to fetch experiences from a S3. This happened in the scope of updating the Next.js middleware to support `getStaticPaths` which is required for catch-all routes and getStaticProps. Part of this involved the removal of `@atamaco/fetcher-atama` which wasn't used as well as `@atamaco/middleware-vsf-core` which isn't used either. Instead `@atamaco/fetcher-s3` and `@atamaco/middleware-vsf-s3` are introduced in favor of `@atamaco/fetcher-json` and `@atamaco/middleware-vsf-json`

### Patch Changes

- Updated dependencies [4c34a27]
  - @atamaco/rendering-connectors-utils@3.0.0

## 1.2.1

### Patch Changes

- Updated dependencies [4efecd5]
  - @atamaco/rendering-connectors-utils@2.0.0

## 1.2.0

### Minor Changes

- 22db29d: Updated middleware-nextjs and renderer-react

## 1.1.1

### Patch Changes

- 105af26: Replaced `layout` with `template` in JSON fetcher

## 1.1.0

### Minor Changes

- 4f41170: Updated fetcher to run postProcess on rendering connector data to resolve contentProperty URNs

  `component.contentProperties` previously were holding the resolved content. This has changed and instead `component.contentProperties` is now holding references (urn) to the actual content source and the respective field to be used. The postProcess step resolves the URNs based on the contentSourceSnapshots.

  BREAKING CHANGES:

  - `Fetcher` is now part of `rendering-connectors-utils` instead of `rendering-connectors-types`

### Patch Changes

- Updated dependencies [4f41170]
  - @atamaco/rendering-connectors-types@3.0.0
  - @atamaco/rendering-connectors-utils@1.1.0

## 1.0.0

### Major Changes

- 8fdb2e3: Added support for fetching JSON data instead of going through the Gateway

  We now have a new middleware @atamaco/middleware-vsf-json that's fetching JSON files instead of making requests against the Atama Gateway. Internally it's using @atamaco/fetcher-json. This required changes to @atamaco/fetcher-atama as well as @atamaco/rendering-connectors-types to properly reflect metadata

### Patch Changes

- Updated dependencies [8fdb2e3]
  - @atamaco/rendering-connectors-types@2.0.0
