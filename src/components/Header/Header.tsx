import { CurvesModal } from '@components/CurvesModal';
import { KernelModal } from '@components/KernelModal';
import { SaveModal } from '@components/SaveModal/SaveModal';
import { useApp } from '@hooks';
import { Tool } from '@hooks/useTools';
import { Button, Select, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { FaChartLine, FaHandPaper } from 'react-icons/fa';
import { LuPipette } from 'react-icons/lu';
import { scaleOptions } from './constants';
import { Controls, StyledHeader, Title, ToolsPanel } from './styled';

export const Header = () => {
  const {
    onScaleChange,
    scale,
    openModal,
    activeTool,
    layers,
    activeLayerId,
    applyCurvesCorrection,
    applyKernels,
    setActiveTool,
  } = useApp();

  const activeLayer = layers[layers.findIndex((layer) => layer.id === activeLayerId)] ?? {
    imageData: null,
    hasAlpha: false,
  };

  const { imageData, hasAlpha } = activeLayer;

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [isOpenKernels, setIsOpenKernels] = useState(false);

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
  };

  const closeModal = () => setIsOpenModal(false);

  const closeKernel = () => setIsOpenKernels(false);

  return (
    <StyledHeader>
      <Space>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Imagix
        </Title>
      </Space>
      {imageData && (
        <>
          <Space size={20}>
            <ToolsPanel>
              <Tooltip title="Рука (H)" placement="right">
                <Button
                  type={activeTool === 'hand' ? 'primary' : 'default'}
                  icon={<FaHandPaper />}
                  onClick={() => handleToolChange('hand')}
                />
              </Tooltip>
              <Tooltip title="Пипетка (P)" placement="right">
                <Button
                  type={activeTool === 'pippete' ? 'primary' : 'default'}
                  icon={<LuPipette />}
                  onClick={() => handleToolChange('pippete')}
                />
              </Tooltip>
              <Tooltip title="Кривые (C)" placement="right">
                <Button
                  type={activeTool === 'curvey' ? 'primary' : 'default'}
                  icon={<FaChartLine />}
                  onClick={() => {
                    handleToolChange('curvey');
                    setIsOpenModal(true);
                  }}
                />
              </Tooltip>
              <Tooltip title="Фильтры (F)" placement="right">
                <Button
                  type={activeTool === 'kernels' ? 'primary' : 'default'}
                  icon={<CiFilter />}
                  onClick={() => {
                    handleToolChange('kernels');
                    setIsOpenKernels(true);
                  }}
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
          <CurvesModal
            visible={isOpenModal}
            onApply={applyCurvesCorrection}
            onClose={closeModal}
            imageData={imageData}
            isAlphaChannel={!!hasAlpha}
          />
          <KernelModal visible={isOpenKernels} activeLayer={activeLayer} onClose={closeKernel} onApply={applyKernels} />
          <SaveModal />
        </>
      )}
    </StyledHeader>
  );
};
