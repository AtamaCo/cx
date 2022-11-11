import { Fetcher } from '@atamaco/fetcher';
import fetch from 'cross-fetch';

/**
 * Fetches data from the Atama Content Delivery API
 *
 * @param {config} config
 * @param {string} config.apiKey - The API key for the Atama Content Delivery API
 * @param {string} config.workspaceId - The workspace ID for the Atama Content Delivery API
 * @param {("preview"|"prod")} [config.environment=prod] - The environment to use for the Atama Content Delivery API.
 * @param {string} [config.url=http://cdn.atama.land] - The URL to use for the Atama Content Delivery API. Only use this if you are using a custom Atama Content Delivery API
 */
export class FetcherAtama extends Fetcher<{
  apiKey: string;
  workspaceId: string;
  environment?: 'preview' | 'prod';
  url?: string;
}> {
  /**
   * Get a list of all published paths from the Content Delivery API.
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
  } = {}) {
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
      console.debug(`Running request to get paths against ${url.toString()}`);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error returned from Content Delivery API');
      }

      result = await response.json();

      console.debug(`Trace ID: ${response.headers.get('X-Amzn-Trace-Id')}`);

      console.log('Received result from API', result);
    } catch (error) {
      console.log('Could not get paths from Content Delivery API', error);
      throw new Error('Could not get paths from Content Delivery API');
    }

    return result.paths;
  }

  /**
   * Get data for a specific path from the Content Delivery API.
   *
   * @param {string} identifier The path to get data for
   */
  async getData(identifier: string) {
    let result;

    const url = new URL(
      `v1/${this.config.environment || 'prod'}/${
        this.config.workspaceId
      }/data/${identifier.startsWith('/') ? identifier.slice(1) : identifier}`,
      this.config.url || 'https://cdn.atama.land',
    );

    try {
      console.debug(`Running request to get data against ${url.toString()}`);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error returned from Content Delivery API');
      }

      result = await response.json();
    } catch (error) {
      throw new Error('Could not get data from Content Delivery API');
    }

    return result;
  }
}
