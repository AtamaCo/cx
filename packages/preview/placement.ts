/**
 * Get the placement outline in the container.
 */
function getOutline(container: HTMLElement): HTMLElement | null {
  return container.querySelector('.atama-placement-outline');
}

/**
 * Get the placement name element in the container
 */
function getPlacementNameElement(container: HTMLElement): HTMLElement | null {
  return container.querySelector('.atama-placement-outline__name');
}

/**
 * Get placements
 */
function getPlacements(container: HTMLElement): NodeListOf<HTMLElement> | null {
  return container.querySelectorAll('[data-atama-placement]');
}

/**
 * Creates the DOM elements for the menu
 */
function createOutline(container: HTMLElement) {
  const markup = `
  <style>
    :root {
      --atama-preview-color-apple: #9FC231;
    }
    .atama-placement-outline {
      visibility: hidden;
      position: absolute;
      z-index: 9999;
      pointer-events: none;
      display: flex;
      justify-content: start;
      align-items: start;
      border: 1px dashed var(--atama-preview-color-apple);
    }
    .atama-placement-outline__name {
      background: var(--atama-preview-color-apple);
      color: #fff;
      padding: 0.4rem;
      position: sticky;
      top: 0;
      font-family: sans-serif;
    }
  </style>
  <aside
    class="atama-placement-outline"
  >
    <span class="atama-placement-outline__name"></span>
  </aside>`;

  container.insertAdjacentHTML('beforeend', markup);
}

type PlacementDimension = {
  top: number;
  left: number;
  width: number;
  height: number;
};
function getPlacementPosition(element: HTMLElement): PlacementDimension {
  const { top, left, width, height } = element.getBoundingClientRect();

  return {
    top: top + window.scrollY,
    left: left + window.scrollX,
    width,
    height,
  };
}

/**
 * Show/hide the action menu
 */
function toggleOutline(
  container: HTMLElement,
  visibility: 'hidden' | 'visible' = 'hidden',
) {
  const actionMenu = getOutline(container);
  if (!actionMenu) {
    return;
  }

  actionMenu.style.visibility = visibility;
}

/**
 * Positions the outline
 */
function positionOutline(
  container: HTMLElement,
  position: {
    width: number;
    height: number;
    left: number;
    top: number;
  },
) {
  const outline = getOutline(container);
  if (!outline) {
    return;
  }

  outline.style.width = `${position.width}px`;
  outline.style.height = `${position.height}px`;
  outline.style.left = `${position.left}px`;
  outline.style.top = `${position.top}px`;
}

/**
 * Removes the DOM elements created for the outline from the container.
 */
function destroyOutline(container: HTMLElement) {
  const menuEl = getOutline(container);

  menuEl?.parentNode?.removeChild(menuEl);
}

export class Placement {
  #container: HTMLElement;

  // We need to bind methods so they have the correct context when using with
  // addEventListener and removeEventListener

  boundOnMouseEnterPlacement: (event: MouseEvent) => void;

  boundOnMouseLeavePlacement: () => void;

  constructor(container: HTMLElement) {
    this.#container = container;

    this.boundOnMouseEnterPlacement = (event: MouseEvent) =>
      this.onMouseEnterPlacement(event);
    this.boundOnMouseLeavePlacement = () => this.onMouseLeavePlacement();

    // Create the DOM elements for the outline
    createOutline(this.#container);

    this.addEventListener();
  }

  hide() {
    toggleOutline(this.#container, 'hidden');
  }

  show() {
    toggleOutline(this.#container, 'visible');
  }

  destroy() {
    const outline = getOutline(this.#container);
    const placements = getPlacements(this.#container);

    if (outline) {
      // Remove the DOM elements for the menu
      destroyOutline(this.#container);
    }

    if (placements) {
      placements.forEach((placement) => {
        placement.addEventListener(
          'mouseenter',
          this.boundOnMouseEnterPlacement,
        );
        placement.addEventListener(
          'mouseleave',
          this.boundOnMouseLeavePlacement,
        );
      });
    }
  }

  addEventListener() {
    const placements = getPlacements(this.#container);

    if (!placements) {
      return;
    }

    placements.forEach((placement) => {
      placement.addEventListener('mouseenter', this.boundOnMouseEnterPlacement);
      placement.addEventListener('mouseleave', this.boundOnMouseLeavePlacement);
    });
  }

  removeEventListener() {
    const placements = getPlacements(this.#container);

    if (!placements) {
      return;
    }

    placements.forEach((placement) => {
      placement.removeEventListener(
        'mouseenter',
        this.boundOnMouseEnterPlacement,
      );
      placement.removeEventListener(
        'mouseleave',
        this.boundOnMouseLeavePlacement,
      );
    });
  }

  onMouseLeavePlacement() {
    toggleOutline(this.#container, 'hidden');
  }

  onMouseEnterPlacement(event: MouseEvent) {
    if (event.currentTarget) {
      const target = event.currentTarget as HTMLElement;
      this.setPlacementName(target.dataset.atamaPlacement);

      toggleOutline(this.#container, 'visible');
      positionOutline(this.#container, getPlacementPosition(target));
    }
  }

  updateListener() {
    this.removeEventListener();
    this.addEventListener();
  }

  setPlacementName(name: string | undefined) {
    const nameElement = getPlacementNameElement(this.#container);

    if (!nameElement || !name) {
      return;
    }

    nameElement.innerText = name;
  }

  static isPreviewElement(element: HTMLElement) {
    return element.classList.contains('atama-placement-outline__name');
  }
}
