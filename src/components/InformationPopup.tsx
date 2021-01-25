import React, { FC } from 'react';
import { FlexContainer, FlexContainerProps } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import SvgIcon from './SvgIcon';
import IconInfo from '../assets/svg/icon-info.svg';
import { css } from '@emotion/core';

interface Props {
  bgColor: string;
  classNameTooltip: string;
  direction: 'top' | 'right' | 'left' | 'bottom';
  width: string;
}

const InformationPopup: FC<Props> = props => {
  const { bgColor, children, classNameTooltip, direction, width } = props;
  return (
    <FlexContainer position="relative">
      <InfoIcon classNameTooltip={classNameTooltip}>
        <SvgIcon {...IconInfo} fillColor="rgba(255, 255, 255, 0.6)" />
      </InfoIcon>
      <TooltipWrapper
        width={width}
        direction={direction}
        padding="12px"
        position="absolute"
        backgroundColor={bgColor}
        className={classNameTooltip}
        zIndex="103"
      >
        {children}
      </TooltipWrapper>
    </FlexContainer>
  );
};

export default InformationPopup;

const rightDirection = css`
  top: 0;
  left: 22px;

  &:after {
    top: 0;
    left: -7px;
    transform: rotate(180deg);
  }
`;

const leftDirection = css`
  top: 0;
  right: 22px;

  &:after {
    top: 0;
    right: -7px;
  }
`;

const bottomDirection = css`
  top: 20px;
  left: 50%;
  transform: translateX(-50%);

  &:after {
    top: -7px;
    left: 50%;
    transform: translateX(-50%) rotate(-90deg);
  }
`;

const topDirection = css`
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);

  &:after {
    bottom: -7px;
    left: 50%;
    transform: translateX(-50%) rotate(-90deg);
  }
`;

const TooltipWrapper = styled(FlexContainer)<
  FlexContainerProps & { direction: Props['direction'] }
>`
  display: none;
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
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 0 7px 8px;
    border-color: transparent transparent transparent
      ${props => props.backgroundColor};
  }

  ${props => {
    switch (props.direction) {
      case 'top':
        return topDirection;
      case 'bottom':
        return bottomDirection;
      case 'left':
        return leftDirection;
      case 'right':
        return rightDirection;
    }
  }}

  &:hover {
    display: flex;
  }
`;

const InfoIcon = styled(FlexContainer)<
  FlexContainerProps & { classNameTooltip: string }
>`
  border-radius: 50%;
  &:hover > svg {
    fill: #00fff2;
  }
  &:hover + .${props => props.classNameTooltip} {
    display: block;
    cursor: default;
  }
`;
