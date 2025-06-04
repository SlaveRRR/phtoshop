import { BlendMode } from '@types';

// Функция для нормализации значений RGB (0-255) в диапазон 0-1
const normalize = (value: number) => value / 255;

// Функция для денормализации значений из диапазона 0-1 в RGB (0-255)
const denormalize = (value: number) => Math.round(value * 255);

// Функция для смешивания двух цветов в режиме умножения
const multiplyColors = (a: number, b: number): number => {
  return (a * b) / 255;
};

// Функция для смешивания двух цветов в режиме экрана
const screenColors = (a: number, b: number): number => {
  return 255 - ((255 - a) * (255 - b)) / 255;
};

// Функция для смешивания двух цветов в режиме перекрытия
const overlayColors = (a: number, b: number): number => {
  return a < 128
    ? (2 * a * b) / 255
    : 255 - (2 * (255 - a) * (255 - b)) / 255;
};

// Основная функция для смешивания цветов с учетом режима наложения и прозрачности
export const blendColors = (
  bottomLayer: ImageData,
  topLayer: ImageData,
  blendMode: BlendMode,
  opacity: number
): ImageData => {
  const result = new ImageData(
    new Uint8ClampedArray(bottomLayer.data),
    bottomLayer.width,
    bottomLayer.height
  );

  for (let i = 0; i < result.data.length; i += 4) {
    const bottomR = bottomLayer.data[i];
    const bottomG = bottomLayer.data[i + 1];
    const bottomB = bottomLayer.data[i + 2];
    const bottomA = bottomLayer.data[i + 3];

    const topR = topLayer.data[i];
    const topG = topLayer.data[i + 1];
    const topB = topLayer.data[i + 2];
    const topA = (topLayer.data[i + 3] * opacity) / 255;

    let resultR: number;
    let resultG: number;
    let resultB: number;

    switch (blendMode) {
      case 'multiply':
        resultR = multiplyColors(bottomR, topR);
        resultG = multiplyColors(bottomG, topG);
        resultB = multiplyColors(bottomB, topB);
        break;
      case 'screen':
        resultR = screenColors(bottomR, topR);
        resultG = screenColors(bottomG, topG);
        resultB = screenColors(bottomB, topB);
        break;
      case 'overlay':
        resultR = overlayColors(bottomR, topR);
        resultG = overlayColors(bottomG, topG);
        resultB = overlayColors(bottomB, topB);
        break;
      default: // normal
        resultR = topR;
        resultG = topG;
        resultB = topB;
    }

    // Применяем альфа-смешивание
    result.data[i] = Math.round(bottomR * (1 - topA) + resultR * topA);
    result.data[i + 1] = Math.round(bottomG * (1 - topA) + resultG * topA);
    result.data[i + 2] = Math.round(bottomB * (1 - topA) + resultB * topA);
    result.data[i + 3] = Math.round(bottomA);
  }

  return result;
}; 