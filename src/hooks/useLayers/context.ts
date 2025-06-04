import { createContext } from 'react';
import { Layer, LayerState, BlendMode } from '@types';

export interface LayersContext {
  layers: Layer[];
  activeLayerId: string | null;
  addLayer: (imageData: ImageData, name?: string) => void;
  removeLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  setLayerBlendMode: (id: string, mode: BlendMode) => void;
  setActiveLayer: (id: string) => void;
  moveLayer: (fromIndex: number, toIndex: number) => void;
  updateLayerPreview: (id: string, previewUrl: string) => void;
}

export const layersContext = createContext<LayersContext>({} as LayersContext);

export const { Provider: LayersProvider } = layersContext; 