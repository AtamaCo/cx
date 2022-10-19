import type { Fetcher } from '@atamaco/fetcher';
import type { HydrogenRouteProps } from '@shopify/hydrogen';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery } from '@shopify/hydrogen';

/**
 * Fetch data from Atama using a `slug`.
 *
 * @param fetcher The fetcher to use to fetch data.
 * @param slug The slug of the page to fetch data for.
 * @param [basePath] The base path to use for the request.
 */
export function useAtama<C>(fetcher: Fetcher<C>, slug: string, basePath = '') {
  const pathname = slug.replace(
    basePath.startsWith('/') && basePath !== '' ? basePath : `/${basePath}`,
    '',
  );

  const { data } = useQuery(['atama', pathname], async () =>
    fetcher.getData(pathname),
  );

  return data;
}

/**
 * Fetch data from Atama using the Hydrogen `request` route property.
 *
 * @param fetcher The fetcher to use to fetch data.
 * @param request The Hydrogen `request` route property.
 * @param [basePath] The base path to use for the request.
 */
export function useAtamaFromRequest<C>(
  fetcher: Fetcher<C>,
  request: HydrogenRouteProps['request'],
  basePath = '',
) {
  const { pathname } = new URL(request.normalizedUrl);

  return useAtama(fetcher, pathname, basePath);
}
