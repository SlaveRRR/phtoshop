import { PipetteColors } from '@hooks/useApp/types';

export interface ColorInfoProps {
  pipetteColors: PipetteColors;
}

export interface Point {
  x: number;
  y: number;
}

export interface Color {
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  xyz: {
    x: number;
    y: number;
    z: number;
  };
  lab: {
    l: number;
    a: number;
    b: number;
  };
  oklch: {
    l: number;
    c: number;
    h: number;
  };
  position: Point;
}

export interface ColorSpaceInfo {
  name: string;
  description: string;
  axes: {
    [key: string]: {
      name: string;
      description: string;
      range: string;
    };
  };
}
