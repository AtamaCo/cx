interface EventListener {
  eventName: string;
  getElements: (
    container: HTMLElement,
  ) => Window | HTMLElement | Array<HTMLElement> | Array<Element> | null;
  callback: (event: Event) => void;
}

type EventListeners = Array<EventListener>;

/**
 * Iterate through the eventListener configuration and apply the listener.
 */
function addListener(container: HTMLElement, eventListener: EventListeners) {
  eventListener.forEach(
    ({ getElements, eventName, callback }: EventListener) => {
      const elements = getElements(container);

      if (!elements) {
        return;
      }

      if (Array.isArray(elements)) {
        elements.forEach((element) => {
          element.addEventListener(eventName, callback);
        });
      } else {
        elements.addEventListener(eventName, callback);
      }
    },
  );
}

/**
 * Removes all eventListeners set for the preview to work
 */
function removeListener(container: HTMLElement, eventListener: EventListeners) {
  eventListener.forEach(
    ({ getElements, eventName, callback }: EventListener) => {
      const elements = getElements(container);

      if (!elements) {
        return;
      }

      if (Array.isArray(elements)) {
        elements.forEach((element) => {
          element.removeEventListener(eventName, callback);
        });
      } else {
        elements.removeEventListener(eventName, callback);
      }
    },
  );
}

export { addListener, removeListener };
