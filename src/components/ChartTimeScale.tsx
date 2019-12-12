import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { supportedResolutions } from '../constants/supportedResolutionsTimeScale';
import styled from '@emotion/styled';
import ColorsPallete from '../styles/colorPallete';

interface Props {
  activeResolution: string;
  setTimeScale: (arg0: string) => void;
}

const ChartTimeScale: FC<Props> = props => {
  const { activeResolution, setTimeScale } = props;

  const handleChangeResolution = (resolution: string) => () => {
    setTimeScale(resolution);
  };

  return (
    <TimeScaleWrapper>
      {supportedResolutions.map(item => (
        <TimeScaleItem
          isActive={item === activeResolution}
          onClick={handleChangeResolution(item)}
          key={item}
        >
          {item}
        </TimeScaleItem>
      ))}
    </TimeScaleWrapper>
  );
};

export default ChartTimeScale;

const TimeScaleWrapper = styled(FlexContainer)`
  /* Rectangle 135 */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.06);
    z-index: -1;
  }
  border-radius: 2px;
  position: relative;
  padding: 2px;
`;

const TimeScaleItem = styled(FlexContainer)<{ isActive: boolean }>`
  padding: 6px;
  height: 100%;
  width: 86px;
  background-color: ${props =>
    props.isActive ? ColorsPallete.BLUE_STONE : 'transparent'};
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${props => (props.isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)')};

  &:hover {
    background-color: ${ColorsPallete.BLUE_STONE};
  }
`;
