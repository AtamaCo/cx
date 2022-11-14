import type { ComponentType, ForwardRefExoticComponent } from 'react';
import type { CXExperience } from '@atamaco/cx-core';

import React, { Fragment } from 'react';

interface AtamaRendererProps<T> {
  layouts: {
    // ToDo: This should be strictly typed with
    // `ForwardRefExoticComponent<RefAttributes<>>`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: ForwardRefExoticComponent<any>;
  };
  components: {
    // ToDo: This should be strictly typed and add `data-atama-id` as prop
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: ComponentType<any>;
  };
  data: CXExperience<T>;
}

export interface AtamaComponentProps {
  'data-atama-id': string;
  'data-atama-placement-id': string;
  'data-atama-component-name': string;
}

export function AtamaRenderer<T>({
  layouts,
  components,
  data,
}: AtamaRendererProps<T>) {
  if (!(data.template in layouts)) {
    throw new Error(`Could not find ${data.template} in layouts`);
  }

  const Layout = layouts[data.template];

  const placementsData = Object.fromEntries(
    data.placements.map((placement) => {
      if (placement.embeddableBlueprint) {
        return [
          placement.code,
          <AtamaRenderer
            layouts={layouts}
            components={components}
            data={placement.embeddableBlueprint}
          />,
        ];
      }

      if (placement.components) {
        return [
          placement.code,
          <Fragment key={placement.code}>
            {placement.components.map(
              (
                {
                  placementId,
                  correlationId,
                  type,
                  contentProperties,
                  visualProperties,
                  componentTypeName,
                },
                index,
              ) => {
                if (!(type in components)) {
                  throw new Error(`Could not find component ${type}`);
                }
                const Component = components[type];
                const atama: AtamaComponentProps = {
                  'data-atama-id': correlationId,
                  'data-atama-placement-id': placementId,
                  'data-atama-component-name': componentTypeName,
                };

                return (
                  <Component
                    key={index}
                    {...contentProperties}
                    {...visualProperties}
                    atama={atama}
                  />
                );
              },
            )}
          </Fragment>,
        ];
      }

      return [];
    }),
  );

  return <Layout {...placementsData} />;
}
