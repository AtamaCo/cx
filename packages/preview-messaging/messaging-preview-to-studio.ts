import type { CXPlacement } from '@atamaco/cx-core';

import {
  MessageTypes,
  deleteComponent,
  dispatch,
  editComponent,
  previewReady,
} from './messages.js';

interface Callbacks<T> {
  onUpdateData: (placements: CXPlacement<T>[], layout: string) => void;
  onFocusComponent: (id: string) => void;
}

const allowedTypes = [MessageTypes.UPDATE_DATA, MessageTypes.FOCUS_COMPONENT];

/**
 * Handle messaging from preview to Studio UI
 */
export class MessagingPreviewToStudio<T> {
  callbacks: Callbacks<T>;

  allowedOrigin: string;

  // We need to bind the `onMessage` method so it has the correct context when
  // using with addEventListener and removeEventListener
  boundOnMessage: (event: MessageEvent) => void;

  constructor(
    callbacks: Callbacks<T>,
    allowedOrigin: string = 'https://studio.atama.co',
  ) {
    this.callbacks = callbacks;
    this.allowedOrigin = allowedOrigin;

    this.boundOnMessage = (event: MessageEvent) => this.onMessage(event);
    window.addEventListener('message', this.boundOnMessage);
  }

  // eslint-disable-next-line class-methods-use-this
  editComponent(correlationId: string) {
    dispatch(editComponent(correlationId), window.parent);
  }

  // eslint-disable-next-line class-methods-use-this
  previewReady() {
    dispatch(previewReady(), window.parent);
  }

  // eslint-disable-next-line class-methods-use-this
  deleteComponent({
    correlationId,
    placementId,
  }: {
    correlationId: string;
    placementId: string;
  }) {
    dispatch(deleteComponent({ correlationId, placementId }), window.parent);
  }

  /**
   * Stop communication with Studio UI
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
      // console.debug(`Unknown message`, data);
      return;
    }

    if (event.origin !== this.allowedOrigin) {
      // console.error(`Ignored message from unknown origin ${event.origin}`);
      return;
    }

    if (type === MessageTypes.UPDATE_DATA) {
      this.callbacks.onUpdateData(data.payload.placements, data.payload.layout);
    }

    if (type === MessageTypes.FOCUS_COMPONENT) {
      this.callbacks.onFocusComponent(data.payload.correlationId);
    }
  }
}
