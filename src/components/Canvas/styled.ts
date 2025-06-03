import styled from 'styled-components';

export const CanvasContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: start;
  min-height: 300px;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  background-color: #fafafa;
  overflow: auto;
`;

export const CanvasComponent = styled('canvas')`
  width: calc(100vw - 100px);
  height: calc(100vh - 100px);
  background-color: #fff;
  transform-origin: top left;
`;
