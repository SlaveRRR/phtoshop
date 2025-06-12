import { FC } from 'react';
import { CurveysProps } from './types';

export const Curves: FC<CurveysProps> = ({ histogram, color, point1, point2 }) => {
  const maxValue = Math.max(...histogram);

  // Создаем точки для полилинии гистограммы
  const histogramPoints = histogram
    .map((value, index) => {
      const x = (index / 255) * 300; // Масштабируем к ширине 300px
      const y = 250 - (value / maxValue) * 200; // Инвертируем Y и масштабируем
      return `${x},${y}`;
    })
    .join(' ');

  // Координаты точек коррекции
  const point1X = (point1.input / 255) * 300;
  const point1Y = 250 - (point1.output / 255) * 200;
  const point2X = (point2.input / 255) * 300;
  const point2Y = 250 - (point2.output / 255) * 200;

  return (
    <svg width="300" height="250" style={{ border: '1px solid #d9d9d9', backgroundColor: '#fafafa' }}>
      {/* Сетка */}
      <defs>
        <pattern id="grid" width="30" height="25" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 25" fill="none" stroke="#e0e0e0" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="300" height="250" fill="url(#grid)" />

      <polyline points={histogramPoints} fill="none" stroke={color} strokeWidth="1" opacity="0.7" />

      <polygon points={`0,250 ${histogramPoints} 300,250`} fill={color} opacity="0.3" />

      <line x1="0" y1={250 - (point1.output / 255) * 200} x2={point1X} y2={point1Y} stroke="#ff4d4f" strokeWidth="2" />
      <line x1={point1X} y1={point1Y} x2={point2X} y2={point2Y} stroke="#ff4d4f" strokeWidth="2" />
      <line
        x1={point2X}
        y1={point2Y}
        x2="300"
        y2={250 - (point2.output / 255) * 200}
        stroke="#ff4d4f"
        strokeWidth="2"
      />

      <circle cx={point1X} cy={point1Y} r="4" fill="#ff4d4f" stroke="#fff" strokeWidth="2" />
      <circle cx={point2X} cy={point2Y} r="4" fill="#ff4d4f" stroke="#fff" strokeWidth="2" />

      <text x="150" y="245" textAnchor="middle" fontSize="10" fill="#666">
        Входные значения (0-255)
      </text>
      <text x="10" y="125" fontSize="10" fill="#666" transform="rotate(-90, 10, 125)">
        Выходные значения
      </text>
    </svg>
  );
};
