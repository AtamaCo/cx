import type { CXExperience } from '@atamaco/cx-core';

/**
 * Abstract class for a fetcher to implement fetching channel experiences
 */
export abstract class Fetcher<C> {
  /**
   * The configuration for the Fetcher
   */
  config: C;

  /**
   * Initialize the fetcher
   * @param config The configuration for the Fetcher
   */
  constructor(config: C) {
    this.config = config;
  }

  /**
   * Gets the data from a remote location and returns it
   * @param identifier The identifier to use for fetching data
   */
  abstract getData<T>(identifier: string): Promise<CXExperience<T> | null>;

  /**
   * Get all paths that can be loaded as a page
   */
  abstract getAllPaths({
    excludedPaths,
    includedDirectories,
    excludedDirectories,
  }: {
    excludedPaths?: string[];
    includedDirectories?: string[];
    excludedDirectories?: string[];
  }): Promise<string[]>;
}
