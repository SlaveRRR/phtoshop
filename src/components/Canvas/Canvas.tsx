import { useApp } from '@hooks';
import { computeRenderParams, drawImage, getColorFromPoint } from '@utils';
import { MouseEvent, PointerEvent, useCallback, useEffect, useRef } from 'react';

import { ResizeModal } from '@components/ResizeModal';
import { useDraggable } from '@hooks';
import { CanvasComponent, CanvasContainer, ViewPort } from './styled';

export const Canvas = () => {
  const { metadata, canvasRef, scale, autoScaled, setScale, setAutoScaled, setPipetteColors, activeTool } = useApp();

  const { imageData } = metadata;

  const isImageReady = !!Object.keys(metadata).length;

  const offsetRef = useRef({ x: 0, y: 0 });

  const { containerRef, onPointerDown, onPointerMove, onPointerUp } = useDraggable();

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

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (activeTool === 'hand') {
      onPointerDown(e);
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    e.stopPropagation();
    const { clientX, clientY } = e;

    const rect = canvas.getBoundingClientRect();
    const scaleFactor = scale / 100;

    const color = getColorFromPoint(
      { width: canvas.width, height: canvas.height },
      { left: rect.left, top: rect.top },
      imageData,
      {
        x: clientX,
        y: clientY,
      },
      scaleFactor,
    );
    if (color) {
      if (e.altKey || e.ctrlKey || e.shiftKey) {
        setPipetteColors((prevState) => ({
          ...prevState,
          color2: color,
        }));
      } else {
        setPipetteColors((prevState) => ({
          ...prevState,
          color1: color,
        }));
      }
    }
  };

  useEffect(() => {
    if (isImageReady) {
      updateCanvas();
    }
  }, [scale, isImageReady, updateCanvas]);

  return (
    <>
      {isImageReady && <ResizeModal />}
      <ViewPort>
        <CanvasContainer
          onPointerDown={handlePointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          ref={containerRef}
        >
          <CanvasComponent ref={canvasRef} onMouseDown={handleMouseDown} />
        </CanvasContainer>
      </ViewPort>
    </>
  );
};
