import { useState } from 'react';

import { useApp } from '@hooks';

import { Controls } from './components';
import { CanvasComponent, CanvasContainer } from './styled';

export const Canvas = () => {
  const { metadata, canvasRef } = useApp();

  const [scale, setScale] = useState(1);

  return (
    <>
      {!!Object.keys(metadata).length && <Controls scale={scale} setScale={setScale} />}
      <CanvasContainer>
        <CanvasComponent scale={scale} ref={canvasRef} />
      </CanvasContainer>
    </>
  );
};
