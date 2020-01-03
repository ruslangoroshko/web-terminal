import React, { FC } from 'react';
import { FlexContainer, FlexContainerProps } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import ColorsPallete from '../styles/colorPallete';
import { PrimaryTextSpan } from '../styles/TextsElements';

interface Props {
  bgColor: string;
  textColor: string;
  classNameTooltip: string;
}

const NotificationTooltip: FC<Props> = props => {
  const { bgColor, textColor, children, classNameTooltip } = props;
  return (
    <FlexContainer position="relative">
      <InfoIcon
        justifyContent="center"
        alignItems="center"
        width="14px"
        height="14px"
        classNameTooltip={classNameTooltip}
      >
        i
      </InfoIcon>
      <TooltipWrapper
        width="212px"
        padding="12px"
        position="absolute"
        top="0"
        right="22px"
        backgroundColor={bgColor}
        textColor={textColor}
        className={classNameTooltip}
      >
        <PrimaryTextSpan>{children}</PrimaryTextSpan>
      </TooltipWrapper>
    </FlexContainer>
  );
};

export default NotificationTooltip;

const TooltipWrapper = styled(FlexContainer)`
  visibility: hidden;
  opacity: 0;
  box-shadow: 0px 12px 24px ${props => props.backgroundColor}40,
    0px 6px 12px ${props => props.backgroundColor}40;
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
    right: -7px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 0 7px 8px;
    border-color: transparent transparent transparent
      ${props => props.backgroundColor};
  }

  &:hover {
    visibility: visible;
    opacity: 1;
  }
`;

const InfoIcon = styled(FlexContainer)<
  FlexContainerProps & { classNameTooltip: string }
>`
  font-size: 11px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fffccc;
  font-style: italic;
  &:hover {
    background-color: ${ColorsPallete.MINT};
    color: #333333;
  }
  &:hover + .${props => props.classNameTooltip} {
    visibility: visible;
    opacity: 1;
    cursor: default;
  }
`;
