/**
 * Set the active component id on the container.
 */
function setActiveComponentId(container: HTMLElement, id: string) {
  // eslint-disable-next-line no-param-reassign
  container.dataset.atamaActiveComponentId = id;
}

function getActiveComponentId(container: HTMLElement): string {
  return container.dataset.atamaActiveComponentId || '';
}

export { setActiveComponentId, getActiveComponentId };
