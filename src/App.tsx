import { Canvas, FileUploader } from '@components';
import { ImageMetadata } from '@types';
import React, { useRef, useState } from 'react';
import { StyledContent, StyledHeader, StyledLayout, StyledPreviewCard, Title } from './styled';

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
        <StyledPreviewCard title="Image Preview">
          <Canvas ref={canvasRef} metadata={metadata} />
        </StyledPreviewCard>
           <FileUploader metadata={metadata} canvasRef={canvasRef} setMetadata={setMetadata} />
      </StyledContent>
    </StyledLayout>
  );
};
