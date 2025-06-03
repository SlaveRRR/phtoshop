import { Canvas, Header } from '@components';
import { AppProvider } from '@hooks';
import { FC } from 'react';

import { StyledLayout } from './styled';

export const App: FC = () => {
  return (
    <AppProvider>
      <StyledLayout>
        <Header />

        <Canvas />
        {/* <ImageEditor 
              scale={scale} 
              onScaleChange={handleScaleChange}
              isResizeModalOpen={isResizeModalOpen}
              onResizeModalClose={() => setIsResizeModalOpen(false)}
            /> */}
      </StyledLayout>
    </AppProvider>
  );
};
