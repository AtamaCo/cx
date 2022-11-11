# @atamaco/fetcher-json

## 1.0.0

### Major Changes

- 2b8cd7e: Initial release

### Patch Changes

- Updated dependencies [2b8cd7e]
  - @atamaco/cx-core@1.0.0

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
