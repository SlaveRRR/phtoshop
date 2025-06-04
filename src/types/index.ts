export * from './image';
export * from './layers';

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  imageData: ImageData;
  preview: string;
  isAlphaChannel: boolean;
}

export interface LayerState {
  layers: Layer[];
  activeLayerId: string | null;
}

export const BLEND_MODE_DESCRIPTIONS = {
  normal: 'Обычный режим. Верхний слой просто накладывается на нижний',
  multiply: 'Умножение цветов слоев. Делает изображение темнее',
  screen: 'Осветляет изображение. Противоположность режиму умножения',
  overlay: 'Сохраняет тени и света нижнего слоя, смешивая их с цветами верхнего',
};
