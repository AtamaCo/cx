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
 * @param {string} [config.url=http://cdn.atama.app/v1] - The URL to use for the Atama Delivery API. Only use this if you are using a custom Atama Delivery API
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
    this.logger?.info?.(`@atamaco/fetcher-atama: Fetching paths from API`);
    this.logger?.debug?.(
      `@atamaco/fetcher-atama: Excluded paths`,
      excludedPaths,
    );
    this.logger?.debug?.(
      `@atamaco/fetcher-atama: Included paths`,
      includedPaths,
    );

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

      this.logger?.debug?.(
        '@atamaco/fetcher-atama: Received result from API',
        result,
      );
    } catch (error) {
      this.logger?.error?.(
        '@atamaco/fetcher-atama: Could not get paths from Delivery API',
        error,
      );

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
    this.logger?.info?.(
      `@atamaco/fetcher-atama: Fetching data from API for path ${identifier}`,
    );

    const dataInput: GetDataInput = {
      workspaceId: this.config.workspaceId,
      environment: this.config.environment || 'prod',
      slug: identifier,
    };

    this.logger?.debug?.(
      `@atamaco/fetcher-atama: Using the following data: ${JSON.stringify(
        dataInput,
      )}`,
    );

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
                      actions {
                        key
                        actionId
                      }
                    }
                  }
                }
                components {
                  correlationId
                  type
                  contentProperties
                  visualProperties
                  componentTypeName
                  actions {
                    key
                    actionId
                  }
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
        this.logger?.error?.(`@atamaco/fetcher-atama: No data received`);
        throw new AtamaFetcherError(500);
      }

      return response.getData;
    } catch (error) {
      this.logger?.error?.(
        '@atamaco/fetcher-atama: Could not get data from Delivery API',
        error,
      );
      if (error instanceof AtamaFetcherError) {
        throw error;
      }

      throw new AtamaFetcherError(500);
    }
  }

  /**
   * Run an action against the Delivery API.
   */
  async action<T, R>({
    actionId,
    slug,
    input,
  }: {
    actionId: string;
    slug: string;
    input: T;
  }) {
    this.logger?.info?.(`@atamaco/fetcher-atama: Running action ${actionId}`);
    this.logger?.info?.(
      `@atamaco/fetcher-atama: Running action on path ${slug} with input ${JSON.stringify(
        input,
      )}`,
    );

    let result;
    try {
      const response = await this.runGraphQLRequest<{
        action: R;
      }>(
        gql`
          mutation Action(
            $dataInput: GetDataInput!
            $actionInput: ActionInput!
          ) {
            action(dataInput: $dataInput, actionInput: $actionInput)
          }
        `,
        {
          dataInput: {
            workspaceId: this.config.workspaceId,
            environment: this.config.environment || 'prod',
            slug,
          },
          actionInput: {
            actionId,
            input,
          },
        },
      );

      result = response.action;

      this.logger?.debug?.(
        '@atamaco/fetcher-atama: Received action result from API',
        result,
      );
    } catch (error) {
      this.logger?.error?.(
        '@atamaco/fetcher-atama: Could not run action against Delivery API',
        error,
      );

      throw new AtamaFetcherError(500);
    }

    return result;
  }

  /**
   * Either creates or re-uses a GraphQL Client to run a query with credentials
   * configured in the {@link Fetcher}. If an error response is received from
   * the request an {@link AtamaFetcherError} is thrown.
   *
   * @param query The GraphQL query string
   * @param variables Any variables used in the above query
   * @returns The passed in generic type from the data of the response
   * @throws {@link AtamaFetcherError} with a status code
   */
  private async runGraphQLRequest<T>(
    query: string,
    variables: object,
  ): Promise<T> {
    const url = this.config.url || 'https://cdn.atama.app/v1';

    this.logger?.debug?.(`Running GraphQL request against ${url}`);

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

      this.logger?.debug?.(
        `@atamaco/fetcher-atama: Trace ID for GraphQL request is ${headers.get(
          'X-Amzn-Trace-Id',
        )}`,
      );
      return data;
    } catch (error) {
      this.logger?.error?.(
        '@atamaco/fetcher-atama: GraphQL Request Error: ',
        error,
      );

      if (
        (
          error as { response: { errors: GraphQLError[] } }
        )?.response?.errors?.some(
          (graphQLError: GraphQLError) =>
            graphQLError.message === 'Could not load JSON data',
        )
      ) {
        this.logger?.warn?.(
          `@atamaco/fetcher-atama: Identified error as not_found`,
        );

        throw new AtamaFetcherError(404);
      }

      this.logger?.warn?.(
        `@atamaco/fetcher-atama: Identified error as internal_server_error`,
      );
      throw new AtamaFetcherError(500);
    }
  }
}
