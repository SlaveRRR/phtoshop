import { CorrectionPoint } from './types';

export const calculateHistogram = (imageData: ImageData, channel: 'r' | 'g' | 'b' | 'alpha'): number[] => {
  if (!imageData) return new Array(256).fill(0);

  const histogram = new Array(256).fill(0);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let value: number;
    switch (channel) {
      case 'r':
        value = data[i];
        break;
      case 'g':
        value = data[i + 1];
        break;
      case 'b':
        value = data[i + 2];
        break;
      case 'alpha':
        value = data[i + 3];
        break;
      default:
        value = 0;
    }
    histogram[value]++;
  }

  return histogram;
};

// Функция для создания LUT (Look-Up Table)
export const createLUT = (point1: CorrectionPoint, point2: CorrectionPoint): number[] => {
  const lut = new Array(256);

  // Левая горизонтальная линия (0 до point1.input)
  for (let i = 0; i <= point1.input; i++) {
    lut[i] = point1.output;
  }

  // Диагональная линия между точками
  const slope = (point2.output - point1.output) / (point2.input - point1.input);
  for (let i = point1.input + 1; i < point2.input; i++) {
    lut[i] = Math.round(point1.output + slope * (i - point1.input));
    lut[i] = Math.max(0, Math.min(255, lut[i])); // Ограничиваем значения
  }

  // Правая горизонтальная линия (point2.input до 255)
  for (let i = point2.input; i < 256; i++) {
    lut[i] = point2.output;
  }

  return lut;
};

// Функция применения коррекции
export const applyCurvesCorrection = (imageData: ImageData, lut: number[], isAlphaChannel: boolean): ImageData => {
  const newData = new Uint8ClampedArray(imageData.data);

  for (let i = 0; i < newData.length; i += 4) {
    if (isAlphaChannel) {
      // Коррекция только альфа-канала
      newData[i + 3] = lut[newData[i + 3]];
    } else {
      // Коррекция RGB каналов
      newData[i] = lut[newData[i]]; // R
      newData[i + 1] = lut[newData[i + 1]]; // G
      newData[i + 2] = lut[newData[i + 2]]; // B
    }
  }

  return new ImageData(newData, imageData.width, imageData.height);
};
