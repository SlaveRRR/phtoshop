import { useApp } from '@hooks';
import { bilinearInterpolation, nearestNeighborInterpolation } from '@utils';
import { FC, useEffect } from 'react';
import { ResizeModal } from './ResizeModal';
import { CanvasContainer, Container, StyledCanvas, ImageInfo } from './styled';
import { ResizeParams } from './types';

interface ImageEditorProps {
  scale: number;
  onScaleChange: (value: number) => void;
  isResizeModalOpen: boolean;
  onResizeModalClose: () => void;
}

export const ImageEditor: FC<ImageEditorProps> = ({ 
  scale, 
  isResizeModalOpen,
  onResizeModalClose 
}) => {
  const { canvasRef, metadata, setMetadata } = useApp();

  const drawImage = () => {
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
    const imageArray = new Uint8ClampedArray(metadata.imageData);
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

    // Отрисовываем масштабированное изображение
    ctx.drawImage(tempCanvas, 0, 0, scaledWidth, scaledHeight);

    // Очищаем временный canvas
    tempCanvas.width = 1;
    tempCanvas.height = 1;
  };

  const handleResize = ({ width, height, method }: ResizeParams) => {
    if (!metadata.imageData) return;

    const sourceData = new ImageData(
      new Uint8ClampedArray(metadata.imageData),
      metadata.width,
      metadata.height
    );

    const resizedData = method === 'nearest'
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
  }, [scale, metadata]);

  return (
    <Container>
      <CanvasContainer>
        <StyledCanvas ref={canvasRef} />
        {metadata.width && metadata.height && (
          <ImageInfo>
            Формат: {metadata.format || 'GrayBit-7'}, 
            Ширина: {metadata.width}px, 
            Высота: {metadata.height}px, 
            Маска: {metadata.hasMask ? 'да' : 'нет'}, 
            Глубина цвета: {metadata.format === 'GB7' ? '7 бит' : '8 бит'}
          </ImageInfo>
        )}
      </CanvasContainer>

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
