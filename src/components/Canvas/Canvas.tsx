import { ResizeModal } from '@components/ResizeModal';
import { useApp, useDraggable } from '@hooks';
import { computeRenderParams, drawImage, getColorFromPoint } from '@utils';
import { MouseEvent, PointerEvent, useCallback, useEffect, useRef } from 'react';
import { CanvasComponent, CanvasContainer, ViewPort } from './styled';

export const Canvas = () => {
  const {
    canvasRef,
    scale,
    autoScaled,
    setScale,
    setAutoScaled,
    setPipetteColors,
    activeTool,

    layers,
    activeLayerId,
  } = useApp();

  const activeLayer = layers[layers.findIndex((layer) => layer.id === activeLayerId)] ?? { imageData: null };

  const { imageData } = activeLayer;

  const isImageReady = !!Object.keys(activeLayer).length;

  const offsetRef = useRef({ x: 0, y: 0 });
  const centerPointRef = useRef({ x: 0, y: 0 });

  const { containerRef, onPointerDown, onPointerMove, onPointerUp } = useDraggable();

  // Обновление холста при изменении слоев
  const updateCanvas = useCallback(() => {
    if (!canvasRef.current || !imageData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const containerWidth = window.innerWidth - 300; // Учитываем ширину панели
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
    }

    offsetRef.current = { x: newOffsetX, y: newOffsetY };

    // Отрисовка слоев
    layers
      .filter((layer) => layer.visible)
      .forEach((layer) => {
        let renderImageData;

        if (layer.imageData) {
          if (layer.hasAlpha && layer.alphaVisible) {
            renderImageData = layer.imageData;
          } else {
            const newData = new Uint8ClampedArray(layer.imageData.data.length);
            for (let i = 0; i < layer.imageData.data.length; i += 4) {
              newData[i] = layer.imageData.data[i];
              newData[i + 1] = layer.imageData.data[i + 1];
              newData[i + 2] = layer.imageData.data[i + 2];
              newData[i + 3] = 255;
            }
            renderImageData = new ImageData(newData, layer.imageData.width, layer.imageData.height);
          }

          const canvasBlendMode = layer.blendMode || 'normal';

          drawImage(ctx, renderImageData, newOffsetX, newOffsetY, layer.opacity / 100, canvasBlendMode, scaleF);
        } else if (layer.color) {
          ctx.fillStyle = layer.color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      });
  }, [autoScaled, scale, setScale, setAutoScaled, imageData, layers, canvasRef]);

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
      offsetRef.current,
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
  }, [isImageReady, layers, updateCanvas]);

  return (
    <>
      {isImageReady && <ResizeModal />}
      <div style={{ display: 'flex' }}>
        <ViewPort style={{ flex: 1 }}>
          <CanvasContainer
            onPointerDown={handlePointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            ref={containerRef}
          >
            <CanvasComponent ref={canvasRef} onMouseDown={handleMouseDown} />
          </CanvasContainer>
        </ViewPort>
      </div>
    </>
  );
};
