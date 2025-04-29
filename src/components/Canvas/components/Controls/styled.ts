import { Slider, Typography } from 'antd';
import styled from 'styled-components';

export const ControlsContainer = styled('div')`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ScaleControls = styled('div')`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ScaleSlider = styled(Slider)`
  flex: 1;
`;

export const ScaleLabel = styled(Typography.Text)`
  min-width: 60px;
  text-align: center;
`;
