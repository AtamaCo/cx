---
"@atamaco/remix": major
"@atamaco/cx-core": minor
"@atamaco/fetcher": minor
"@atamaco/fetcher-atama": minor
---

Added an integration for [remix](https://remix.run/)

- Updated `@atamaco/fetcher` and `@atamaco/fetcher-atama` to optionally accept a logger. It's a great way to hook into the internals of the CX SDK. If no logger is passed in nothing is logged to the console.
- Updated `@atamaco/cx-core` with the `Logger` interface and added a helper method to find a component type in an experience.
- Added `@atamaco/remix`. This is our latest framework integration. Supports rendering a path and has full support for actions ("read" actions as well as "write" actions). It also comes with optional cache support. Using some sort of cache greatly helps with performance to avoid re-fetching experiences on every request from the Delivery API. Instead e.g. an in-memory cache can be used.
