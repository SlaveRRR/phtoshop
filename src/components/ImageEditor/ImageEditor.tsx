import { EyeOutlined } from '@ant-design/icons';
import { useApp } from '@hooks';
import { bilinearInterpolation, calculateContrast, getColorFromPoint, nearestNeighborInterpolation } from '@utils';
import { Button, Card, Space, Tooltip } from 'antd';
import { FC, KeyboardEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { FaHandPaper } from 'react-icons/fa';
import styled from 'styled-components';

import { ResizeModal } from './ResizeModal';
import {
  ColorInfo,
  ColorLabel,
  ColorPanel,
  ColorRow,
  ColorSwatch,
  ColorValue,
  Container,
  ImageInfo,
  ToolsPanel,
} from './styled';
import { Color, COLOR_SPACES, ResizeParams, Tool } from './types';

interface ImageEditorProps {
  scale: number;
  isResizeModalOpen: boolean;
  onResizeModalClose: () => void;
}

const EditorCanvas = styled.canvas`
  image-rendering: pixelated;
  background: transparent;
`;

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ImageEditor: FC<ImageEditorProps> = ({ scale, isResizeModalOpen, onResizeModalClose }) => {
  const { canvasRef, metadata, setMetadata } = useApp();
  const [activeTool, setActiveTool] = useState<Tool>('hand');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [color1, setColor1] = useState<Color | null>(null);
  const [color2, setColor2] = useState<Color | null>(null);

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'hand') {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left - offset.x,
        y: e.clientY - rect.top - offset.y,
      });
    } else if (activeTool === 'eyedropper') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scaleFactor = scale / 100;
      const color = getColorFromPoint(ctx, { x, y }, scaleFactor);
      if (color) {
        if (e.altKey || e.ctrlKey || e.shiftKey) {
          setColor2(color);
        } else {
          setColor1(color);
        }
      }
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'hand' && isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragStart.x;
      const newY = e.clientY - rect.top - dragStart.y;

      const scaleFactor = scale / 100;
      const scaledWidth = Math.round(metadata.width * scaleFactor);
      const scaledHeight = Math.round(metadata.height * scaleFactor);

      const maxOffsetX = Math.max(0, scaledWidth - rect.width);
      const maxOffsetY = Math.max(0, scaledHeight - rect.height);

      setOffset({
        x: Math.max(-maxOffsetX, Math.min(newX, 0)),
        y: Math.max(-maxOffsetY, Math.min(newY, 0)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (activeTool === 'hand') {
      const step = 10;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const containerRect = canvas.parentElement?.getBoundingClientRect();
      if (!containerRect) return;

      const scaleFactor = scale / 100;
      const scaledWidth = Math.round(metadata.width * scaleFactor);
      const scaledHeight = Math.round(metadata.height * scaleFactor);

      const maxOffsetX = Math.max(0, scaledWidth - containerRect.width);
      const maxOffsetY = Math.max(0, scaledHeight - containerRect.height);

      switch (e.key) {
        case 'ArrowLeft':
          setOffset((prev) => ({
            ...prev,
            x: Math.max(-maxOffsetX, Math.min(prev.x - step, 0)),
          }));
          break;
        case 'ArrowRight':
          setOffset((prev) => ({
            ...prev,
            x: Math.max(-maxOffsetX, Math.min(prev.x + step, 0)),
          }));
          break;
        case 'ArrowUp':
          setOffset((prev) => ({
            ...prev,
            y: Math.max(-maxOffsetY, Math.min(prev.y - step, 0)),
          }));
          break;
        case 'ArrowDown':
          setOffset((prev) => ({
            ...prev,
            y: Math.max(-maxOffsetY, Math.min(prev.y + step, 0)),
          }));
          break;
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'h') {
        setActiveTool('hand');
      } else if (e.key === 'e') {
        setActiveTool('eyedropper');
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  const drawImage = useCallback(() => {
    if (!canvasRef.current || !metadata.imageData || !metadata.width || !metadata.height) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Вычисляем размеры с учетом масштаба
    const scaleFactor = scale / 100;
    const scaledWidth = Math.round(metadata.width * scaleFactor);
    const scaledHeight = Math.round(metadata.height * scaleFactor);

    // Устанавливаем размеры canvas
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Очищаем canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Создаем ImageData из сохраненных данных
    const imageArray = new Uint8ClampedArray(metadata.imageData.length);
    for (let i = 0; i < metadata.imageData.length; i++) {
      // Для GB7 преобразуем значения из диапазона 0-127 в 0-255
      if (metadata.format === 'GB7') {
        imageArray[i] = Math.round((metadata.imageData[i] / 127) * 255);
      } else {
        imageArray[i] = metadata.imageData[i];
      }
    }
    const imageData = new ImageData(imageArray, metadata.width, metadata.height);

    // Создаем временный canvas для исходного изображения
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = metadata.width;
    tempCanvas.height = metadata.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Отрисовываем исходное изображение на временный canvas
    tempCtx.putImageData(imageData, 0, 0);

    // Включаем сглаживание
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Получаем размеры контейнера
    const containerRect = canvas.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    // Вычисляем максимальные значения смещения
    const maxOffsetX = Math.max(0, scaledWidth - containerRect.width);
    const maxOffsetY = Math.max(0, scaledHeight - containerRect.height);

    // Ограничиваем смещение
    const limitedOffset = {
      x: Math.max(-maxOffsetX, Math.min(offset.x, 0)),
      y: Math.max(-maxOffsetY, Math.min(offset.y, 0)),
    };

    // Отрисовываем масштабированное изображение с учетом смещения
    ctx.drawImage(tempCanvas, limitedOffset.x, limitedOffset.y, scaledWidth, scaledHeight);

    // Очищаем временный canvas
    tempCanvas.width = 1;
    tempCanvas.height = 1;
  }, [scale, metadata, offset]);

  const handleResize = ({ width, height, method }: ResizeParams) => {
    if (!metadata.imageData) return;

    const sourceData = new ImageData(new Uint8ClampedArray(metadata.imageData), metadata.width, metadata.height);

    const resizedData =
      method === 'nearest'
        ? nearestNeighborInterpolation(sourceData, width, height)
        : bilinearInterpolation(sourceData, width, height);

    setMetadata({
      ...metadata,
      width,
      height,
      imageData: Array.from(resizedData.data),
    });
  };

  useEffect(() => {
    if (metadata.imageData) {
      drawImage();
    }
  }, [scale, metadata, offset, drawImage]);

  const contrast = color1 && color2 ? calculateContrast(color1, color2) : null;

  return (
    <Container>
      <EditorContainer>
        <EditorCanvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ cursor: activeTool === 'hand' ? 'grab' : 'crosshair' }}
        />

        <ToolsPanel>
          <Tooltip title="Рука (H)" placement="right">
            <Button
              type={activeTool === 'hand' ? 'primary' : 'default'}
              icon={<FaHandPaper />}
              onClick={() => handleToolChange('hand')}
            />
          </Tooltip>
          <Tooltip title="Пипетка (E)" placement="right">
            <Button
              type={activeTool === 'eyedropper' ? 'primary' : 'default'}
              icon={<EyeOutlined />}
              onClick={() => handleToolChange('eyedropper')}
            />
          </Tooltip>
        </ToolsPanel>

        {activeTool === 'eyedropper' && (
          <ColorPanel title="Информация о цвете">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {color1 || color2 ? (
                <>
                  {color1 && (
                    <Card size="small" title="Цвет 1">
                      <ColorRow>
                        <ColorSwatch color={`rgb(${color1.rgb.r}, ${color1.rgb.g}, ${color1.rgb.b})`} />
                        <ColorInfo>
                          <div>
                            X: {color1.position.x}, Y: {color1.position.y}
                          </div>
                          {Object.entries(COLOR_SPACES).map(([space, info]) => (
                            <Tooltip
                              key={space}
                              title={
                                <div>
                                  <div>{info.description}</div>
                                  <br />
                                  {Object.entries(info.axes).map(([axis, data]) => (
                                    <div key={axis}>
                                      <strong>{data.name}</strong>: {data.description}
                                      <br />
                                      Диапазон: {data.range}
                                    </div>
                                  ))}
                                </div>
                              }
                            >
                              <div>
                                <ColorLabel>{info.name}:</ColorLabel>
                                <ColorValue>
                                  {Object.entries(color1[space as keyof Color])
                                    .map(([key, value]) => `${key}: ${value.toFixed(2)}`)
                                    .join(', ')}
                                </ColorValue>
                              </div>
                            </Tooltip>
                          ))}
                        </ColorInfo>
                      </ColorRow>
                    </Card>
                  )}

                  {color2 && (
                    <Card size="small" title="Цвет 2">
                      <ColorRow>
                        <ColorSwatch color={`rgb(${color2.rgb.r}, ${color2.rgb.g}, ${color2.rgb.b})`} />
                        <ColorInfo>
                          <div>
                            X: {color2.position.x}, Y: {color2.position.y}
                          </div>
                          {Object.entries(COLOR_SPACES).map(([space, info]) => (
                            <Tooltip
                              key={space}
                              title={
                                <div>
                                  <div>{info.description}</div>
                                  <br />
                                  {Object.entries(info.axes).map(([axis, data]) => (
                                    <div key={axis}>
                                      <strong>{data.name}</strong>: {data.description}
                                      <br />
                                      Диапазон: {data.range}
                                    </div>
                                  ))}
                                </div>
                              }
                            >
                              <div>
                                <ColorLabel>{info.name}:</ColorLabel>
                                <ColorValue>
                                  {Object.entries(color2[space as keyof Color])
                                    .map(([key, value]) => `${key}: ${value.toFixed(2)}`)
                                    .join(', ')}
                                </ColorValue>
                              </div>
                            </Tooltip>
                          ))}
                        </ColorInfo>
                      </ColorRow>
                    </Card>
                  )}

                  {color1 && color2 && (
                    <div>
                      <strong>Контраст: </strong>
                      <span style={{ color: contrast && contrast < 4.5 ? '#ff4d4f' : '#52c41a' }}>
                        {contrast?.toFixed(2)}:1
                        {contrast && contrast < 4.5 && ' (недостаточный)'}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  Выберите цвет, кликнув по изображению. Для выбора второго цвета используйте Alt, Ctrl или Shift.
                </div>
              )}
            </Space>
          </ColorPanel>
        )}

        {metadata.width && metadata.height && (
          <ImageInfo>
            Формат: {metadata.format || 'GrayBit-7'}, Ширина: {metadata.width}px, Высота: {metadata.height}px, Маска:{' '}
            {metadata.hasMask ? 'да' : 'нет'}, Глубина цвета: {metadata.format === 'GB7' ? '7 бит' : '8 бит'}
          </ImageInfo>
        )}
      </EditorContainer>

      {metadata.width && metadata.height && (
        <ResizeModal
          isOpen={isResizeModalOpen}
          onClose={onResizeModalClose}
          originalWidth={metadata.width}
          originalHeight={metadata.height}
          onResize={handleResize}
        />
      )}
    </Container>
  );
};
