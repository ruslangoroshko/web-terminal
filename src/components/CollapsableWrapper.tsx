import React, { FC, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import MinimizeSvg from '../assets/svg/icon-tabs-minimize.svg';
import FullscreenSvg from '../assets/svg/icon-tabs-fullscreen.svg';
import ExpandSvg from '../assets/svg/icon-tabs-expand.svg';
import SvgIcon from './SvgIcon';
import styled from '@emotion/styled';
interface Props {}

const CollapsableWrapper: FC<Props> = props => {
  const { children } = props;
  const MIN_HEIGHT = '40px';
  const MAX_HEIGHT = '100%';
  const [maxHeight, setHeightState] = useState(MIN_HEIGHT);
  const [lastHeight, setLastheight] = useState('100px');

  const fullScreen = () => {
    setHeightState(MAX_HEIGHT);
  };

  const toFixedHeight = () => {
    setHeightState(lastHeight);
  };

  const minimize = () => {
    setHeightState(MIN_HEIGHT);
  };

  return (
    <Collapsable position="relative" width="100%" maxHeight={maxHeight}>
      <IconsWrapper>
        <IconWrapper onClick={minimize}>
          <SvgIcon {...MinimizeSvg}></SvgIcon>
        </IconWrapper>
        <IconWrapper onClick={fullScreen}>
          <SvgIcon {...FullscreenSvg}></SvgIcon>
        </IconWrapper>
        <IconWrapper onClick={toFixedHeight}>
          <SvgIcon {...ExpandSvg}></SvgIcon>
        </IconWrapper>
      </IconsWrapper>
      {children}
    </Collapsable>
  );
};

export default CollapsableWrapper;

const Collapsable = styled(FlexContainer)<{ maxHeight: string }>`
  height: ${props => props.maxHeight || '40px'};
  overflow: hidden;
  background-color: #ffff001f;
`;

const IconsWrapper = styled(FlexContainer)`
  position: absolute;
  top: 12px;
  right: 12px;
`;

const IconWrapper = styled.div`
  margin-right: 4px;
  &:last-of-type {
    margin-right: 0;
  }
`;
