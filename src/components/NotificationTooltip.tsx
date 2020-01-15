import React, { FC } from 'react';
import { FlexContainer, FlexContainerProps } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import ColorsPallete from '../styles/colorPallete';
import { PrimaryTextSpan } from '../styles/TextsElements';
import SvgIcon from './SvgIcon';
import IconInfo from '../assets/svg/icon-info.svg';

interface Props {
  bgColor: string;
  classNameTooltip: string;
  isRightDirection?: boolean;
  width: string;
}

const NotificationTooltip: FC<Props> = props => {
  const {
    bgColor,
    children,
    classNameTooltip,
    isRightDirection,
    width,
  } = props;
  return (
    <FlexContainer position="relative">
      <InfoIcon classNameTooltip={classNameTooltip}>
        <SvgIcon
          {...IconInfo}
          fillColor="rgba(255, 255, 255, 0.6)"
          hoverFillColor="#00FFF2"
        />
      </InfoIcon>
      <TooltipWrapper
        width={width}
        padding="12px"
        position="absolute"
        top="0"
        right={isRightDirection ? 'auto' : '22px'}
        left={isRightDirection ? '22px' : 'auto'}
        backgroundColor={bgColor}
        className={classNameTooltip}
        zIndex="101"
      >
        {children}
      </TooltipWrapper>
    </FlexContainer>
  );
};

export default NotificationTooltip;

const TooltipWrapper = styled(FlexContainer)<
  FlexContainerProps & { isRightDirection?: boolean }
>`
  visibility: hidden;
  opacity: 0;
  box-shadow: 0px 12px 24px ${props => props.backgroundColor}40,
    0px 6px 12px ${props => props.backgroundColor}40;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border-radius: 2px 0 2px 2px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.backgroundColor};
    opacity: 0.2;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: ${props => (props.isRightDirection ? 'auto' : '-7px')};
    right: ${props => (props.isRightDirection ? '-7px' : 'auto')};
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 0 7px 8px;
    border-color: transparent transparent transparent
      ${props => props.backgroundColor};
    transform: ${props => !props.isRightDirection && 'rotate(180deg)'};
  }

  &:hover {
    visibility: visible;
    opacity: 1;
  }
`;

const InfoIcon = styled(FlexContainer)<
  FlexContainerProps & { classNameTooltip: string }
>`
  border-radius: 50%;
  &:hover > svg {
    fill: ${ColorsPallete.MINT};
  }
  &:hover + .${props => props.classNameTooltip} {
    visibility: visible;
    opacity: 1;
    cursor: default;
  }
`;
