import { Canvas, Header } from '@components';
import React from 'react';
import { AppProvider } from './hooks';
import { StyledContent, StyledLayout, StyledPreviewCard } from './styled';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <StyledLayout>
        <Header />
        <StyledContent>
          <StyledPreviewCard title="Image Preview">
            <Canvas />
          </StyledPreviewCard>
        </StyledContent>
      </StyledLayout>
    </AppProvider>
  );
};
