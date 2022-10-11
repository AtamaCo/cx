/**
 * Get the `data-atama-id` from a DOM element. If data-atama-id does not exist
 * it returns an empty string.
 */
function getComponentIdFromElement(element: HTMLElement): string {
  return element?.dataset?.atamaId || '';
}

/**
 * Get the `data-atama-placement-id` from a DOM element. If
 * data-atama-placement-id does not exist it returns an empty string.
 */
function getPlacementIdFromElement(element: HTMLElement): string {
  return element?.dataset?.atamaPlacementId || '';
}

/**
 * Get the `data-atama-component-name` from a DOM element. If
 * data-atama-component-name does not exist it returns an empty string.
 */
function getComponentNameFromElement(element: HTMLElement): string {
  return element?.dataset?.atamaComponentName || '';
}

/**
 * Get all components within the given container
 */
function getComponents(container: HTMLElement): Array<HTMLElement> {
  return Array.from(container.querySelectorAll('[data-atama-id]'));
}

/**
 * Return the component with the given id
 */
function getComponentById(
  container: HTMLElement,
  id: string,
): HTMLElement | null {
  return container.querySelector(`[data-atama-id="${id}"]`);
}

/**
 * Scroll to the component with the given id
 */
function focusComponent(container: HTMLElement, id: string) {
  const component = getComponentById(container, id);

  if (!component) {
    return;
  }

  component.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'start',
  });
}

type ComponentDimensions = {
  top: number;
  left: number;
  width: number;
  height: number;
};
function getComponentPosition(element: HTMLElement): ComponentDimensions {
  const { top, left, width, height } = element.getBoundingClientRect();

  return {
    top: top + window.scrollY,
    left: left + window.scrollX,
    width,
    height,
  };
}

type Callbacks = {
  onEnterComponent: (
    id: string,
    componentType: string,
    componentDimensions: ComponentDimensions,
  ) => void;
  onLeaveComponent: () => void;
};

class Components {
  #container: HTMLElement;

  #callbacks: Callbacks;

  constructor(container: HTMLElement, callbacks: Callbacks) {
    this.#container = container;
    this.#callbacks = callbacks;

    this.addEventListener();
  }

  destroy() {
    this.removeEventListener();
  }

  updateListener() {
    this.removeEventListener();
    this.addEventListener();
  }

  focus(id: string) {
    focusComponent(this.#container, id);
  }

  onMouseEnterComponent(event: Event) {
    const target = event.target as HTMLElement;
    const id = getComponentIdFromElement(target);
    if (!id) {
      // This should be an edge case but we should consider it anways. The event
      // listener is looking for elements with [data-atama-id].
      return;
    }

    this.#callbacks.onEnterComponent(
      id,
      getComponentNameFromElement(target),
      getComponentPosition(target),
    );
  }

  onMouseLeaveComponent() {
    this.#callbacks.onLeaveComponent();
  }

  removeEventListener() {
    const components = getComponents(this.#container);

    if (!components) {
      return;
    }

    components.forEach((component) => {
      component.removeEventListener('mouseenter', this.onMouseEnterComponent);
      component.removeEventListener('mouseleave', this.onMouseLeaveComponent);
    });
  }

  addEventListener() {
    const components = getComponents(this.#container);

    if (!components) {
      return;
    }

    components.forEach((component) => {
      component.addEventListener(
        'mouseenter',
        this.onMouseEnterComponent.bind(this),
      );
      component.addEventListener(
        'mouseleave',
        this.onMouseLeaveComponent.bind(this),
      );
    });
  }

  getPlacementId(id: string) {
    const component = getComponentById(this.#container, id);

    if (!component) {
      return '';
    }

    return getPlacementIdFromElement(component);
  }
}

export { Components };
