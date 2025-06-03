import { useApp } from '@hooks';
import { Button, Select, Space } from 'antd';
import { Uploader } from './components';
import { scaleOptions } from './constants';
import { Controls, StyledHeader, Title } from './styled';

export const Header = () => {
  const {
    metadata: { imageData },
    onScaleChange,
    scale,
    openModal,
  } = useApp();

  return (
    <StyledHeader>
      <Space>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Imagix
        </Title>
        <Uploader />
      </Space>
      {imageData && (
        <Controls>
          <Space align="center">
            <Button type="primary" onClick={openModal}>
              Изменить размер
            </Button>
            <span style={{ color: 'white' }}>Масштаб:</span>
            <Select value={scale} onChange={onScaleChange} style={{ width: 120 }} options={scaleOptions} />
          </Space>
        </Controls>
      )}
    </StyledHeader>
  );
};
