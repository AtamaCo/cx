import type { CXExperience, Logger } from '@atamaco/cx-core';
import type { Fetcher, AtamaFetcherError } from '@atamaco/fetcher';
import type { AtamaFetcherConfig } from '@atamaco/fetcher-atama';
import type { DataFunctionArgs } from '@remix-run/server-runtime';

import { findComponentByComponentType } from '@atamaco/cx-core';
import { json } from '@remix-run/server-runtime';

interface ActionDefinition {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: (data: any, dataFnArgs: DataFunctionArgs) => Promise<object>;
  output: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    request: Request,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputResult: any,
  ) => Promise<object | [object, ResponseInit]>;
}

interface DataCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: (key: string) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (key: string, value: any) => void;
  has: (key: string) => boolean;
}

type ActionsList = Record<string, ActionDefinition>;

export interface GetComponentTypeReadActions {
  (args: DataFunctionArgs): ActionsList;
}

export interface GetComponentTypeWriteActions {
  (args: DataFunctionArgs): ActionsList;
}

function resolveUrlOrRequestToPath(urlOrRequest: Request | string) {
  if (typeof urlOrRequest === 'string') {
    return urlOrRequest;
  }
  const url = new URL(urlOrRequest.url);
  return url.pathname;
}

export class AtamaClient<C = AtamaFetcherConfig> {
  constructor(
    private readonly fetcher: Fetcher<C>,
    private readonly componentTypeActions?: {
      read?: Record<string, Record<string, ActionDefinition>>;
      write?: Record<string, Record<string, ActionDefinition>>;
    },
    private readonly logger?: Logger,
    private readonly cache?: DataCache,
  ) {}

  // eslint-disable-next-line no-underscore-dangle
  private async _loadPath<T>(path: string, args: DataFunctionArgs) {
    let result;

    this.logger?.info?.(`@atamaco/remix: Loading path ${path}`);
    if (this.cache?.has(`#atama/path/${path}`)) {
      this.logger?.debug?.(`@atamaco/remix: Cache hit for path ${path}`);
      result = (await this.cache.get(`#atama/path/${path}`)) as CXExperience<T>;
    } else {
      try {
        this.logger?.debug?.(
          `@atamaco/remix: No cache hit. Loading experience data for path ${path} from Delivery API`,
        );
        result = await this.fetcher.getData<T>(path);

        if (this.cache) {
          this.logger?.debug?.(`@atamaco/remix: Caching data for path ${path}`);
          this.cache.set(`#atama/path/${path}`, result);
        }
      } catch (error) {
        this.logger?.error?.(
          `@atamaco/remix: Could not load experience data for path ${path} from Delivery API`,
          error,
        );

        if ((error as AtamaFetcherError).message === 'not_found') {
          this.logger?.warn?.(
            `@atamaco/remix: Loading experienced data for path ${path} failed with not_found from Delivery API`,
          );
          return {
            status: 404,
          } as const;
        }

        this.logger?.warn?.(
          `@atamaco/remix: Loading experienced data for path ${path} failed with unknown error from Delivery API`,
        );
        return {
          status: 500,
        } as const;
      }
    }

    const componentTypesActions = this.componentTypeActions?.read;

    if (
      !!componentTypesActions &&
      Object.keys(componentTypesActions).length > 0
    ) {
      this.logger?.debug?.(`@atamaco/remix: Running actions for path ${path}`);

      try {
        const actionsToRun = result.placements.flatMap(
          (placement) =>
            placement.components
              ?.filter((component) => component.type in componentTypesActions)
              .flatMap((component) =>
                component.actions
                  .filter(
                    (action) =>
                      action.key in componentTypesActions[component.type],
                  )
                  .map((action) => ({
                    action,
                    component,
                  })),
              ) || [],
        );

        if (actionsToRun.length > 0) {
          this.logger?.debug?.(
            `@atamaco/remix: Running ${
              actionsToRun.length
            } actions for path ${path}: ${JSON.stringify(actionsToRun)}`,
          );

          await Promise.all(
            actionsToRun.map(async (action) => {
              this.logger?.debug?.(
                `@atamaco/remix: Running action ${action.action.key} on ${action.component.type}`,
              );
              const inputResult = await componentTypesActions[
                action.component.type
              ][action.action.key].input(
                action.component.contentProperties,
                args,
              );
              const actionResult = await this.fetcher.action({
                actionId: action.action.actionId,
                input: inputResult,
                slug: path,
              });

              this.logger?.debug?.(
                `@atamaco/remix: Received data for action ${
                  action.action.key
                } on ${action.component.type}: ${JSON.stringify(actionResult)}`,
              );

              // eslint-disable-next-line no-param-reassign
              action.component.contentProperties = await componentTypesActions[
                action.component.type
              ][action.action.key].output(
                actionResult as object,
                args.request,
                inputResult,
              );
            }),
          );
        } else {
          this.logger?.warn?.(
            `@atamaco/remix: No components found to run actions for path ${path}`,
          );
        }
      } catch (error) {
        this.logger?.error?.(
          '@atamaco/remix: Could not run one or more actions',
          error,
        );

        return {
          status: 500,
        } as const;
      }

      return {
        status: 200,
        data: result,
      } as const;
    }

    return {
      status: 200,
      data: result,
    } as const;
  }

