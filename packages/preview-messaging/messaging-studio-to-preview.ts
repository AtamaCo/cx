import type { CXPlacement } from '@atamaco/cx-core';

import {
  MessageTypes,
  dispatch,
  updateData,
  focusComponent,
} from './messages.js';

interface Callbacks {
  onEditComponent: (id: string) => void;
  onPreviewReady: () => void;
  onDeleteComponent: ({
    correlationId,
    placementId,
  }: {
    correlationId: string;
    placementId: string;
  }) => void;
}

const allowedTypes = [
  MessageTypes.EDIT_COMPONENT,
  MessageTypes.DELETE_COMPONENT,
  MessageTypes.PREVIEW_READY,
];

/**
 * Handle messaging from the Studio UI to the Preview
 */
export class MessagingStudioToPreview {
  target: HTMLIFrameElement;

  callbacks: Callbacks;

  allowedOrigin: string;

  // We need to bind the `onMessage` method so it has the correct context when
  // using with addEventListener and removeEventListener
  boundOnMessage: (event: MessageEvent) => void;

  constructor(
    callbacks: Callbacks,
    target: HTMLIFrameElement,
    allowedOrigin: string,
  ) {
    this.callbacks = callbacks;
    this.allowedOrigin = allowedOrigin;

    this.boundOnMessage = (event: MessageEvent) => this.onMessage(event);
    window.addEventListener('message', this.boundOnMessage);

    this.target = target;
  }

  /**
   * Set the target where the preview is running (iframe)
   */
  setTarget(target: HTMLIFrameElement) {
    this.target = target;
  }

  /**
   * Update the data in the preview
   */
  updateData<T>(layout: string, placements: CXPlacement<T>[]) {
    if (!this.target.contentWindow) {
      return;
    }

    dispatch(updateData(layout, placements), this.target.contentWindow);
  }

  /**
   * Focus on a component in the preview
   */
  focusComponent(correlationId: string) {
    if (!this.target.contentWindow) {
      return;
    }

    dispatch(focusComponent(correlationId), this.target.contentWindow);
  }

  /**
   * Stop communication with Preview
   */
  destroy() {
    window.removeEventListener('message', this.boundOnMessage);
  }

  /**
   * Callback that's running when a message from the preview was received
   */
  private onMessage(event: MessageEvent) {
    const { data } = event;
    const type = data.type as MessageTypes;

    if (!type || !allowedTypes.includes(type)) {
      // eslint-disable-next-line no-console
      console.debug(`Unknown message`, data);
      return;
    }

    if (new URL(event.origin).origin !== new URL(this.allowedOrigin).origin) {
      // eslint-disable-next-line no-console
      console.error(`Ignored message from unknown origin ${event.origin}`);
      return;
    }

    if (type === MessageTypes.EDIT_COMPONENT) {
      this.callbacks.onEditComponent(data.payload.correlationId);
    }

    if (type === MessageTypes.DELETE_COMPONENT) {
      this.callbacks.onDeleteComponent(data.payload);
    }

    if (type === MessageTypes.PREVIEW_READY) {
      this.callbacks.onPreviewReady();
    }
  }
}
