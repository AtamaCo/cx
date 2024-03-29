# @atamaco/cx-core

## 3.4.0

### Minor Changes

- 6731a2f: Added an integration for [remix](https://remix.run/)

  - Updated `@atamaco/fetcher` and `@atamaco/fetcher-atama` to optionally accept a logger. It's a great way to hook into the internals of the CX SDK. If no logger is passed in nothing is logged to the console.
  - Updated `@atamaco/cx-core` with the `Logger` interface and added a helper method to find a component type in an experience.
  - Added `@atamaco/remix`. This is our latest framework integration. Supports rendering a path and has full support for actions ("read" actions as well as "write" actions). It also comes with optional cache support. Using some sort of cache greatly helps with performance to avoid re-fetching experiences on every request from the Delivery API. Instead e.g. an in-memory cache can be used.

## 3.3.0

### Minor Changes

- a1cc90d: Added support for `actions`

## 3.2.0

### Minor Changes

- 11d6933: Removing Bundle Manifest since it will be retrieved on the backend by the delivery API and we no longer have to expose it directly to the client.

## 3.1.0

### Minor Changes

- 21c0f7b: Changing the Atama Fetcher from REST to GraphQL

## 3.0.0

### Major Changes

- 65d7a39: Added types to CXExperience

## 2.0.0

### Major Changes

- 981935f: Added README

## 1.0.0

### Major Changes

- 2b8cd7e: Initial release
