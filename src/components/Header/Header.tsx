import { Button, Select, Space } from 'antd';
import { Uploader } from './components';
import { Controls, StyledHeader, Title } from './styled';

interface HeaderProps {
  scale: number;
  onScaleChange: (value: number) => void;
  onResizeClick: () => void;
}

const scaleOptions = [
  { value: 12, label: '12%' },
  { value: 25, label: '25%' },
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  { value: 100, label: '100%' },
  { value: 150, label: '150%' },
  { value: 200, label: '200%' },
  { value: 300, label: '300%' },
];

export const Header: React.FC<HeaderProps> = ({ scale, onScaleChange, onResizeClick }) => {
  return (
    <StyledHeader>
      <Space>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Imagix
        </Title>
        <Uploader />
      </Space>
      <Controls>
        <Space align="center">
          <Button type="primary" onClick={onResizeClick}>
            Изменить размер
          </Button>
          <span style={{ color: 'white' }}>Масштаб:</span>
          <Select value={scale} onChange={onScaleChange} style={{ width: 120 }} options={scaleOptions} />
        </Space>
      </Controls>
    </StyledHeader>
  );
};
