import { Color, Point } from '@components/ColorInfo/types';

// Преобразование RGB в XYZ
export function rgbToXyz(r: number, g: number, b: number): { x: number; y: number; z: number } {
  // Нормализация RGB значений
  let rr = r / 255;
  let gg = g / 255;
  let bb = b / 255;

  // Применение гамма-коррекции
  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;

  // Матричное преобразование
  const x = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) * 100;
  const y = (rr * 0.2126729 + gg * 0.7151522 + bb * 0.072175) * 100;
  const z = (rr * 0.0193339 + gg * 0.119192 + bb * 0.9503041) * 100;

  return { x, y, z };
}

// Преобразование XYZ в Lab
export function xyzToLab(x: number, y: number, z: number): { l: number; a: number; b: number } {
  // Нормализация относительно D65
  let xx = x / 95.047;
  let yy = y / 100;
  let zz = z / 108.883;

  xx = xx > 0.008856 ? Math.pow(xx, 1 / 3) : 7.787 * xx + 16 / 116;
  yy = yy > 0.008856 ? Math.pow(yy, 1 / 3) : 7.787 * yy + 16 / 116;
  zz = zz > 0.008856 ? Math.pow(zz, 1 / 3) : 7.787 * zz + 16 / 116;

  const l = 116 * yy - 16;
  const a = 500 * (xx - yy);
  const b = 200 * (yy - zz);

  return { l, a, b };
}

// Преобразование Lab в OKLch
export function labToOklch(l: number, a: number, b: number): { l: number; c: number; h: number } {
  // Преобразование Lab в LCH
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;

  // Нормализация угла
  if (h < 0) {
    h += 360;
  }

  // Нормализация значений для OKLch
  return {
    l: l / 100, // Нормализация L до диапазона 0-1
    c: c / 100, // Нормализация C до примерного диапазона 0-0.4
    h,
  };
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface Position {
  left: number;
  top: number;
}

// Получение цвета из точки на canvas
export function getColorFromPoint(
  canvasSize: CanvasSize,
  position: Position,
  imageData: ImageData,
  point: Point,
  scale: number,
): Color | null {
  const { height, width } = canvasSize;
  const { left, top } = position;
  const scaledX = Math.round(point.x / scale);
  const scaledY = Math.round(point.y / scale);

  const sampleX = Math.floor((point.x - left) / scaledX);
  const sampleY = Math.floor((point.y - top) / scaledY);

  try {
    const pixel = imageData.data.slice((sampleY * width + sampleX) * 4, (sampleY * height + sampleX) * 4 + 4);

    const rgb = { r: pixel[0], g: pixel[1], b: pixel[2] };
    const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
    const lab = xyzToLab(xyz.x, xyz.y, xyz.z);
    const oklch = labToOklch(lab.l, lab.a, lab.b);

    return {
      rgb,
      xyz,
      lab,
      oklch,
      position: { x: scaledX, y: scaledY },
    };
  } catch {
    return null;
  }
}

// Расчет контраста по WCAG 2.1
export function calculateContrast(color1: Color, color2: Color): number {
  // Получаем относительную яркость для обоих цветов
  const l1 = 0.2126 * color1.rgb.r + 0.7152 * color1.rgb.g + 0.0722 * color1.rgb.b;
  const l2 = 0.2126 * color2.rgb.r + 0.7152 * color2.rgb.g + 0.0722 * color2.rgb.b;

  // Определяем светлый и темный цвета
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  // Рассчитываем контраст
  return (lighter + 0.05) / (darker + 0.05);
}

// Преобразование GB7 значения (0-127) в стандартный RGB (0-255)
export function gb7ToRgb(value: number): number {
  return Math.round((value / 127) * 255);
}

// Преобразование RGB (0-255) в GB7 (0-127)
export function rgbToGb7(value: number): number {
  return Math.round((value / 255) * 127);
}
