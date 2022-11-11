# [@atamaco/preview-v2.0.1](https://github.com/atamaco/atama-integrations/compare/@atamaco/preview-v2.0.0...@atamaco/preview-v2.0.1) (2022-01-31)

## 1.0.0

### Major Changes

- 2b8cd7e: Initial release

### Minor Changes

- 2432645: Updated preview to latest state

### Patch Changes

- Updated dependencies [2432645]
- Updated dependencies [2b8cd7e]
  - @atamaco/preview-messaging@1.0.0

## 7.0.0

### Major Changes

- 6fc90fe: Updated dependencies

### Patch Changes

- Updated dependencies [6fc90fe]
  - @atamaco/preview-messaging@7.0.0

## 6.0.0

### Major Changes

- 90a0372: `allowedOrigin` is now required to secure communication between preview and studio

### Patch Changes

- Updated dependencies [90a0372]
  - @atamaco/preview-messaging@6.0.0

## 5.1.2

### Patch Changes

- 20fc097: Fixed placement indicator to show up again

## 5.1.1

### Patch Changes

- 81e7c50: Fixed font so it's always showing up as sans-serif

## 5.1.0

### Minor Changes

- ab334c4: Updated dependencies to use latest types and utils

### Patch Changes

- Updated dependencies [ab334c4]
  - @atamaco/preview-messaging@5.1.0

## 5.0.0

### Major Changes

- 00b96ce: Added a new package for previewing template engines (like handlebars). This also required updates to preview-core and preview-messaging to make them nodejs modules

### Patch Changes

- Updated dependencies [00b96ce]
  - @atamaco/preview-messaging@5.0.0

## 4.0.0

### Major Changes

- b319b81: Added `placementId` to be send when requesting the deletion of a component

### Patch Changes

- Updated dependencies [b319b81]
  - @atamaco/preview-messaging@4.0.0

## 3.0.1

### Patch Changes

- 7ef3aee: Removed default value for placement name

## 3.0.0

### Major Changes

- 878f007: Updated the Preview SDK to support single placements (partial mode) as well as adding preview support for vue

### Patch Changes

- Updated dependencies [878f007]
  - @atamaco/preview-messaging@3.0.0

## 2.4.2

### Patch Changes

- 13db5ed: Fixed import of @atamaco/preview-messaging

## 2.4.1

### Patch Changes

- a8c588c: Fixed position of component name

## 2.4.0

### Minor Changes

- 444867b: Improved styling of component menu and added outline for placement

## 2.3.1

### Patch Changes

- 7399f19: Focusing a component should no longer move other elements

## 2.3.0

### Minor Changes

- 02f9c6f: Updated dependencies of packages

### Patch Changes

- Updated dependencies [02f9c6f]
  - @atamaco/messaging@2.4.0

## 2.2.0

### Minor Changes

- c00f7a9: Added support for "delete" interaction in preview

### Patch Changes

- eba1483: Clicking edit kicked off too many callbacks.

  The `onMessage` method was called more and more often. This was happening because `removeEventListener` actually didn't remove the event listener. Learned it the hard way again but classes, event listeners and context is **hard**. See https://alephnode.io/07-event-handler-binding/ if you want to learn more.
  Using "bound" methods resolve the issue

- Updated dependencies [eba1483]
- Updated dependencies [c00f7a9]
  - @atamaco/messaging@2.3.0

## 2.1.0

### Minor Changes

- e60c746: Bump because of lint changes

### Patch Changes

- Updated dependencies [e60c746]
- Updated dependencies [54dd7d3]
  - @atamaco/messaging@2.2.0

## 2.0.4

### Patch Changes

- 50d7967: Removed old scripts and devDependencies
- 50d7967: Bump to fix workspace resolution in published package
- Updated dependencies [50d7967]
  - @atamaco/messaging@2.1.1

### Bug Fixes

- **preview:** update placements type ([373a984](https://github.com/atamaco/atama-integrations/commit/373a9847d958a9c34c783fe0f00d5d9052f52bf6))
