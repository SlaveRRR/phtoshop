import { ColorInfo } from '@components/ColorInfo';
import { ImageInfo } from '@components/ImageInfo';
import { useApp } from '@hooks';

export const Info = () => {
  const { activeTool, layers, activeLayerId, pipetteColors } = useApp();

  const activeLayer = layers[layers.findIndex((layer) => layer.id === activeLayerId)];

  const isImageReady = activeLayer && !!Object.keys(activeLayer).length;

  if (!isImageReady) {
    return null;
  }

  return (
    <>
      <ImageInfo layer={activeLayer} />
      {activeTool === 'pippete' && <ColorInfo pipetteColors={pipetteColors} />}
    </>
  );
};
