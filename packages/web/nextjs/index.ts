import type { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import type { AtamaFetcherError, Fetcher } from '@atamaco/fetcher';
import type { CXExperience } from '@atamaco/cx-core';

export interface AtamaProps<T> {
  data?: CXExperience<T>;
  error?: boolean;
}

export function getServerSidePropsFactory<C>(
  fetcher: Fetcher<C>,
  slug?: string,
) {
  return async function getServerSideProps({
    params = {},
  }: GetServerSidePropsContext) {
    const identifier =
      slug ||
      (params.slug && Array.isArray(params.slug) ? params.slug.join('/') : '');

    try {
      const data = await fetcher.getData(identifier);

      if (!data) {
        // eslint-disable-next-line no-console
        console.debug(`No data found for slug '${identifier}'`);

        throw new Error(`No data found for slug '${identifier}'`);
      }

      return {
        props: {
          data,
        },
      };
    } catch (error) {
      if ((error as AtamaFetcherError).message === 'not_found') {
        // eslint-disable-next-line no-console
        console.warn(`Could not find data for slug '${identifier}'`);

        return {
          notFound: true,
        };
      }

      // eslint-disable-next-line no-console
      console.warn(`Could not get data for slug '${identifier}'`);
      throw new Error(`Could not get data for slug '${identifier}'`);
    }
  };
}

export function getStaticPropsFactory<C>(
  fetcher: Fetcher<C>,
  revalidate = 60,
  prefix = '',
  slug?: string,
) {
  return async function getStaticProps(
    context: GetStaticPropsContext<{ slug: string[] }>,
  ) {
    if (!slug && !context.params?.slug && prefix === '') {
      // eslint-disable-next-line no-console
      console.debug('No slug passed in.');

      throw new Error('No slug passed in.');
    }

    const identifier =
      slug ||
      (context.params?.slug && Array.isArray(context.params.slug)
        ? context.params.slug.join('/')
        : '');

    try {
      const data = await fetcher.getData(
        [prefix, identifier].filter((value) => value !== '').join('/'),
      );

      if (!data) {
        // eslint-disable-next-line no-console
        console.debug(`No data found for slug '${identifier}'`);
        throw new Error(`No data found for slug '${identifier}'`);
      }

      return {
        props: {
          data,
        },
        revalidate,
      };
    } catch (error) {
      if ((error as AtamaFetcherError).message === 'not_found') {
        // eslint-disable-next-line no-console
        console.warn(`Could not find data for slug '${identifier}'`, error);

        return {
          notFound: true,
          revalidate,
        };
      }

      // eslint-disable-next-line no-console
      console.warn(`Could not get data for slug '${identifier}'`, error);
      throw new Error(`Could not get data for slug '${identifier}'`);
    }
  };
}

export function getStaticPathsFactory<C>(
  fetcher: Fetcher<C>,
  config: Parameters<Fetcher<C>['getAllPaths']>[0] = {
    excludedPaths: ['/', '404'],
  },
) {
  return async function getStaticPaths() {
    try {
      const paths = await fetcher.getAllPaths(config);
      return {
        paths,
        fallback: 'blocking',
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Could not get paths', error);

      return {
        paths: [],
        fallback: 'blocking',
      };
    }
  };
}
