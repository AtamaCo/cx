import type { CXExperience } from '@atamaco/cx-core';
import type { GraphQLError } from 'graphql';

import { AtamaFetcherError, Fetcher } from '@atamaco/fetcher';
import { gql, GraphQLClient } from 'graphql-request';

export interface AtamaFetcherConfig {
  apiKey: string;
  workspaceId: string;
  environment?: 'preview' | 'prod';
  url?: string;
}

interface GetPathsInput {
  workspaceId: string;
  environment?: 'preview' | 'prod';
  excludedPaths?: String;
  includedPaths?: String;
}

interface GetDataInput {
  workspaceId: string;
  environment: 'preview' | 'prod';
  slug: String;
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
  graphQLClient?: GraphQLClient;

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
    const pathsInput: GetPathsInput = {
      workspaceId: this.config.workspaceId,
      environment: this.config.environment,
    };
    if (includedPaths) {
      pathsInput.includedPaths = includedPaths?.join(',');
    }

    if (excludedPaths) {
      pathsInput.excludedPaths = excludedPaths?.join(',');
    }

    let result;
    try {
      const response = await this.runGraphQLRequest<{
        getPaths: string[];
      }>(
        gql`
          query GetPaths($pathsInput: GetPathsInput!) {
            getPaths(pathsInput: $pathsInput)
          }
        `,
        {
          pathsInput,
        },
      );

      if (!response.getPaths) {
        throw new AtamaFetcherError(500);
      }

      result = response.getPaths;

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

    return result;
  }

  /**
   * Get data for a specific path from the Delivery API.
   *
   * @param {string} identifier The path to get data for
   */
  async getData<T>(identifier: string): Promise<CXExperience<T>> {
    const dataInput: GetDataInput = {
      workspaceId: this.config.workspaceId,
      environment: this.config.environment || 'prod',
      slug: identifier,
    };

    try {
      const response = await this.runGraphQLRequest<{
        getData: CXExperience<T>;
      }>(
        gql`
          query GetData($dataInput: GetDataInput!) {
            getData(dataInput: $dataInput) {
              meta
              template
              placements {
                code
                embeddableBlueprint {
                  template
                  placements {
                    components {
                      correlationId
                      type
                      contentProperties
                      visualProperties
                      componentTypeName
                    }
                  }
                }
                components {
                  correlationId
                  type
                  contentProperties
                  visualProperties
                  componentTypeName
                }
              }
            }
          }
        `,
        {
          dataInput,
        },
      );

      if (!response.getData) {
        throw new AtamaFetcherError(500);
      }

      return response.getData;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Could not get data from Delivery API', error);
      if (error instanceof AtamaFetcherError) {
        throw error;
      }

      throw new AtamaFetcherError(500);
    }
  }

  /**
   * Either creates or re-uses a GraphQL Client to run a query with credentials
   * configured in the {@link Fetcher}. If an error response is received from the request
   * an {@link AtamaFetcherError} is thrown.
   *
   * @param query The GraphQL query string
   * @param variables Any variables used in the above query
   * @returns The passed in generic type from the data of the response
   * @throws {@link AtamaFetcherError} with a status code
   */
  async runGraphQLRequest<T>(query: string, variables: object): Promise<T> {
    const url = this.config.url || 'https://cdn.prod-composer.atama.land/v1';
    // eslint-disable-next-line no-console
    console.debug(`Running GraphQL request to ${url}`);
    if (!this.graphQLClient) {
      this.graphQLClient = new GraphQLClient(url, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        fetch,
      });
    }

    try {
      // Using raw request to bring out the headers for tracing.
      const { data, headers } = await this.graphQLClient.rawRequest<T>(
        query,
        variables,
      );
      // eslint-disable-next-line no-console
      console.debug(`Trace ID: ${headers.get('X-Amzn-Trace-Id')}`);
      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('GraphQL Request Error: ', error);
      if (
        (
          error as { response: { errors: GraphQLError[] } }
        )?.response?.errors?.some(
          (graphQLError: GraphQLError) =>
            graphQLError.message === 'Could not load JSON data',
        )
      ) {
        throw new AtamaFetcherError(404);
      }
      throw new AtamaFetcherError(500);
    }
  }
}
