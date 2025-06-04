import { ImageData } from 'canvas';

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay';

export const BLEND_MODE_DESCRIPTIONS: Record<BlendMode, string> = {
  normal: 'Обычный режим без смешивания',
  multiply: 'Умножение цветов слоев',
  screen: 'Осветление через умножение инвертированных цветов',
  overlay: 'Наложение с сохранением теней и светов',
};

export interface Layer {
  id: string;
  name: string;
  imageData: ImageData;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  preview: string | null;
}

export interface LayerState {
  layers: Layer[];
  activeLayerId: string | null;
} 