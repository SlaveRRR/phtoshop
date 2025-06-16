import { useEffect, useState } from 'react';
import { Tool } from './types';

export const useTools = () => {
  const [activeTool, setActiveTool] = useState<Tool>('hand');
  useEffect(() => {
    const handleKeyPress = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'h') {
        setActiveTool('hand');
      } else if (e.key === 'p') {
        setActiveTool('pippete');
      } else if (e.key === 'c') {
        setActiveTool('curvey');
      } else if (e.key === 'f') {
        setActiveTool('kernels');
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  return { activeTool, setActiveTool };
};
