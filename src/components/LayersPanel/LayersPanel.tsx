import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { useApp } from '@hooks';
import { Button, Col, Row, Select, Slider, Switch, Tooltip, Typography, Upload } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

const { Text } = Typography;

const { Option } = Select;

// Описания режимов наложения для тултипов
const blendModeTooltips: Record<string, string> = {
  normal: 'Обычный: отображает пиксели верхнего слоя без смешивания.',
  multiply: 'Умножение: умножает цвета верхнего и нижнего слоев, создавая более темный цвет.',
  screen: 'Экран: инвертирует цвета обоих слоев, умножает их и инвертирует результат, создавая более светлый цвет.',
  overlay: 'Наложение: комбинирует умножение и экран, затемняя темные области и осветляя светлые.',
};

// Стили с использованием styled-components
const LayersPanelContainer = styled.div`
  position: absolute;
  width: max-content;
  right: 0;
  bottom: 0;
  max-height: 300px;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
  border-left: 1px solid #d9d9d9;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const LayerItem = styled.div<{ isActive: boolean }>`
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isActive ? '#e6f7ff' : '#ffffff')};
  border: 1px solid #d9d9d9;
  border-radius: 4px;
`;

const LayerControls = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const LayerName = styled.span`
  flex: 1;
  margin-left: 8px;
  font-size: 14px;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  border: 1px solid #d9d9d9;
`;

const PreviewWrapper = styled.div`
  width: 60px;
  height: 60px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const UploadButton = styled(Button)`
  width: 100%;
  margin-bottom: 8px;
`;

const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LayersPanel: React.FC = () => {
  const {
    layers,
    activeLayerId,
    setActiveLayerId,
    addLayer,
    moveLayer,
    toggleLayerVisibility,
    deleteLayer,
    updateLayerOpacity,
    updateLayerBlendMode,
    toggleAlphaChannelVisibility,
    deleteAlphaChannel,
    onFileSelect,
  } = useApp();

  const [fillColor, setFillColor] = useState<string>('#ffffff');

  // Предпросмотр слоя или альфа-канала
  const renderPreview = (data?: ImageData | string, isAlpha: boolean = false) => {
    if (!data) return null;

    if (typeof data === 'string') {
      return (
        <div
          style={{
            backgroundColor: data,
            width: 50,
            height: 50,
          }}
        />
      );
    } else if (data instanceof ImageData) {
      // Для ImageData создаем blob URL
      const canvas = document.createElement('canvas');
      canvas.width = data.width;
      canvas.height = data.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.putImageData(data, 0, 0);
      const imageUrl = canvas.toDataURL();

      return (
        <PreviewWrapper>
          <PreviewImage src={imageUrl} alt="Предпросмотр изображения" />
        </PreviewWrapper>
      );
    }

    return null;
  };
  return (
    <LayersPanelContainer>
      <div>
        <SectionTitle>Слои</SectionTitle>
        {layers.map((layer, index) => (
          <LayerItem key={layer.id} isActive={layer.id === activeLayerId} onClick={() => setActiveLayerId(layer.id)}>
            <LayerControls>
              {renderPreview(layer.imageData || layer.color)}
              <LayerName>{layer.name}</LayerName>
              <Button
                icon={layer.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                onClick={() => toggleLayerVisibility(layer.id)}
                size="small"
              />
              <Button
                icon={<DeleteOutlined />}
                onClick={() => deleteLayer(layer.id)}
                size="small"
                disabled={layers.length <= 1}
              />
            </LayerControls>
            <div style={{ marginBottom: '8px' }}>
              <label>Прозрачность: {layer.opacity}%</label>
              <Slider
                min={0}
                max={100}
                value={layer.opacity}
                onChange={(value) => updateLayerOpacity(layer.id, value)}
              />
            </div>
            <Tooltip title={blendModeTooltips[layer.blendMode]}>
              <Select
                value={layer.blendMode}
                onChange={(value) => updateLayerBlendMode(layer.id, value)}
                style={{ width: '100%' }}
              >
                <Option value="normal">Обычный</Option>
                <Option value="multiply">Умножение</Option>
                <Option value="screen">Экран</Option>
                <Option value="overlay">Наложение</Option>
              </Select>
            </Tooltip>
            <ButtonGroup>
              <Button size="small" onClick={() => moveLayer(index, index - 1)} disabled={index === 0}>
                Вверх
              </Button>
              <Button size="small" onClick={() => moveLayer(index, index + 1)} disabled={index === layers.length - 1}>
                Вниз
              </Button>
            </ButtonGroup>
            <Row gutter={[8, 8]} style={{ padding: '0 8px' }}>
              <Col span={24}>
                <Text type="secondary">Альфа-канал</Text>
              </Col>
              <Col span={24}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Tooltip title={layer.hasAlpha ? 'Показать/скрыть альфа-канал' : 'Слой не имеет альфа-канала'}>
                      <Switch
                        size="small"
                        checked={layer.alphaVisible}
                        onChange={() => toggleAlphaChannelVisibility(layer.id)}
                        disabled={!layer.hasAlpha}
                      />
                    </Tooltip>
                  </Col>
                  <Col>
                    <Tooltip title={layer.hasAlpha ? 'Удалить альфа-канал' : 'Слой не имеет альфа-канала'}>
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => deleteAlphaChannel(layer.id)}
                        disabled={!layer.hasAlpha}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
            </Row>
          </LayerItem>
        ))}
        <div style={{ marginTop: '16px' }}>
          <Upload customRequest={onFileSelect} showUploadList={false}>
            <UploadButton icon={<UploadOutlined />} disabled={layers.length >= 2}>
              Добавить слой с изображением
            </UploadButton>
          </Upload>
          <ColorPickerContainer>
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              style={{ width: '32px', height: '32px' }}
            />
            <Button onClick={() => addLayer('color', undefined, fillColor)} disabled={layers.length >= 2}>
              Добавить цветной слой
            </Button>
          </ColorPickerContainer>
        </div>
      </div>
    </LayersPanelContainer>
  );
};