  /**
   * Attempts to load a path from a list of paths. As soon as one path is found,
   * it will return the data. If it cannot find a path it will throw a 404.
   * Only throws a 500 if the fetcher throws a 500. This may happen at any of
   * the paths in the list.
   */
  async loadPaths<T>(
    args: DataFunctionArgs,
    pathOrPaths: Array<Request | string>,
  ) {
    this.logger?.info?.(`@atamaco/remix: Loading paths`);

    // eslint-disable-next-line no-restricted-syntax
    for await (const urlOrRequest of pathOrPaths) {
      try {
        const path = resolveUrlOrRequestToPath(urlOrRequest);
        this.logger?.debug?.(`@atamaco/remix: Attempting to load path ${path}`);

        // If `loadPath` does not throw then we return the data
        // eslint-disable-next-line no-underscore-dangle
        const { status, data } = await this._loadPath<T>(path, args);

        if (status === 200) {
          this.logger?.debug?.(`@atamaco/remix: Loaded path ${path}`);
          // If we get a 200 then we return the data
          return data;
        }
        // Otherwise we continue the for loop
        this.logger?.debug?.(
          `@atamaco/remix: Could not find data for path ${path}. Continuing with next path.`,
        );
      } catch (error) {
        // If a promise rejects with anything other than a 404 then we throw a
        // 500 because that means there's an issue with the Delivery API.
        // Reject early rather than bombarding the API with requests.
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw new Response('', { status: 500 });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new Response('', { status: 404 });
  }

  async loader<T>(args: DataFunctionArgs, pathOverride?: string) {
    if (!pathOverride) {
      return this.loadPaths<T>(args, [args.request]);
    }

    return this.loadPaths<T>(args, [pathOverride]);
  }

  async action<T>(args: DataFunctionArgs, pathOverride?: string) {
    this.logger?.info?.(`@atamaco/remix: Running action`);
    if (!this.componentTypeActions?.write) {
      throw new Error('No write actions defined');
    }

    let path: string;
    if (pathOverride) {
      path = pathOverride;
    } else {
      const url = new URL(args.request.url);
      path = url.pathname;
    }

    const body = await args.request.formData();
    const {
      actionKey: omittedActionKey,
      componentType: omittedComponentType,
      ...formData
    } = Object.fromEntries(body.entries());
    const actionKey = body.get('actionKey') as string;
    const componentType = body.get('componentType') as string;

    const componentTypeActionDefinitions =
      this.componentTypeActions?.write[componentType];
    const actionDefinition = componentTypeActionDefinitions[actionKey];

    if (!actionDefinition) {
      this.logger?.error?.(
        `@atamaco/remix: Unknown action "${actionKey}" for component type "${componentType}"`,
      );

      return new Response(undefined, {
        status: 400,
      });
    }

    this.logger?.debug?.(
      `@atamaco/remix: Loading path ${path} to get action information.`,
    );
    // eslint-disable-next-line no-underscore-dangle
    const { data: experience, status } = await this._loadPath(path, args);

    if (status === 404 || status === 500) {
      this.logger?.error?.(
        `@atamaco/remix: Unable to load path "${path}". Status: ${status}`,
      );

      return new Response(undefined, {
        status,
      });
    }

    const actualComponentType = findComponentByComponentType(
      experience!,
      componentType,
    );

    if (!actualComponentType) {
      this.logger?.error?.(
        `@atamaco/remix: Unable to find component type "${componentType}" in experience "${path}"`,
      );

      return new Response(undefined, {
        status: 500,
      });
    }

    const actionId = actualComponentType.actions.find(
      (action) => action.key === actionKey,
    )?.actionId;

    if (!actionId) {
      this.logger?.error?.(
        `@atamaco/remix: Unable to find action "${actionKey}" in component type "${componentType}"`,
      );

      return new Response(undefined, {
        status: 500,
      });
    }

    let result;
    let inputResult;
    try {
      this.logger?.debug?.(
        `@atamaco/remix: Running action "${actionKey}" on "${componentType}"`,
      );

      inputResult = (await actionDefinition.input(
        formData,
        args,
      )) as unknown as T;

      this.logger?.debug?.(
        `@atamaco/remix: Running action "${actionKey}" with the following input: ${JSON.stringify(
          inputResult,
        )}`,
      );

      result = await this.fetcher.action<T, unknown>({
        actionId,
        input: inputResult,
        slug: path,
      });
    } catch (error) {
      this.logger?.error?.(
        `@atamaco/remix: Error running action "${actionKey}"`,
        error,
      );

      return json('', {
        status: 500,
      });
    }

    this.logger?.debug?.(
      `@atamaco/remix: Passing action result to output transform for action "${actionKey}"`,
    );
    const response = await actionDefinition.output(
      result,
      args.request,
      inputResult,
    );

    this.logger?.debug?.(
      `@atamaco/remix: Got the following output from action "${actionKey}": ${JSON.stringify(
        response,
      )}`,
    );

    if (Array.isArray(response)) {
      return json(response[0], response[1]);
    }

    return json(response);
  }
}
