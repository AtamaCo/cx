import type { CXPlacement } from '@atamaco/cx-core';

import { MessagingPreviewToStudio } from '@atamaco/preview-messaging';

import { Menu } from './menu.js';
import { Components } from './component.js';
import { Placement } from './placement.js';

type Hooks = {
  onDataUpdate: (placements: CXPlacement[], layout: string) => void;
};

class Preview {
  #mutationObserver: MutationObserver;

  hooks: Hooks;

  menu: Menu;

  placement: Placement;

  components: Components;

  messaging: MessagingPreviewToStudio;

  activeComponentId: string;

  constructor(container: HTMLElement, hooks: Hooks, allowedOrigin: string) {
    this.hooks = hooks;
    this.activeComponentId = '';
    this.placement = new Placement(container);
    this.menu = new Menu(container, {
      onEditComponent: this.handleEditComponent.bind(this),
      onDeleteComponent: this.handleDeleteComponent.bind(this),
      onEnterMenu: this.handleEnterMenu.bind(this),
      onLeaveMenu: this.handleLeaveMenu.bind(this),
    });
    this.components = new Components(container, {
      onEnterComponent: this.handleEnterComponent.bind(this),
      onLeaveComponent: this.handleLeaveComponent.bind(this),
    });
    this.messaging = new MessagingPreviewToStudio(
      {
        onUpdateData: this.handleUpdateData.bind(this),
        onFocusComponent: this.handleFocusComponent.bind(this),
      },
      allowedOrigin,
    );

    // Creating a MutationObserver so we can listen to changes to the DOM. This
    // is helpful so we can update the event listeners whenever components (DOM
    // elements) were added or removed.
    // Using a `mouseenter`/`mouseleave` event listener still seems to be the
    // best approach for detecting if a component is currently being hovered to
    // show the menu. The other approach would be to have a generic listener on
    // the `container` element and then figuring out if the current active
    // element is an element with [data-atama-id]. Unfortunately `mouseenter`
    // doesn't work in this case so we'd have to use `mousemove` or `mouseover`
    // but we'd have to be careful about performance.
    // The easiest approach seems to remove and re-add the event listeners
    // whenever a change was detected.
    // Note: In theory we could also do this in the `onMessage` callback *but*
    // it's not guaranteed that at this point the DOM elements already exist.
    this.#mutationObserver = new MutationObserver((mutationsList) => {
      const hasRelevantMutations = mutationsList.filter((mutation) => {
        if (mutation.type === 'childList') {
          if (
            Menu.isMenuElement(mutation.target as HTMLElement) ||
            Placement.isPreviewElement(mutation.target as HTMLElement)
          ) {
            return false;
          }
        }

        return true;
      });

      if (hasRelevantMutations.length > 0) {
        this.components.updateListener();
        this.placement.updateListener();
      }
    });

    // Start actually observing the DOM
    this.#mutationObserver.observe(container, {
      attributes: false,
      characterData: false,
      childList: true,
      subtree: true,
      attributeOldValue: false,
      characterDataOldValue: false,
    });

    // Let the host know preview is ready now
    this.messaging.previewReady();
  }

  destroy() {
    this.placement.destroy();
    this.messaging.destroy();
    this.menu.destroy();
    this.components.destroy();
    this.#mutationObserver.disconnect();
  }

  handleUpdateData(placements: CXPlacement[], layout: string) {
    this.hooks.onDataUpdate(placements, layout);
  }

  handleFocusComponent(id: string) {
    this.components.focus(id);
  }

  handleLeaveComponent() {
    this.menu.hide();
  }

  handleEnterComponent(
    id: string,
    componentType: string,
    componentPosition: {
      top: number;
      left: number;
      width: number;
      height: number;
    },
  ) {
    this.activeComponentId = id;

    this.menu.setPosition(componentPosition);
    this.menu.setComponentName(componentType);
    this.menu.show();
  }

  handleEnterMenu() {
    this.placement.show();
  }

  handleLeaveMenu() {
    this.placement.hide();
  }

  handleEditComponent() {
    this.messaging.editComponent(this.activeComponentId);
  }

  handleDeleteComponent() {
    const placementId = this.components.getPlacementId(this.activeComponentId);
    this.messaging.deleteComponent({
      correlationId: this.activeComponentId,
      placementId,
    });
  }
}

export { Preview };
