import type { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import type { Fetcher } from '@atamaco/fetcher';
import type { CXExperience } from '@atamaco/cx-core';

export interface AtamaProps {
  data?: CXExperience;
  error?: boolean;
}

export function getServerSidePropsFactory<C>(
  fetcher: Fetcher<C>,
  slug?: string,
) {
  return async function getServerSideProps({
    params = {},
    res,
  }: GetServerSidePropsContext) {
    const identifier =
      slug ||
      (params.slug && Array.isArray(params.slug) ? params.slug.join('/') : '');

    try {
      const data = await fetcher.getData(identifier);

      if (!data) {
        // eslint-disable-next-line no-console
        console.debug(`No data found for slug '${identifier}'`);

        res.statusCode = 404;

        return {
          props: {
            error: true,
          },
        };
      }

      return {
        props: {
          data,
        },
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Could not get data for slug '${identifier}'`, error);

      res.statusCode = 404;

      return {
        props: {
          error: true,
        },
      };
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
      console.debug('No slug passed.');

      return {
        notFound: true,
      };
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

        return {
          notFound: true,
          revalidate,
        };
      }

      return {
        props: {
          data,
        },
        revalidate,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Could not get data for slug '${identifier}'`, error);

      return {
        notFound: true,
        revalidate,
      };
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
    const paths = await fetcher.getAllPaths(config);

    return {
      paths,
      fallback: 'blocking',
    };
  };
}
