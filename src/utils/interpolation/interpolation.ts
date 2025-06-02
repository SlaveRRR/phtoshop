import { RGBAColor } from './types';

export function getPixelColor(imageData: ImageData, x: number, y: number): RGBAColor {
  const index = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3],
  };
}

export function setPixelColor(imageData: ImageData, x: number, y: number, color: RGBAColor): void {
  const index = (y * imageData.width + x) * 4;
  imageData.data[index] = color.r;
  imageData.data[index + 1] = color.g;
  imageData.data[index + 2] = color.b;
  imageData.data[index + 3] = color.a;
}

export function nearestNeighborInterpolation(
  sourceData: ImageData,
  targetWidth: number,
  targetHeight: number,
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;
  const targetData = ctx.createImageData(targetWidth, targetHeight);

  const scaleX = sourceData.width / targetWidth;
  const scaleY = sourceData.height / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const srcX = Math.min(Math.floor(x * scaleX), sourceData.width - 1);
      const srcY = Math.min(Math.floor(y * scaleY), sourceData.height - 1);
      const color = getPixelColor(sourceData, srcX, srcY);
      setPixelColor(targetData, x, y, color);
    }
  }

  return targetData;
}

export function bilinearInterpolation(sourceData: ImageData, targetWidth: number, targetHeight: number): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;
  const targetData = ctx.createImageData(targetWidth, targetHeight);

  const scaleX = sourceData.width / targetWidth;
  const scaleY = sourceData.height / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const srcX = x * scaleX;
      const srcY = y * scaleY;

      const x1 = Math.floor(srcX);
      const y1 = Math.floor(srcY);
      const x2 = Math.min(x1 + 1, sourceData.width - 1);
      const y2 = Math.min(y1 + 1, sourceData.height - 1);

      const xWeight = srcX - x1;
      const yWeight = srcY - y1;

      const topLeft = getPixelColor(sourceData, x1, y1);
      const topRight = getPixelColor(sourceData, x2, y1);
      const bottomLeft = getPixelColor(sourceData, x1, y2);
      const bottomRight = getPixelColor(sourceData, x2, y2);

      const color: RGBAColor = {
        r: Math.round(bilinearValue(topLeft.r, topRight.r, bottomLeft.r, bottomRight.r, xWeight, yWeight)),
        g: Math.round(bilinearValue(topLeft.g, topRight.g, bottomLeft.g, bottomRight.g, xWeight, yWeight)),
        b: Math.round(bilinearValue(topLeft.b, topRight.b, bottomLeft.b, bottomRight.b, xWeight, yWeight)),
        a: Math.round(bilinearValue(topLeft.a, topRight.a, bottomLeft.a, bottomRight.a, xWeight, yWeight)),
      };

      setPixelColor(targetData, x, y, color);
    }
  }

  return targetData;
}

function bilinearValue(
  topLeft: number,
  topRight: number,
  bottomLeft: number,
  bottomRight: number,
  xWeight: number,
  yWeight: number,
): number {
  const top = topLeft * (1 - xWeight) + topRight * xWeight;
  const bottom = bottomLeft * (1 - xWeight) + bottomRight * xWeight;
  return top * (1 - yWeight) + bottom * yWeight;
}

export const interpolationDescriptions = {
  nearest:
    'Метод ближайшего соседа - самый быстрый метод, но может создавать пиксельный эффект. Лучше всего подходит для изображений с четкими границами.',
  bilinear:
    'Билинейная интерполяция - обеспечивает более плавный результат за счет усреднения четырех ближайших пикселей. Хорошо подходит для фотографий.',
};
