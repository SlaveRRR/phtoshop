import { describe, expect, it } from 'vitest';
import { calculateContrast, gb7ToRgb, labToOklch, rgbToGb7, rgbToXyz, xyzToLab } from './color';

describe('Color conversion functions', () => {
  describe('rgbToXyz', () => {
    it('should convert white correctly', () => {
      const { x, y, z } = rgbToXyz(255, 255, 255);
      expect(x).toBeCloseTo(95.047, 1);
      expect(y).toBeCloseTo(100, 1);
      expect(z).toBeCloseTo(108.883, 1);
    });

    it('should convert black correctly', () => {
      const { x, y, z } = rgbToXyz(0, 0, 0);
      expect(x).toBeCloseTo(0, 1);
      expect(y).toBeCloseTo(0, 1);
      expect(z).toBeCloseTo(0, 1);
    });

    it('should convert red correctly', () => {
      const { x, y, z } = rgbToXyz(255, 0, 0);
      expect(x).toBeCloseTo(41.24, 1);
      expect(y).toBeCloseTo(21.26, 1);
      expect(z).toBeCloseTo(1.93, 1);
    });
  });

  describe('xyzToLab', () => {
    it('should convert white correctly', () => {
      const { l, a, b } = xyzToLab(95.047, 100, 108.883);
      expect(l).toBeCloseTo(100, 1);
      expect(a).toBeCloseTo(0, 1);
      expect(b).toBeCloseTo(0, 1);
    });

    it('should convert black correctly', () => {
      const { l, a, b } = xyzToLab(0, 0, 0);
      expect(l).toBeCloseTo(0, 1);
      expect(a).toBeCloseTo(0, 1);
      expect(b).toBeCloseTo(0, 1);
    });
  });

  describe('labToOklch', () => {
    it('should convert neutral gray correctly', () => {
      const { l, c, h } = labToOklch(50, 0, 0);
      expect(l).toBeCloseTo(0.5, 2);
      expect(c).toBeCloseTo(0, 2);
      expect(h).toBeCloseTo(0, 2);
    });

    it('should handle hue correctly', () => {
      const { h } = labToOklch(50, 50, 50);
      expect(h).toBeCloseTo(45, 1);
    });
  });

  describe('calculateContrast', () => {
    it('should calculate contrast between same colors as 1', () => {
      const color = { rgb: { r: 128, g: 128, b: 128 } };
      const contrast = calculateContrast(color as any, color as any);
      expect(contrast).toBeCloseTo(1, 1);
    });
  });

  describe('GB7 conversion', () => {
    it('should convert RGB to GB7 correctly', () => {
      expect(rgbToGb7(0)).toBe(0);
      expect(rgbToGb7(255)).toBe(127);
      expect(rgbToGb7(128)).toBeCloseTo(64, 0);
    });

    it('should be reversible', () => {
      const original = 100;
      expect(rgbToGb7(gb7ToRgb(original))).toBe(original);
    });
  });
});
