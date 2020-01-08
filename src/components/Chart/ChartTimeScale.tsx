import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { supportedResolutions } from '../../constants/supportedTimeScales';

interface Props {
  activeInterval: string;
  setResolutionScale: (arg0: string) => void;
}

const ChartResolutionTimeScale: FC<Props> = props => {
  const { activeInterval, setResolutionScale } = props;

  const handleChangeResolution = (interval: string) => () => {
    setResolutionScale(interval);
  };

  return (
    <ChartTimeScaleWrapper padding="2px" alignItems="center">
      {(Object.keys(supportedResolutions) as Array<
        keyof typeof supportedResolutions
      >).map((key, i) => (
        <TimeScaleItem
          isActive={key === activeInterval}
          key={key}
          onClick={handleChangeResolution(supportedResolutions[key])}
        >
          {key}
        </TimeScaleItem>
      ))}
    </ChartTimeScaleWrapper>
  );
};

export default ChartResolutionTimeScale;

const ChartTimeScaleWrapper = styled(FlexContainer)``;

export const TimeScaleItem = styled(FlexContainer)<{ isActive?: boolean }>`
  padding: 4px 12px;
  height: 28px;
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${props => (props.isActive ? '#21B3A4' : 'rgba(255, 255, 255, 0.6)')};
  border: ${props => (props.isActive ? '1px solid #21B3A4' : 'none')};
  backdrop-filter: blur(8px);
  background-color: ${props => props.isActive && 'rgba(33, 179, 164, 0.04);'};

  &:hover {
    background-color: rgba(33, 179, 164, 0.04);
    cursor: pointer;
  }
`;
