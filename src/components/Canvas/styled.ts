import styled from 'styled-components';

export const CanvasContainer = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CanvasComponent = styled('canvas')`
  display: block;
`;

export const ViewPort = styled('div')`
  width: calc(100vw - 100px);
  height: calc(100vh - 100px);
  position: relative;
  background-color: rgb(250, 250, 250);
  border: 2px dashed rgb(217, 217, 217);
  border-radius: 8px;
  overflow: auto;
`;
