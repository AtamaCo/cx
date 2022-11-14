/**
 * Get the menu in the container.
 */
function getMenu(container: HTMLElement): HTMLElement | null {
  return container.querySelector('.atama-action-menu');
}

/**
 * Get the componentType element in the container
 */
function getComponentNameElement(container: HTMLElement): HTMLElement | null {
  return container.querySelector('.atama-action-menu__componentName');
}

/**
 * Returns the menu items
 */
function getMenuItems(container: HTMLElement): Array<Element> | null {
  const menu = getMenu(container);

  if (!menu) {
    return null;
  }

  const menuItems = menu.querySelectorAll('[data-atama-action]');

  if (!menuItems) {
    return null;
  }

  return Array.from(menuItems);
}

/**
 * Creates the DOM elements for the menu
 */
function createMenu(container: HTMLElement) {
  const markup = `
  <style>
    :root {
      --atama-preview-color-yale: #06437C;
      --atama-preview-color-maya: #23A5DC;
      --atama-preview-color-dk-red: #ED2D58;
    }
    .atama-action-menu {
      visibility: hidden;
      position: absolute;
      z-index: 9999;
      pointer-events: none;
      display: flex;
      justify-content: end;
      align-items: start;
      border: 1px dashed var(--atama-preview-color-yale);
      font-family: sans-serif;
    }
    .atama-action-menu__button {
      background: transparent;
      border: none;
      margin: 0;
      padding: 0.4rem;
      color: #fff;
      cursor: pointer;
      pointer-events: initial;
    }
    .atama-action-menu__button:hover {
      background: var(--atama-preview-color-maya);
    }
    .atama-action-menu__button[data-atama-action="delete"]:hover {
      background: var(--atama-preview-color-dk-red);
    }
    .atama-action-menu__group {
      position: sticky;
      top: 0;
      background: var(--atama-preview-color-yale);
      display: flex;
      align-items: center;
    }
    .atama-action-menu__componentName {
      color: #fff;
      padding: 0 0.4rem;
      font-size: 0.9rem;
    }
  </style>
  <aside
    class="atama-action-menu"
  >
    <div class="atama-action-menu__group">
      <span class="atama-action-menu__componentName"></span>
      <button
        class="atama-action-menu__button"
        data-atama-action="delete"
      >
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>
      </button>
      <button
        class="atama-action-menu__button"
        data-atama-action="edit"
      >
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path></svg>
      </button>
    </div>
  </aside>`;

  container.insertAdjacentHTML('beforeend', markup);
}

/**
 * Removes the DOM elements created for the menu from the container.
 */
function destroyMenu(container: HTMLElement) {
  const menuEl = getMenu(container);

  menuEl?.parentNode?.removeChild(menuEl);
}

/**
 * Show/hide the action menu
 */
function toggleMenu(
  container: HTMLElement,
  visibility: 'hidden' | 'visible' = 'hidden',
) {
  const actionMenu = getMenu(container);
  if (!actionMenu) {
    return;
  }

  actionMenu.style.visibility = visibility;
}

type Position = {
  top: number;
  left: number;
  width: number;
  height: number;
};
/**
 * Positions the menu
 */
function positionMenu(container: HTMLElement, position: Position) {
  const actionMenu = getMenu(container);
  if (!actionMenu) {
    return;
  }

  actionMenu.style.width = `${position.width}px`;
  actionMenu.style.height = `${position.height}px`;
  actionMenu.style.left = `${position.left}px`;
  actionMenu.style.top = `${position.top}px`;
}

type Callbacks = {
  onEditComponent: () => void;
  onDeleteComponent: () => void;
  onEnterMenu: () => void;
  onLeaveMenu: () => void;
};

class Menu {
  #container: HTMLElement;

  #callbacks: Callbacks;

  // We need to bind methods so they have the correct context when using with
  // addEventListener and removeEventListener

  boundOnMouseEnterMenu: () => void;

  boundOnMouseLeaveMenu: () => void;

  boundOnMenuButtonClick: (event: Event) => void;

  constructor(container: HTMLElement, callbacks: Callbacks) {
    this.#container = container;
    this.#callbacks = callbacks;

    this.boundOnMouseEnterMenu = () => this.onMouseEnterMenu();
    this.boundOnMouseLeaveMenu = () => this.onMouseLeaveMenu();
    this.boundOnMenuButtonClick = (event: Event) =>
      this.onMenuButtonClick(event);

    // Create the DOM elements for the menu
    createMenu(this.#container);

    this.addEventListener();
  }

  setPosition(position: Position) {
    positionMenu(this.#container, position);
  }

  hide() {
    toggleMenu(this.#container, 'hidden');
  }

  show() {
    toggleMenu(this.#container, 'visible');
  }

  destroy() {
    const menu = getMenu(this.#container);
    const menuItems = getMenuItems(this.#container);

    if (!menu || !menuItems) {
      return;
    }

    menu.removeEventListener('mouseenter', this.boundOnMouseEnterMenu);
    menu.removeEventListener('mouseleave', this.boundOnMouseLeaveMenu);

    menuItems.forEach((menuItem) => {
      menuItem.removeEventListener('click', this.boundOnMenuButtonClick);
    });

    // Remove the DOM elements for the menu
    destroyMenu(this.#container);
  }

  setComponentName(componentName: string) {
    const componentNameElement = getComponentNameElement(this.#container);

    if (componentNameElement) {
      componentNameElement.innerText = componentName;
    }
  }

  addEventListener() {
    const menu = getMenu(this.#container);
    const menuItems = getMenuItems(this.#container);

    if (!menu || !menuItems) {
      return;
    }

    menu.addEventListener('mouseenter', this.boundOnMouseEnterMenu);
    menu.addEventListener('mouseleave', this.boundOnMouseLeaveMenu);

    menuItems.forEach((menuItem) => {
      menuItem.addEventListener('click', this.boundOnMenuButtonClick);
    });
  }

  onMouseLeaveMenu() {
    toggleMenu(this.#container, 'hidden');
    this.#callbacks.onLeaveMenu();
  }

  onMouseEnterMenu() {
    toggleMenu(this.#container, 'visible');
    this.#callbacks.onEnterMenu();
  }

  onMenuButtonClick(event: Event) {
    const target = event.currentTarget as HTMLElement;

    if (target.dataset.atamaAction === 'edit') {
      this.#callbacks.onEditComponent();
    }

    if (target.dataset.atamaAction === 'delete') {
      this.#callbacks.onDeleteComponent();
    }
  }

  static isMenuElement(element: HTMLElement) {
    return element.classList.contains('atama-action-menu__componentName');
  }
}

export { Menu, positionMenu };
