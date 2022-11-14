# [@atamaco/messaging-v1.0.0](https://github.com/atamaco/atama-integrations/compare/@atamaco/messaging-v0.1.1...@atamaco/messaging-v1.0.0) (2022-01-31)

## 2.0.0

### Major Changes

- 981935f: Added README

### Patch Changes

- Updated dependencies [981935f]
  - @atamaco/cx-core@2.0.0

## 1.0.0

### Major Changes

- 2b8cd7e: Initial release

### Minor Changes

- 2432645: Updated preview to latest state

### Patch Changes

- Updated dependencies [2b8cd7e]
  - @atamaco/cx-core@1.0.0

## 7.0.0

### Major Changes

- 6fc90fe: Updated dependencies

## 6.0.0

### Major Changes

- 90a0372: `allowedOrigin` is now required to secure communication between preview and studio

## 5.1.0

### Minor Changes

- ab334c4: Updated dependencies to use latest types and utils

## 5.0.0

### Major Changes

- 00b96ce: Added a new package for previewing template engines (like handlebars). This also required updates to preview-core and preview-messaging to make them nodejs modules

## 4.0.0

### Major Changes

- b319b81: Added `placementId` to be send when requesting the deletion of a component

## 3.0.0

### Major Changes

- 878f007: Updated the Preview SDK to support single placements (partial mode) as well as adding preview support for vue

## 2.5.1

### Patch Changes

- 73093e7: Fixed types for `Component`

## 2.5.0

### Minor Changes

- f30a3a5: Added support for `visualProperties`

## 2.4.0

### Minor Changes

- 02f9c6f: Updated dependencies of packages

## 2.3.0

### Minor Changes

- c00f7a9: Added support for "delete" interaction in preview

### Patch Changes

- eba1483: Clicking edit kicked off too many callbacks.

  The `onMessage` method was called more and more often. This was happening because `removeEventListener` actually didn't remove the event listener. Learned it the hard way again but classes, event listeners and context is **hard**. See https://alephnode.io/07-event-handler-binding/ if you want to learn more.
  Using "bound" methods resolve the issue

## 2.2.0

### Minor Changes

- e60c746: Bump because of lint changes
- 54dd7d3: Updated atama integration to work with latest format provided by the API

## 2.1.1

### Patch Changes

- 50d7967: Removed old scripts and devDependencies

### Bug Fixes

- **messaging:** fix placements references ([588c1dd](https://github.com/atamaco/atama-integrations/commit/588c1dd5a38338cab8fa261dd5242512abb170bd))

### Features

- **messaging:** updated placements type with optional id ([99e0117](https://github.com/atamaco/atama-integrations/commit/99e0117f4269b131f27ed53f466b175503259cf7))

### BREAKING CHANGES

- **messaging:** This is removing the export of `Placements` in
  favor of a `Placement` interface.
  The `Placement` interface has an optional `id` for the component
