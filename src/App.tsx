import { Header, ImageEditor } from '@components';
import { AppProvider } from '@hooks';
import { FC, useState } from 'react';

import { StyledCard, StyledContent, StyledLayout } from './styled';

export const App: FC = () => {
  const [scale, setScale] = useState<number>(100);
  const [isResizeModalOpen, setIsResizeModalOpen] = useState(false);

  const handleScaleChange = (value: number) => {
    setScale(value);
  };

  const handleResizeClick = () => {
    setIsResizeModalOpen(true);
  };

  return (
    <AppProvider>
      <StyledLayout>
        <Header 
          scale={scale} 
          onScaleChange={handleScaleChange} 
          onResizeClick={handleResizeClick}
        />
        <StyledContent>
          <StyledCard title="Image Preview">
            <ImageEditor 
              scale={scale} 
              onScaleChange={handleScaleChange}
              isResizeModalOpen={isResizeModalOpen}
              onResizeModalClose={() => setIsResizeModalOpen(false)}
            />
          </StyledCard>
        </StyledContent>
      </StyledLayout>
    </AppProvider>
  );
};
