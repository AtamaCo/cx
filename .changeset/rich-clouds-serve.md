---
"@atamaco/fetcher": major
"@atamaco/fetcher-atama": major
"@atamaco/nextjs": major
---

Added improved error handling for non-404 status codes returned from the Delivery API. Supporting one of `not_found`, `unauthorized` and a catch-all `internal_server_error`.

This is relevant so when the Delivery API isn't functional (e.g. an outage) or an API key expired the page continues to function because ISR would continue serving the cached pages.
