import React, { FC } from 'react';
import { PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { FlexContainer, FlexContainerProps } from '../styles/FlexContainer';

interface Props {
  bgColor: string;
  textColor: string;
  classNameTooltip: string;
  direction: 'right' | 'left';
}

const ErropPopup: FC<Props> = (props) => {
  const { bgColor, textColor, classNameTooltip, children, direction } = props;

  return (
    <TooltipWrapper
      width="232px"
      padding="12px"
      position="absolute"
      top="8px"
      right={direction === 'left' ? 'calc(100% + 20px)' : 'auto'}
      left={direction === 'left' ? 'auto' : 'calc(100% + 20px)'}
      backgroundColor={bgColor}
      textColor={textColor}
      className={classNameTooltip}
      direction={direction}
      zIndex="102"
    >
      <PrimaryTextSpan>{children}</PrimaryTextSpan>
    </TooltipWrapper>
  );
};

export default ErropPopup;

const TooltipWrapper = styled(FlexContainer)<
  FlexContainerProps & { direction: Props['direction'] }
>`
  visibility: visible;
  opacity: 1;
  box-shadow: 0px 12px 24px ${(props) => props.backgroundColor}40,
    0px 6px 12px ${(props) => props.backgroundColor}40;
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
    background-color: ${(props) => props.backgroundColor};
    opacity: 0.2;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: ${(props) => (props.direction === 'left' ? '-7px' : 'auto')};
    left: ${(props) => (props.direction === 'left' ? 'auto' : '-7px')};
    width: 0;
    height: 0;
    transform: ${(props) => props.direction === 'right' && 'rotate(180deg)'};
    border-style: solid;
    border-width: 7px 0 7px 8px;
    border-color: transparent transparent transparent
      ${(props) => props.backgroundColor};
  }
`;
