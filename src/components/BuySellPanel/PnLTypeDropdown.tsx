import React from 'react';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import Toggle from '../Toggle';
import { css } from '@emotion/core';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import SvgIcon from '../SvgIcon';

import IconShevronDown from '../../assets/svg/icon-popup-shevron-down.svg';

interface Props {}

function PnLTypeDropdown(props: Props) {
  const {} = props;

  return (
    <Toggle>
      {({ on, toggle }) => (
        <FlexContainer position="relative">
          <DropdownButton isActive={on} onClick={toggle}>
            <PrimaryTextSpan marginRight="4px" color="rgba(255, 255, 255, 0.5)">
              $
            </PrimaryTextSpan>
            <SvgIcon
              {...IconShevronDown}
              fill="rgba(255, 255, 255, 0.5)"
            ></SvgIcon>
          </DropdownButton>
          {on && (
            <ProfitPercentPriceWrapper
              width="112px"
              backgroundColor="#000"
              padding="8px"
              position="absolute"
              top="100%"
              right="0"
              flexDirection="column"
            >
              <ProfitPercentPrice
                justifyContent="space-between"
                padding="0 8px 8px 4px"
                margin="0 0 8px 0"
              >
                <PrimaryTextSpan fontSize="12px" lineHeight="14px">
                  Profit
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="12px"
                  lineHeight="14px"
                  opacity="0.5"
                >
                  $
                </PrimaryTextSpan>
              </ProfitPercentPrice>
              <ProfitPercentPrice
                justifyContent="space-between"
                padding="0 8px 8px 4px"
                margin="0 0 8px 0"
              >
                <PrimaryTextSpan fontSize="12px" lineHeight="14px">
                  Percent
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="12px"
                  lineHeight="14px"
                  opacity="0.5"
                >
                  %
                </PrimaryTextSpan>
              </ProfitPercentPrice>
              <ProfitPercentPrice
                justifyContent="space-between"
                padding="0 8px 8px 4px"
                margin="0 0 8px 0"
              >
                <PrimaryTextSpan fontSize="12px" lineHeight="14px">
                  Price
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="12px"
                  lineHeight="14px"
                  opacity="0.5"
                >
                  =
                </PrimaryTextSpan>
              </ProfitPercentPrice>
            </ProfitPercentPriceWrapper>
          )}
        </FlexContainer>
      )}
    </Toggle>
  );
}

export default PnLTypeDropdown;

const DropdownButton = styled(ButtonWithoutStyles)<{ isActive?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 28px;
  background-color: ${props => (props.isActive ? '#000000' : 'transparent')};
  border-radius: 2px 2px 2px 0;

  &:before {
    content: '';
    position: absolute;
    background-color: transparent;
    ${props => props.isActive && OuterBorderRadius}
  }
`;

const OuterBorderRadius = css`
  left: -2px;
  height: 4px;
  width: 2px;
  bottom: 1px;
  border-bottom-right-radius: 2px;
  box-shadow: 0 2px 0 0 #000;
`;

const ProfitPercentPriceWrapper = styled(FlexContainer)`
  border-radius: 2px;
  z-index: 104;
`;

const ProfitPercentPrice = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  &:last-of-type {
    border: none;
    margin: 0;
  }
`;
