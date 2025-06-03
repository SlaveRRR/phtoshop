import styled from 'styled-components';

export const CanvasContainer = styled('div')`
  position: relative;
`;

export const CanvasComponent = styled('canvas')`
  width: calc(100vw - 100px);
  height: calc(100vh - 100px);
  transform-origin: top left;
`;

export const ViewPort = styled('div')`
  width: 100%;
  height: calc(-158px + 100vh);
  position: relative;
  background-color: rgb(250, 250, 250);
  border: 2px dashed rgb(217, 217, 217);
  border-radius: 8px;
  overflow: auto;
`;
