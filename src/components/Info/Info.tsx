import { ColorInfo } from '@components/ColorInfo';
import { ImageInfo } from '@components/ImageInfo';
import { useApp } from '@hooks';

export const Info = () => {
  const { metadata, activeTool, pipetteColors } = useApp();

  const isImageReady = !!Object.keys(metadata).length;

  if (!isImageReady) {
    return null;
  }

  return (
    <>
      <ImageInfo metadata={metadata} />
      {activeTool === 'pippete' && <ColorInfo pipetteColors={pipetteColors} />}
    </>
  );
};
