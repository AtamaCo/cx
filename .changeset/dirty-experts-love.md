---
"@atamaco/fetcher-atama": major
---

Remove `cross-fetch` from `fetcher-atama`. The `cross-fetch` package is causing issues in deno runtimes. Instead if someone is using `fetcher-atama` in Node 16 they have to add a fetch polyfill themselves

i Please enter a summary for your changes.
