import type { CXExperience } from '@atamaco/cx-core';

import { AtamaFetcherError, Fetcher } from '@atamaco/fetcher';

export interface AtamaFetcherConfig {
  apiKey: string;
  workspaceId: string;
  environment?: 'preview' | 'prod';
  url?: string;
}

/**
 * Fetches data from the Atama Delivery API
 *
 * @param {config} config
 * @param {string} config.apiKey - The API key for the Atama Delivery API
 * @param {string} config.workspaceId - The workspace ID for the Atama Delivery API
 * @param {("preview"|"prod")} [config.environment=prod] - The environment to use for the Atama Delivery API.
 * @param {string} [config.url=http://cdn.atama.land] - The URL to use for the Atama Delivery API. Only use this if you are using a custom Atama Delivery API
 */
export class FetcherAtama extends Fetcher<AtamaFetcherConfig> {
  /**
   * Get a list of all published paths from the Delivery API.
   *
   * @param {object} obj
   * @param obj.includedPaths An array of paths to include in the list of paths
   * @param obj.excludedPaths An array of paths to exclude from the list of paths
   */
  async getAllPaths({
    includedPaths,
    excludedPaths,
  }: {
    includedPaths?: string[];
    excludedPaths?: string[];
  } = {}): Promise<string[]> {
    const url = this.config.url
      ? new URL(
          `v1/${this.config.environment || 'prod'}/${
            this.config.workspaceId
          }/paths`,
          this.config.url,
        )
      : new URL(
          `https://cdn.atama.land/v1/${this.config.environment || 'prod'}/${
            this.config.workspaceId
          }/paths`,
        );
    if (includedPaths) {
      url.searchParams.set('includedPaths', includedPaths?.join(','));
    }

    if (excludedPaths) {
      url.searchParams.set('excludedPaths', excludedPaths?.join(','));
    }

    let result;
    try {
      // eslint-disable-next-line no-console
      console.debug(`Running request to get paths against ${url.toString()}`);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new AtamaFetcherError(response.status);
      }

      result = await response.json();

      // eslint-disable-next-line no-console
      console.debug(`Trace ID: ${response.headers.get('X-Amzn-Trace-Id')}`);

      // eslint-disable-next-line no-console
      console.log('Received result from API', result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Could not get paths from Delivery API', error);

      if (error instanceof AtamaFetcherError) {
        throw error;
      }

      throw new AtamaFetcherError(500);
    }

    return result.paths;
  }

  /**
   * Get data for a specific path from the Delivery API.
   *
   * @param {string} identifier The path to get data for
   */
  async getData<T>(identifier: string): Promise<CXExperience<T>> {
    const url = new URL(
      `v1/${this.config.environment || 'prod'}/${
        this.config.workspaceId
      }/data/${identifier.startsWith('/') ? identifier.slice(1) : identifier}`,
      this.config.url || 'https://cdn.atama.land',
    );

    try {
      // eslint-disable-next-line no-console
      console.debug(`Running request to get data against ${url.toString()}`);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new AtamaFetcherError(response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AtamaFetcherError) {
        throw error;
      }

      throw new AtamaFetcherError(500);
    }
  }
}
