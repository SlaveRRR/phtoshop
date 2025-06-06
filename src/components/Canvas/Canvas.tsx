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
  const centerPointRef = useRef({ x: 0, y: 0 });

  const { containerRef, onPointerDown, onPointerMove, onPointerUp } = useDraggable();

  const updateCanvas = useCallback(async () => {
    if (!canvasRef.current || !imageData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const containerWidth = window.innerWidth - 100;
    const containerHeight = window.innerHeight - 100;

    const { scaleF, dstWidth, dstHeight, offsetX, offsetY } = computeRenderParams(
      imageData.width,
      imageData.height,
      containerWidth,
      containerHeight,
      autoScaled ? null : scale,
    );

    canvas.width = Math.max(containerWidth, dstWidth);
    canvas.height = Math.max(containerHeight, dstHeight);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setScale(Math.round(scaleF * 100));
    if (autoScaled) setAutoScaled(false);

    let newOffsetX = offsetX;
    let newOffsetY = offsetY;

    if (centerPointRef.current.x !== 0 || centerPointRef.current.y !== 0) {
      const prevScale = scale / 100;
      const newScale = scaleF;
      const scaleRatio = newScale / prevScale;

      newOffsetX = centerPointRef.current.x - (centerPointRef.current.x - offsetRef.current.x) * scaleRatio;
      newOffsetY = centerPointRef.current.y - (centerPointRef.current.y - offsetRef.current.y) * scaleRatio;
    } else {
      centerPointRef.current = {
        x: containerWidth / 2,
        y: containerHeight / 2,
      };
      newOffsetX = offsetX;
      newOffsetY = offsetY;
    }

    offsetRef.current = { x: newOffsetX, y: newOffsetY };

    const newData = new Uint8ClampedArray(imageData.data.length);
    for (let i = 0; i < imageData.data.length; i += 4) {
      newData[i] = imageData.data[i];
      newData[i + 1] = imageData.data[i + 1];
      newData[i + 2] = imageData.data[i + 2];
      newData[i + 3] = 255;
    }
    const renderImageData = new ImageData(newData, imageData.width, imageData.height);

    drawImage(ctx, renderImageData, offsetRef.current.x, offsetRef.current.y, 1, scaleF);
  }, [autoScaled, scale, setScale, setAutoScaled, imageData]);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (activeTool === 'hand') {
      onPointerDown(e);
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    e.stopPropagation();
    const { clientX, clientY } = e;

    const rect = canvas.getBoundingClientRect();
    const scaleFactor = scale / 100;

    const color = getColorFromPoint(
      { width: canvas.width, height: canvas.height },
      { left: rect.left, top: rect.top },
      imageData,
      { x: clientX, y: clientY },
      scaleFactor,
      offsetRef.current, // Передаем смещение
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
