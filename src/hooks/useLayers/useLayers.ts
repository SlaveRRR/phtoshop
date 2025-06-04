import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Layer, BlendMode } from '@types';

export const useLayers = () => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

  const addLayer = useCallback((imageData: ImageData, name: string = 'Новый слой') => {
    const newLayer: Layer = {
      id: uuidv4(),
      name,
      imageData,
      visible: true,
      opacity: 1,
      blendMode: 'normal' as BlendMode,
      preview: null
    };

    setLayers(prevLayers => [...prevLayers, newLayer]);
    setActiveLayerId(newLayer.id);
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== id));
    if (activeLayerId === id) {
      setActiveLayerId(null);
    }
  }, [activeLayerId]);

  const toggleLayerVisibility = useCallback((id: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  }, []);

  const setLayerOpacity = useCallback((id: string, opacity: number) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === id ? { ...layer, opacity } : layer
      )
    );
  }, []);

  const setLayerBlendMode = useCallback((id: string, blendMode: BlendMode) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === id ? { ...layer, blendMode } : layer
      )
    );
  }, []);

  const setActiveLayer = useCallback((id: string) => {
    setActiveLayerId(id);
  }, []);

  const moveLayer = useCallback((fromIndex: number, toIndex: number) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      const [movedLayer] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, movedLayer);
      return newLayers;
    });
  }, []);

  const updateLayerPreview = useCallback((id: string, previewUrl: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === id ? { ...layer, preview: previewUrl } : layer
      )
    );
  }, []);

  return {
    layers,
    activeLayerId,
    addLayer,
    removeLayer,
    toggleLayerVisibility,
    setLayerOpacity,
    setLayerBlendMode,
    setActiveLayer,
    moveLayer,
    updateLayerPreview,
  };
}; 