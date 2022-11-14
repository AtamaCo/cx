import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { FetcherAtama } from './index';

const API_KEY = 'test-api-key';
const WORKSPACE_ID = 'test-workspace-id';

const server = setupServer(
  rest.get(
    'https://cdn.atama.land/v1/prod/:workspaceId/paths',
    (req, res, ctx) => {
      const auth = req.headers.get('Authorization');

      if (!auth || auth !== `Bearer ${API_KEY}`) {
        return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
      }

      if (req.params.workspaceId !== WORKSPACE_ID) {
        return res(ctx.status(404), ctx.json({ message: 'Not found' }));
      }

      if (req.url.searchParams.get('includedPaths')) {
        return res(
          ctx.status(200),
          ctx.json({
            paths: [
              '/included',
              '/paths',
              req.url.searchParams.get('includedPaths'),
            ],
          }),
        );
      }

      if (req.url.searchParams.get('excludedPaths')) {
        return res(
          ctx.status(200),
          ctx.json({
            paths: [
              '/excluded',
              '/paths',
              req.url.searchParams.get('excludedPaths'),
            ],
          }),
        );
      }

      return res(
        ctx.status(200),
        ctx.json({
          paths: ['/index', '/about'],
        }),
      );
    },
  ),
  rest.get('https://custom.api/v1/prod/:workspaceId/paths', (req, res, ctx) => {
    const auth = req.headers.get('Authorization');

    if (!auth || auth !== `Bearer ${API_KEY}`) {
      return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
    }

    if (req.params.workspaceId !== WORKSPACE_ID) {
      return res(ctx.status(404), ctx.json({ message: 'Not found' }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        paths: ['/index', '/about'],
      }),
    );
  }),
);

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  });
});

afterAll(() => {
  server.close();
});

describe('getAllPaths', () => {
  it('calls the Content Delivery API with Authorization header', async () => {
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

  it('throws if it cannot parse the response', async () => {
    server.use(
      rest.get(
        'https://cdn.atama.land/v1/prod/:workspaceId/paths',
        (req, res, ctx) =>
          res.once(ctx.status(200), ctx.text('this is not JSON')),
      ),
    );

    const fetcher = new FetcherAtama({
      apiKey: API_KEY,
      workspaceId: WORKSPACE_ID,
    });

    await expect(fetcher.getAllPaths()).rejects.toThrow();
  });
});
