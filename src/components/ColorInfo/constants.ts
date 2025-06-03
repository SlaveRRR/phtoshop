import { ColorSpaceInfo } from './types';

export const COLOR_SPACES: Record<string, ColorSpaceInfo> = {
  rgb: {
    name: 'RGB',
    description: 'Аддитивная цветовая модель, описывающая способ кодирования цвета для цветовоспроизведения',
    axes: {
      r: {
        name: 'Red',
        description: 'Красный компонент',
        range: '0-255',
      },
      g: {
        name: 'Green',
        description: 'Зеленый компонент',
        range: '0-255',
      },
      b: {
        name: 'Blue',
        description: 'Синий компонент',
        range: '0-255',
      },
    },
  },
  xyz: {
    name: 'XYZ',
    description: 'Цветовое пространство, основанное на восприятии цветов человеческим глазом',
    axes: {
      x: {
        name: 'X',
        description: 'Условный красный',
        range: '0-95.047',
      },
      y: {
        name: 'Y',
        description: 'Яркость',
        range: '0-100',
      },
      z: {
        name: 'Z',
        description: 'Условный синий',
        range: '0-108.883',
      },
    },
  },
  lab: {
    name: 'Lab',
    description: 'Цветовое пространство, разработанное для получения перцепционной равномерности',
    axes: {
      l: {
        name: 'Lightness',
        description: 'Светлота',
        range: '0-100',
      },
      a: {
        name: 'a',
        description: 'Зелено-красная ось',
        range: '-128 до +127',
      },
      b: {
        name: 'b',
        description: 'Сине-желтая ось',
        range: '-128 до +127',
      },
    },
  },
  oklch: {
    name: 'OKLch',
    description: 'Перцепционно равномерное цветовое пространство, основанное на CIELAB',
    axes: {
      l: {
        name: 'Lightness',
        description: 'Светлота',
        range: '0-1',
      },
      c: {
        name: 'Chroma',
        description: 'Насыщенность',
        range: '0-0.4',
      },
      h: {
        name: 'Hue',
        description: 'Цветовой тон',
        range: '0-360',
      },
    },
  },
};
