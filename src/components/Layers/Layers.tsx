import { LayersPanel } from '@components/LayersPanel';
import { useLayers } from '@hooks/useLayers';

export const Layers = () => {
  const {
    layers,
    activeLayerId,
    addLayer,
    removeLayer,
    toggleLayerVisibility,
    setLayerOpacity,
    setLayerBlendMode,
    setActiveLayer,
    moveLayer,
  } = useLayers();
  return (
    <LayersPanel
      layers={layers}
      activeLayerId={activeLayerId}
      onAddLayer={addLayer}
      onRemoveLayer={removeLayer}
      onToggleVisibility={toggleLayerVisibility}
      onOpacityChange={setLayerOpacity}
      onBlendModeChange={setLayerBlendMode}
      onActiveLayerChange={setActiveLayer}
      onLayerMove={moveLayer}
    />
  );
};
