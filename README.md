# CX Framework (Customer Experience)

This is a mono-repo containing packages to integrate Composer Core into different platforms and frameworks.

## Requirements

* Node >v17.6.0

## Setup

### Publishing packages

Packages are published with Github Actions to the Github Private Registry. We are using [changesets](https://github.com/changesets/changesets) for release automation. When making a change please run `npm run changeset` and include the relevant information and commit the created `.changeset/*.md` file alongside your changes.

## Package dependencies

```mermaid
  graph TD
    subgraph cx
      cxCore["@atamaco/cx-core"]

      subgraph fetcherGraph["Fetcher"]
        fetcher["@atamaco/fetcher"]
        fetcherAtama["@atamaco/fetcher-atama"]
      end
      subgraph previewGraph["Preview"]
        preview["@atamaco/preview"]
        previewMessaging["@atamaco/preview-messaging"]
        previewReact["@atamaco/preview-react"]
      end
      subgraph frameworks["Frameworks"]
        rendererReact["@atamaco/renderer-react"]
      end
      subgraph web["Web"]
        nextjs["@atamaco/nextjs"]
      end
    end
    subgraph peerDependencies
      react
      next
    end

    %% Fetcher
    fetcher-->cxCore
    fetcherAtama-->fetcher

    %% Preview
    preview-->previewMessaging
    previewMessaging-->cxCore
    previewReact-->preview
    previewReact-->react

    %% Frameworks
    rendererReact-->cxCore
    rendererReact-->react

    %% Web
    nextjs-->cxCore
    nextjs-->next
```
