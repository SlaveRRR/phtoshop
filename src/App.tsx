import { Canvas, FileUploader, ImageInfo } from '@components';
import { ImageMetadata } from '@types';
import { Card, Layout, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const { Header, Content } = Layout;
const { Title } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  width: 100vw;
  align-items: center;
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StyledPreviewCard = styled(Card)`
  width: 100%;
`;

export const App: React.FC = () => {
  const [metadata, setMetadata] = useState<ImageMetadata>({} as ImageMetadata);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <StyledLayout>
      <StyledHeader>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Imagix
        </Title>
      </StyledHeader>
      <StyledContent>
        <FileUploader canvasRef={canvasRef} setMetadata={setMetadata} />
        <ImageInfo metadata={metadata} />
        <StyledPreviewCard title="Image Preview">
          <Canvas ref={canvasRef} metadata={metadata} />
        </StyledPreviewCard>
      </StyledContent>
    </StyledLayout>
  );
};
