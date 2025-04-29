import { UndoOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC, useCallback, useEffect } from 'react';
import { ControlsContainer, ScaleControls, ScaleLabel, ScaleSlider } from './styled';
import { ControlsProps } from './types';

export const Controls: FC<ControlsProps> = ({ scale, setScale }) => {
  const handleScaleChange = (value: number) => {
    setScale(value);
  };

  const handleResetScale = useCallback(() => {
    setScale(1);
  }, []);

  useEffect(() => {
    handleResetScale();
  }, [handleResetScale]);

  return (
    <ControlsContainer>
      <ScaleControls>
        <ScaleLabel>{scale}</ScaleLabel>
        <ScaleSlider min={0.1} step={0.1} max={1} value={scale} onChange={handleScaleChange} />
        <Button icon={<UndoOutlined />} onClick={handleResetScale}>
          Reset
        </Button>
      </ScaleControls>
    </ControlsContainer>
  );
};
