import { Space } from 'antd';
import { FC } from 'react';
import { StatusBar, Text } from './styled';
import { ImageInfoProps } from './types';

export const ImageInfo: FC<ImageInfoProps> = ({ layer }) => {
  return (
    <StatusBar>
      {layer && !!Object.keys(layer).length ? (
        <Space wrap>
          <Text>Width: {layer?.imageData?.width}px</Text>
          <Text>Height: {layer?.imageData?.height}px</Text>
          <Text>Color Depth: {layer.colorDepth}-bit</Text>
          <Text>Format: {layer.format}</Text>
          {layer.hasAlpha !== undefined && <Text>Mask: {layer.hasAlpha ? 'Yes' : 'No'}</Text>}
        </Space>
      ) : (
        <Text>No image loaded</Text>
      )}
    </StatusBar>
  );
};
