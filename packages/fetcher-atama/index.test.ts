import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import fetch from 'cross-fetch';

import { FetcherAtama } from './index';

const API_KEY = 'test-api-key';
const WORKSPACE_ID = 'test-workspace-id';

const server = setupServer(
  graphql.query('GetPaths', (req, res, ctx) => {
    let paths = ['/index', '/about'];
    if (req.variables.pathsInput.workspaceId !== WORKSPACE_ID) {
      return res(ctx.errors([{ message: 'Not found' }]));
    }
    const auth = req.headers.get('Authorization');

    if (!auth || auth !== `Bearer ${API_KEY}`) {
      return res(ctx.errors([{ message: 'Unauthorized' }]));
    }

    if (req.variables.pathsInput.excludedPaths) {
      paths = ['/excluded', '/paths', req.variables.pathsInput.excludedPaths];
    }
    if (req.variables.pathsInput.includedPaths) {
      paths = ['/included', '/paths', req.variables.pathsInput.includedPaths];
    }
    return res(
      ctx.data({
        getPaths: paths,
      }),
    );
  }),
);

beforeAll(() => {
  global.fetch = fetch;
  server.listen({
    onUnhandledRequest: 'error',
  });
});

afterAll(() => {
  server.close();
});

describe('getAllPaths', () => {
  it('calls the Delivery API with Authorization header', async () => {
    const fetcherWithValidAPIKey = new FetcherAtama({
      apiKey: API_KEY,
      workspaceId: WORKSPACE_ID,
    });

    const result = await fetcherWithValidAPIKey.getAllPaths();

    expect(result).toEqual(['/index', '/about']);

    const fetcherWithInvalidAPIKey = new FetcherAtama({
      apiKey: 'invalid-api-key',
      workspaceId: WORKSPACE_ID,
    });

    await expect(fetcherWithInvalidAPIKey.getAllPaths()).rejects.toThrow();
  });

  it('calls custom endpoint', async () => {
    const fetcherWithValidAPIKey = new FetcherAtama({
      apiKey: API_KEY,
      workspaceId: WORKSPACE_ID,
      url: 'https://custom.api',
    });

    const result = await fetcherWithValidAPIKey.getAllPaths();

    expect(result).toEqual(['/index', '/about']);
  });

  it('throws when workspace cannot be found', async () => {
    const fetcherWithValidAPIKey = new FetcherAtama({
      apiKey: API_KEY,
      workspaceId: 'non-existent-workspace',
    });

    await expect(fetcherWithValidAPIKey.getAllPaths()).rejects.toThrow();
  });

  it('passes "includedPaths" along as search parameter, joining them by comma', async () => {
    const includedPaths = ['/included', '/paths'];
    const fetcherWithValidAPIKey = new FetcherAtama({
      apiKey: API_KEY,
      workspaceId: WORKSPACE_ID,
    });

    const result = await fetcherWithValidAPIKey.getAllPaths({
      includedPaths,
    });

    expect(result).toEqual([...includedPaths, includedPaths.join(',')]);
  });

  it('passes "excludedPaths" along as search parameter, joining them by comma', async () => {
    const excludedPaths = ['/excluded', '/paths'];
    const fetcherWithValidAPIKey = new FetcherAtama({
      apiKey: API_KEY,
      workspaceId: WORKSPACE_ID,
    });

    const result = await fetcherWithValidAPIKey.getAllPaths({
      excludedPaths,
    });

    expect(result).toEqual([...excludedPaths, excludedPaths.join(',')]);
  });
});
