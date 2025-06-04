import { calculateContrast } from '@utils';
import { Card, Space, Tooltip } from 'antd';
import { FC } from 'react';
import { COLOR_SPACES } from './constants';
import { ColorLabel, ColorPanel, ColorRow, ColorSwatch, ColorValue, Info } from './styled';
import { ColorInfoProps } from './types';

export const ColorInfo: FC<ColorInfoProps> = ({ pipetteColors }) => {
  const { color1 = '', color2 = '' } = pipetteColors;
  const contrast = color1 && color2 ? calculateContrast(color1, color2) : null;

  return (
    <ColorPanel title="Информация о цвете">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {color1 || color2 ? (
          <>
            {color1 && (
              <Card size="small" title="Цвет 1">
                <ColorRow>
                  <ColorSwatch color={`rgb(${color1.rgb.r}, ${color1.rgb.g}, ${color1.rgb.b})`} />
                  <Info>
                    <div>
                      X: {color1.position.x}, Y: {color1.position.y}
                    </div>
                    {Object.entries(COLOR_SPACES).map(([space, info]) => (
                      <Tooltip
                        key={space}
                        title={
                          <div>
                            <div>{info.description}</div>
                            <br />
                            {Object.entries(info.axes).map(([axis, data]) => (
                              <div key={axis}>
                                <strong>{data.name}</strong>: {data.description}
                                <br />
                                Диапазон: {data.range}
                              </div>
                            ))}
                          </div>
                        }
                      >
                        <div>
                          <ColorLabel>{info.name}:</ColorLabel>
                          <ColorValue>
                            {Object.entries(color1[space as keyof Color])
                              .map(([key, value]) => `${key}: ${value.toFixed(2)}`)
                              .join(', ')}
                          </ColorValue>
                        </div>
                      </Tooltip>
                    ))}
                  </Info>
                </ColorRow>
              </Card>
            )}

            {color2 && (
              <Card size="small" title="Цвет 2">
                <ColorRow>
                  <ColorSwatch color={`rgb(${color2.rgb.r}, ${color2.rgb.g}, ${color2.rgb.b})`} />
                  <Info>
                    <div>
                      X: {color2.position.x}, Y: {color2.position.y}
                    </div>
                    {Object.entries(COLOR_SPACES).map(([space, info]) => (
                      <Tooltip
                        key={space}
                        title={
                          <div>
                            <div>{info.description}</div>
                            <br />
                            {Object.entries(info.axes).map(([axis, data]) => (
                              <div key={axis}>
                                <strong>{data.name}</strong>: {data.description}
                                <br />
                                Диапазон: {data.range}
                              </div>
                            ))}
                          </div>
                        }
                      >
                        <div>
                          <ColorLabel>{info.name}:</ColorLabel>
                          <ColorValue>
                            {Object.entries(color2[space as keyof Color])
                              .map(([key, value]) => `${key}: ${value?.toFixed(2)}`)
                              .join(', ')}
                          </ColorValue>
                        </div>
                      </Tooltip>
                    ))}
                  </Info>
                </ColorRow>
              </Card>
            )}

            {color1 && color2 && (
              <div>
                <strong>Контраст: </strong>
                <span style={{ color: contrast && contrast < 4.5 ? '#ff4d4f' : '#52c41a' }}>
                  {contrast?.toFixed(2)}:1
                  {contrast && contrast < 4.5 && ' (недостаточный)'}
                </span>
              </div>
            )}
          </>
        ) : (
          <div>Выберите цвет, кликнув по изображению. Для выбора второго цвета используйте Alt, Ctrl или Shift.</div>
        )}
      </Space>
    </ColorPanel>
  );
};
