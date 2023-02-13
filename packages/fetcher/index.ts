/* eslint-disable max-classes-per-file */
import type { CXExperience } from '@atamaco/cx-core';

export class AtamaFetcherError extends Error {
  constructor(private readonly statusCode: number) {
    super(
      [
        {
          status: 401,
          message: 'unauthorized',
        },
        {
          status: 404,
          message: 'not_found',
        },
      ].find((config) => config.status === statusCode)?.message ||
        'internal_server_error',
    );

    Object.setPrototypeOf(this, AtamaFetcherError.prototype);
  }

  get status() {
    return this.statusCode;
  }
}

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
  abstract getData<T>(identifier: string): Promise<CXExperience<T>>;

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

  /**
   * Run an action
   */
  abstract action<T, R>({
    actionId,
    slug,
    input,
  }: {
    actionId: string;
    slug: string;
    input: T;
  }): Promise<R>;
}
