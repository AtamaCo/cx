# @atamaco/nextjs

## 3.0.0

### Major Changes

- 65d7a39: Added types to CXExperience

### Patch Changes

- Updated dependencies [65d7a39]
  - @atamaco/cx-core@3.0.0

## 2.0.0

### Major Changes

- 981935f: Added README

### Patch Changes

- Updated dependencies [981935f]
  - @atamaco/cx-core@2.0.0

## 1.0.0

### Major Changes

- 2b8cd7e: Initial release

### Patch Changes

- b9682ca: Added log statements
- 3958ed1: Added debug and warn logs when fetcher returns no data or fails.
- Updated dependencies [2b8cd7e]
  - @atamaco/cx-core@1.0.0

## 5.0.3

### Patch Changes

- 03a89d6: Set correct `fallback` and `revalidate` properties. Also catch any responses that are not "ok" ("200")

## 5.0.2

### Patch Changes

- 9c07760: Use `fallback` if a page wasn't found so subsequent requests return the result right away.

## 5.0.1

### Patch Changes

- 224f210: Add `revalidate` flag to `getStaticProps` if it failed to find the page so it's retrying on subsequent requests

## 5.0.0

### Major Changes

- 3926d5b: Added more advanced options for trimming down results for static paths

### Patch Changes

- Updated dependencies [3926d5b]
  - @atamaco/rendering-connectors-utils@5.0.0

## 4.0.4

### Patch Changes

- e082e2d: Fixed fetching of nested routes

## 4.0.3

### Patch Changes

- Updated dependencies [6d4fb53]
  - @atamaco/rendering-connectors-types@4.0.0
  - @atamaco/rendering-connectors-utils@4.0.0

## 4.0.2

### Patch Changes

- b9525cd: Added condition if fetcher returns `null` instead of throwing an error

## 4.0.1

### Patch Changes

- 5bd5811: bump version of rendering-connectors-utils to 3.0.1

## 4.0.0

### Major Changes

- 4c34a27: Added a new package to fetch experiences from a S3. This happened in the scope of updating the Next.js middleware to support `getStaticPaths` which is required for catch-all routes and getStaticProps. Part of this involved the removal of `@atamaco/fetcher-atama` which wasn't used as well as `@atamaco/middleware-vsf-core` which isn't used either. Instead `@atamaco/fetcher-s3` and `@atamaco/middleware-vsf-s3` are introduced in favor of `@atamaco/fetcher-json` and `@atamaco/middleware-vsf-json`

### Patch Changes

- Updated dependencies [4c34a27]
  - @atamaco/rendering-connectors-utils@3.0.0

## 3.1.0

### Minor Changes

- ce8e2ba: Allow passing a slug manually in addition to getting it from the request URL

## 3.0.1

### Patch Changes

- Updated dependencies [4efecd5]
  - @atamaco/rendering-connectors-utils@2.0.0

## 3.0.0

### Major Changes

- 22db29d: Updated middleware-nextjs and renderer-react

## 2.0.3

### Patch Changes

- Updated dependencies [fd3ca49]
  - @atamaco/fetcher-atama@6.1.1
  - @atamaco/rendering-connectors-types@3.0.1

## 2.0.2

### Patch Changes

- Updated dependencies [4f41170]
  - @atamaco/rendering-connectors-types@3.0.0
  - @atamaco/fetcher-atama@6.1.0

## 2.0.1

### Patch Changes

- Updated dependencies [8fdb2e3]
  - @atamaco/fetcher-atama@6.0.0
  - @atamaco/rendering-connectors-types@2.0.0

## 2.0.0

### Major Changes

- 3a36388: Added support for rendering single placements on a page

### Patch Changes

- Updated dependencies [3a36388]
  - @atamaco/fetcher-atama@5.0.0
  - @atamaco/rendering-connectors-types@1.0.0

## 1.0.0

### Major Changes

- 38f649c: Renamed packages

### Patch Changes

- Updated dependencies [38f649c]
  - @atamaco/fetcher-atama@4.0.0

## 0.3.6

### Patch Changes

- Updated dependencies [433d486]
  - @atamaco/core@3.4.0

## 0.3.5

### Patch Changes

- Updated dependencies [444867b]
  - @atamaco/core@3.3.0

## 0.3.4

### Patch Changes

- 856056f: Fixed `AtamaProps` type for nextjs (added missing `visualProperties`)

## 0.3.3

### Patch Changes

- Updated dependencies [f30a3a5]
  - @atamaco/core@3.2.0

## 0.3.2

### Patch Changes

- 85c8019: Bumped @atamaco/core package

## 0.3.1

### Patch Changes

- 4ac4855: Bumped @atamaco/core version

## 0.3.0

### Minor Changes

- 02f9c6f: Updated dependencies of packages

### Patch Changes

- Updated dependencies [02f9c6f]
  - @atamaco/core@3.1.0

## 0.2.1

### Patch Changes

- cfecc90: Fixed return value of getServerSideProps as well as types

## 0.2.0

### Minor Changes

- e60c746: Bump because of lint changes

### Patch Changes

- Updated dependencies [e60c746]
- Updated dependencies [54dd7d3]
  - @atamaco/core@3.0.0

## 0.1.1

### Patch Changes

- 50d7967: Removed old scripts and devDependencies
- 50d7967: Bump to fix workspace resolution in published package
- Updated dependencies [50d7967]
  - @atamaco/core@2.5.1

## 0.1.0

### Minor Changes

- 98b2591: Added support for next.js and react
