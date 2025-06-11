import { PointerEvent, RefObject, useCallback, useEffect, useRef, useState } from 'react';

const calculateBoundedPosition = (containerRef: RefObject<HTMLDivElement | null>, x: number, y: number) => {
  if (!containerRef.current) return { x: 0, y: 0 };

  const canvasWidth = containerRef.current.offsetWidth;
  const canvasHeight = containerRef.current.offsetHeight;

  const minX = -canvasWidth * 0.75;
  const minY = -canvasHeight * 0.75;
  const maxX = window.innerWidth - canvasWidth * 0.25;
  const maxY = window.innerHeight - canvasHeight * 0.25;

  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY),
  };
};

const MOVE_STEP = 20;

export const useDraggable = (activeLayerId?: string, updateLayerOffset?: () => void) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState({
    position: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    isDragging: false,
    initialClick: true,
  });

  const { isDragging, offset, position, initialClick } = state;

  const applyCanvasStyles = (x: number = position.x, y: number = position.y, isKeyBoard = false) => {
    if (!containerRef.current) return;

    containerRef.current.style.position = 'absolute';
    containerRef.current.style.left = `${x}px`;
    containerRef.current.style.top = `${y}px`;
    if (!isKeyBoard) {
      containerRef.current.style.cursor = 'grabbing';
    }
    containerRef.current.style.userSelect = 'none';
    containerRef.current.style.touchAction = 'none';
  };

  const resetCanvasStyles = () => {
    if (!containerRef.current) return;

    containerRef.current.style.cursor = '';
    containerRef.current.style.userSelect = '';
    containerRef.current.style.touchAction = '';
  };

  const onPointerDown = (pointerEvent: PointerEvent<HTMLDivElement>) => {
    if (pointerEvent.button !== 0 || !containerRef.current) return;

    const { pageX, pageY } = pointerEvent;

    const rect = containerRef.current.getBoundingClientRect();

    // Для первого клика устанавливаем offset относительно текущей позиции элемента
    const offsetX = initialClick ? pageX - rect.left : pageX - position.x;
    const offsetY = initialClick ? pageY - rect.top : pageY - position.y;

    pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId);

    setState((prevState) => ({
      ...prevState,
      isDragging: true,
      offset: {
        ...prevState.offset,
        x: offsetX,
        y: offsetY,
      },
      initialClick: false, // Сбрасываем флаг после первого клика
      position: initialClick ? { ...prevState.position, x: rect.left, y: rect.top } : prevState.position,
    }));

    applyCanvasStyles();
  };

  const onPointerMove = (pointerEvent: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const { pageX, pageY } = pointerEvent;

    const newX = pageX - offset.x;
    const newY = pageY - offset.y;

    const boundedPos = calculateBoundedPosition(containerRef, newX, newY);

    updateLayerOffset?.(activeLayerId, boundedPos.x, boundedPos.y);

    applyCanvasStyles(boundedPos.x, boundedPos.y);

    setState((prevState) => ({
      ...prevState,
      position: boundedPos,
    }));
  };

  const onPointerUp = (pointerEvent: PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    resetCanvasStyles();
    pointerEvent.currentTarget.releasePointerCapture(pointerEvent.pointerId);

    setState((prevState) => ({
      ...prevState,
      isDragging: false,
    }));
  };

  const moveCanvas = useCallback(
    (dx: number, dy: number) => {
      if (!containerRef.current) return;
      const newPos = calculateBoundedPosition(containerRef, position.x + dx, position.y + dy);
      applyCanvasStyles(newPos.x, newPos.y, true);
      setState((prevState) => ({
        ...prevState,
        position: newPos,
        initialClick: false,
      }));
    },
    [position, calculateBoundedPosition],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!containerRef.current) return;

      switch (e.key) {
        case 'ArrowLeft':
          moveCanvas(-MOVE_STEP, 0);
          break;
        case 'ArrowRight':
          moveCanvas(MOVE_STEP, 0);
          break;
        case 'ArrowUp':
          moveCanvas(0, -MOVE_STEP);
          break;
        case 'ArrowDown':
          moveCanvas(0, MOVE_STEP);
          break;
      }
    },
    [moveCanvas],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { onPointerDown, onPointerMove, onPointerUp, containerRef };
};
