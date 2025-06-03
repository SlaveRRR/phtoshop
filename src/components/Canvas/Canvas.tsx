import { ImageInfo } from '@components/ImageInfo';
import { useApp } from '@hooks';
import { computeRenderParams, drawImage } from '@utils';
import { useCallback, useEffect, useRef } from 'react';

import { ResizeModal } from '@components/ResizeModal';
import { CanvasComponent, CanvasContainer } from './styled';

export const Canvas = () => {
  const { metadata, canvasRef, scale, autoScaled, setScale, setAutoScaled } = useApp();

  const { imageData } = metadata;

  const isImageReady = !!Object.keys(metadata).length;

  const offsetRef = useRef({ x: 0, y: 0 });

  const updateCanvas = useCallback(async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const canvasSize = { width: canvasRef.current?.width, height: canvasRef.current?.height };
    if (!canvas || !ctx || !canvasSize) return;

    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    if (canvas.width !== containerWidth || canvas.height !== containerHeight) {
      canvas.width = containerWidth;
      canvas.height = containerHeight;
    }

    ctx.clearRect(0, 0, containerWidth, containerHeight);

    const { scaleF, offsetX, offsetY } = computeRenderParams(
      canvasSize.width,
      canvasSize.height,
      containerWidth,
      containerHeight,
      autoScaled ? scale : null,
    );

    setScale(Math.floor(scaleF * 100));
    setAutoScaled(true);

    if (offsetRef.current.x === 0 && offsetRef.current.y === 0) {
      offsetRef.current = { x: offsetX, y: offsetY };
    }
    if (!imageData) return;

    const newData = new Uint8ClampedArray(imageData.data.length);
    for (let i = 0; i < imageData.data.length; i += 4) {
      newData[i] = imageData.data[i];
      newData[i + 1] = imageData.data[i + 1];
      newData[i + 2] = imageData.data[i + 2];
      newData[i + 3] = 255;
    }
    const renderImageData = new ImageData(newData, imageData.width, imageData.height);

    drawImage(
      ctx,
      renderImageData,
      offsetRef.current.x,
      offsetRef.current.y,
      1,
      // canvasBlendMode,
      scale / 100,
    );
  }, [autoScaled, scale, setScale, setAutoScaled, imageData]);

  useEffect(() => {
    if (isImageReady) {
      updateCanvas();
    }
  }, [scale, isImageReady, updateCanvas]);

  return (
    <>
      {isImageReady && <ResizeModal />}
      {/* {!!Object.keys(metadata).length && <Controls scale={scale} setScale={setScale} />} */}
      <CanvasContainer>
        <CanvasComponent ref={canvasRef} />
        {isImageReady && <ImageInfo metadata={metadata} />}
      </CanvasContainer>
    </>
  );
};
