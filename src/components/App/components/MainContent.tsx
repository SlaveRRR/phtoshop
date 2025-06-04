import { FC } from 'react';
import { Canvas } from '@components/Canvas';
import { useApp } from '@hooks/useApp';
import { useLayers } from '@hooks/useLayers';
import { blendColors } from '@utils/blendModes';
import { Layer } from '@types';

export const MainContent: FC = () => {
  const { metadata } = useApp();
  const { layers } = useLayers();

  // Функция для композиции слоев
  const composeLayers = () => {
    if (layers.length === 0) return metadata.imageData || null;
    if (layers.length === 1) return layers[0].imageData;

    const visibleLayers = layers.filter((layer: Layer) => layer.visible);
    if (visibleLayers.length === 0) return metadata.imageData || null;

    let result = visibleLayers[0].imageData;
    for (let i = 1; i < visibleLayers.length; i++) {
      const layer = visibleLayers[i];
      result = blendColors(result, layer.imageData, layer.blendMode, layer.opacity);
    }

    return result;
  };

  return (
    <div style={{ position: 'relative' }}>
      <Canvas imageData={metadata.imageData || composeLayers()} />
    </div>
  );
}; 