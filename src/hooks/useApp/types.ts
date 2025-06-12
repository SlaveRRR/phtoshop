import { Color } from '@components/ColorInfo/types';
import { Tool } from '@hooks/useTools';
import { InterpolationMethod } from '@utils';
import { UploadProps } from 'antd';
import { Dispatch, RefObject, SetStateAction } from 'react';

export interface AppContext {
  onFileSelect: UploadProps['customRequest'];
  onScaleChange: (value: number) => void;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  scale: number;
  setScale: Dispatch<SetStateAction<number>>;
  autoScaled: boolean;
  setAutoScaled: Dispatch<SetStateAction<boolean>>;
  handleResize: (params: ResizeParams) => void;
  isOpenModal: boolean;
  closeModal: () => void;
  openModal: () => void;
  activeTool: Tool;
  setActiveTool: Dispatch<SetStateAction<Tool>>;
  setPipetteColors: Dispatch<SetStateAction<PipetteColors>>;
  pipetteColors: PipetteColors;
  layers: Layer[];
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  activeLayerId: string;
  setActiveLayerId: Dispatch<SetStateAction<string>>;
  addLayer: (type: 'image' | 'color', data?: ImageData, color?: string) => void;
  moveLayer: (fromIndex: number, toIndex: number) => void;
  toggleLayerVisibility: (id: string) => void;
  deleteLayer: (id: string) => void;
  updateLayerOpacity: (id: string, value: number) => void;
  updateLayerBlendMode: (id: string, value: Layer['blendMode']) => void;
  toggleAlphaChannelVisibility: (id: string) => void;
  deleteAlphaChannel: (id: string) => void;
  applyCurvesCorrection: (correctedData: ImageData) => void;
}

export interface PipetteColors {
  color1: Color;
  color2: Color;
}

export interface ResizeParams {
  width: number;
  height: number;
  method: InterpolationMethod;
}

export interface Point {
  x: number;
  y: number;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
  imageData?: ImageData;
  color?: string;
  format: string;
  colorDepth: number;
  offsetX: number;
  offsetY: number;
  hasAlpha: boolean;
  alphaVisible: boolean;
}

export interface AlphaChannel {
  id: string;
  name: string;
  visible: boolean;
  data: Uint8ClampedArray;
}
