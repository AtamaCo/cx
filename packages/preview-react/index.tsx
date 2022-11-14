import type { ComponentProps } from 'react';
import type { AtamaRenderer } from '@atamaco/renderer-react';
import type { CXPlacement } from '@atamaco/cx-core';

import { Preview } from '@atamaco/preview';
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useRef, useEffect, useState } from 'react';

type AtamaPreviewProps = Pick<
  ComponentProps<typeof AtamaRenderer>,
  'layouts' | 'components'
> & {
  Renderer: typeof AtamaRenderer;
  allowedOrigin: string;
};

function AtamaPreview({
  Renderer,
  layouts,
  components,
  allowedOrigin,
}: AtamaPreviewProps) {
  const preview = useRef<Preview<{}>>();
  const [wrapper, setWrapper] = useState<HTMLDivElement>();
  const [internalPlacements, setInternalPlacements] = useState<
    CXPlacement<{}>[]
  >([]);
  const [internalLayout, setInternalLayout] = useState('');

  useEffect(() => {
    if (wrapper) {
      preview.current = new Preview(
        wrapper,
        {
          onDataUpdate: (placements: CXPlacement<{}>[], layout: string) => {
            setInternalPlacements(placements);
            setInternalLayout(layout);
          },
        },
        allowedOrigin,
      );
    }

    return () => {
      if (preview.current) {
        preview.current.destroy();
      }
    };
  }, [wrapper]);

  return (
    <div ref={(el) => el && setWrapper(el)}>
      {internalLayout !== '' && (
        <Renderer
          layouts={layouts}
          components={components}
          data={{
            meta: {},
            template: internalLayout,
            placements: internalPlacements,
          }}
        />
      )}
    </div>
  );
}

export function withPreview(
  Renderer: typeof AtamaRenderer,
  allowedOrigin: string,
) {
  return ({
    layouts,
    components,
  }: Pick<ComponentProps<typeof AtamaRenderer>, 'layouts' | 'components'>) => (
    <AtamaPreview
      Renderer={Renderer}
      layouts={layouts}
      components={components}
      allowedOrigin={allowedOrigin}
    />
  );
}
