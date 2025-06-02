import { message } from 'antd';
import { Dispatch, RefObject, SetStateAction } from 'react';

import { ImageMetadata } from '@types';

import { grayBitDecoder } from '../grayBitDecoder';
import { PIXEL_DATA_OFFSET } from './constants';

export const getGrayBitImage = (
  setMetadata: Dispatch<SetStateAction<ImageMetadata>>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  buffer: ArrayBuffer,
) => {
  if (!canvasRef?.current) return;

  try {
    const metadata = grayBitDecoder(buffer);

    const canvas = canvasRef.current;
    canvas.width = metadata.width;
    canvas.height = metadata.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(metadata.width, metadata.height);
    const dataView = new DataView(buffer);

    for (let i = 0; i < metadata.width * metadata.height; i++) {
      const pixelByte = dataView.getUint8(PIXEL_DATA_OFFSET + i);

      // Extract 7-bit grayscale value (bits 0-6)
      const grayValue = pixelByte & 0x7f;

      // Scale to 8-bit (0-255) by multiplying by 2
      const scaledGrayValue = grayValue * 2;

      // извлекаем маску, если есть
      const alpha = metadata.hasMask ? (pixelByte & 0x80 ? 255 : 0) : 255;

      const idx = i * 4;
      imageData.data[idx] = scaledGrayValue; // R
      imageData.data[idx + 1] = scaledGrayValue; // G
      imageData.data[idx + 2] = scaledGrayValue; // B
      imageData.data[idx + 3] = alpha; // A
    }

    ctx.putImageData(imageData, 0, 0);

    setMetadata((prevState) => ({ ...prevState, ...metadata }));
  } catch (error) {
    console.error('Error rendering GrayBit-7 image:', error);
    message.error('Failed to render GrayBit-7 image: ' + (error as Error).message);
  }
};
