import { Space } from 'antd';
import { FC } from 'react';
import { StatusBar, Text } from './styled';
import { ImageInfoProps } from './types';

export const ImageInfo: FC<ImageInfoProps> = ({ metadata }) => {
  return (
    <StatusBar>
      {!!Object.keys(metadata).length ? (
        <Space wrap>
          <Text>Width: {metadata.width}px</Text>
          <Text>Height: {metadata.height}px</Text>
          <Text>Color Depth: {metadata.colorDepth}-bit</Text>
          <Text>Format: {metadata.format}</Text>
          {metadata.hasMask !== undefined && <Text>Mask: {metadata.hasMask ? 'Yes' : 'No'}</Text>}
        </Space>
      ) : (
        <Text>No image loaded</Text>
      )}
    </StatusBar>
  );
};
