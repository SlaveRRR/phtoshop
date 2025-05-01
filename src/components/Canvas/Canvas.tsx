import { forwardRef, useState } from 'react';
import { Controls } from './components';
import { CanvasComponent, CanvasContainer } from './styled';
import { CanvasProps } from './types';

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({ metadata }, ref) => {
  const [scale, setScale] = useState(1);

  return (
    <>
      {!!Object.keys(metadata).length && <Controls scale={scale} setScale={setScale} />}
      <CanvasContainer>
        <CanvasComponent scale={scale} ref={ref} />
      </CanvasContainer>
    </>
  );
});
