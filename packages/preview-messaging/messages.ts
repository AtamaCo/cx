import type { CXPlacement } from '@atamaco/cx-core';

export enum MessageTypes {
  EDIT_COMPONENT = 'editComponent',
  DELETE_COMPONENT = 'deleteComponent',
  FOCUS_COMPONENT = 'focusComponent',
  UPDATE_DATA = 'updateData',
  PREVIEW_READY = 'previewReady',
}

interface Action<T> {
  type: string;
  payload: T;
}

export function updateData(
  layout: string,
  placements: CXPlacement[],
): Action<{ layout: string; placements: CXPlacement[] }> {
  return {
    type: MessageTypes.UPDATE_DATA,
    payload: {
      layout,
      placements,
    },
  };
}

export function editComponent(
  correlationId: string,
): Action<{ correlationId: string }> {
  return {
    type: MessageTypes.EDIT_COMPONENT,
    payload: {
      correlationId,
    },
  };
}

export function deleteComponent({
  correlationId,
  placementId,
}: {
  correlationId: string;
  placementId: string;
}): Action<{ correlationId: string; placementId: string }> {
  return {
    type: MessageTypes.DELETE_COMPONENT,
    payload: {
      correlationId,
      placementId,
    },
  };
}

export function focusComponent(
  correlationId: string,
): Action<{ correlationId: string }> {
  return {
    type: MessageTypes.FOCUS_COMPONENT,
    payload: {
      correlationId,
    },
  };
}

export function previewReady(): Action<{}> {
  return {
    type: MessageTypes.PREVIEW_READY,
    payload: {},
  };
}

export function dispatch<T>(action: Action<T>, target: Window) {
  target.postMessage(action, '*');
}
