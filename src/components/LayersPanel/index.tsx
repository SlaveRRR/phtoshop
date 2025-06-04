import { FC } from 'react';
import { Card, List, Button, Slider, Select, Tooltip, Upload } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Layer, BLEND_MODE_DESCRIPTIONS, BlendMode } from '@types';

const { Option } = Select;

interface LayersPanelProps {
  layers: Layer[];
  activeLayerId: string | null;
  onAddLayer: (imageData: ImageData) => void;
  onRemoveLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onBlendModeChange: (id: string, mode: BlendMode) => void;
  onActiveLayerChange: (id: string) => void;
  onLayerMove: (fromIndex: number, toIndex: number) => void;
}

const LayerItem = styled.div<{ isActive: boolean }>`
  padding: 8px;
  margin: 4px 0;
  border: 1px solid ${props => props.isActive ? '#1890ff' : '#d9d9d9'};
  border-radius: 4px;
  background: ${props => props.isActive ? '#e6f7ff' : 'white'};
`;

const PreviewImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 8px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

export const LayersPanel: FC<LayersPanelProps> = ({
  layers,
  activeLayerId,
  onAddLayer,
  onRemoveLayer,
  onToggleVisibility,
  onOpacityChange,
  onBlendModeChange,
  onActiveLayerChange,
  onLayerMove,
}) => {
  const handleFileUpload = async (file: File) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    onAddLayer(imageData);
    return false;
  };

  return (
    <Card title="Слои" style={{ marginTop: '20px' }}>
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={handleFileUpload}
        disabled={layers.length >= 2}
      >
        <Button icon={<PlusOutlined />} disabled={layers.length >= 2} block>
          Добавить слой
        </Button>
      </Upload>

      <List
        dataSource={layers}
        renderItem={(layer: Layer, index: number) => (
          <LayerItem
            isActive={layer.id === activeLayerId}
            onClick={() => onActiveLayerChange(layer.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {layer.preview && (
                <PreviewImage src={layer.preview} alt={layer.name} />
              )}
              <div style={{ flex: 1 }}>
                <div>{layer.name}</div>
                <Controls>
                  <Button
                    icon={layer.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(layer.id);
                    }}
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveLayer(layer.id);
                    }}
                  />
                  <Tooltip title="Прозрачность">
                    <div onClick={(e) => e.stopPropagation()}>
                      <Slider
                        style={{ width: 100 }}
                        min={0}
                        max={1}
                        step={0.01}
                        value={layer.opacity}
                        onChange={(value) => onOpacityChange(layer.id, value)}
                      />
                    </div>
                  </Tooltip>
                </Controls>
                <Select
                  value={layer.blendMode}
                  style={{ width: '100%' }}
                  onChange={(value) => onBlendModeChange(layer.id, value as BlendMode)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {Object.entries(BLEND_MODE_DESCRIPTIONS).map(([mode, description]) => (
                    <Option key={mode} value={mode}>
                      <Tooltip title={description}>
                        {mode}
                      </Tooltip>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </LayerItem>
        )}
      />
    </Card>
  );
}; 