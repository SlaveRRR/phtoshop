import { Dispatch, SetStateAction } from 'react';

export interface ControlsProps {
  setScale: Dispatch<SetStateAction<number>>;
  scale: number;
}
