import { useApp } from '@hooks';
import { Tool } from '@hooks/useTools';
import { Button, Select, Space, Tooltip } from 'antd';
import { FaHandPaper } from 'react-icons/fa';
import { LuPipette } from 'react-icons/lu';
import { Uploader } from './components';
import { scaleOptions } from './constants';
import { Controls, StyledHeader, Title, ToolsPanel } from './styled';

export const Header = () => {
  const {
    metadata: { imageData },
    onScaleChange,
    scale,
    openModal,
    activeTool,
    setActiveTool,
  } = useApp();

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
  };

  return (
    <StyledHeader>
      <Space>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Imagix
        </Title>
        <Uploader />
      </Space>
      {imageData && (
        <Space size={20}>
          <ToolsPanel>
            <Tooltip title="Рука (H)" placement="right">
              <Button
                type={activeTool === 'hand' ? 'primary' : 'default'}
                icon={<FaHandPaper />}
                onClick={() => handleToolChange('hand')}
              />
            </Tooltip>
            <Tooltip title="Пипетка (E)" placement="right">
              <Button
                type={activeTool === 'pippete' ? 'primary' : 'default'}
                icon={<LuPipette />}
                onClick={() => handleToolChange('pippete')}
              />
            </Tooltip>
          </ToolsPanel>

          <Controls>
            <Space align="center">
              <Button type="primary" onClick={openModal}>
                Изменить размер
              </Button>
              <span style={{ color: 'white' }}>Масштаб:</span>
              <Select value={scale} onChange={onScaleChange} style={{ width: 120 }} options={scaleOptions} />
            </Space>
          </Controls>
        </Space>
      )}
    </StyledHeader>
  );
};
