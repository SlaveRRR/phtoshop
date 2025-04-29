import styled from 'styled-components';
import { CanvasComponentStyledProps } from './types';

export const CanvasContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  background-color: #fafafa;
  overflow: auto;
`;

export const CanvasComponent = styled('canvas')<CanvasComponentStyledProps>`
  max-width: 100%;
  background-color: #fff;
  transform: scale(${(props) => props.scale});
  transform-origin: top left;
`;
