import React, { FC, useCallback } from 'react';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import Toggle from '../Toggle';
import { css } from '@emotion/core';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import SvgIcon from '../SvgIcon';

import IconShevronDown from '../../assets/svg/icon-popup-shevron-down.svg';
import autoCloseTypes from '../../constants/autoCloseTypes';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';

interface Props {
  dropdownType: 'sl' | 'tp';
  isDisabled?: boolean;
}

const PnLTypeDropdown: FC<Props> = observer(({ dropdownType, isDisabled }) => {
  const { t } = useTranslation();
  const { SLTPstore } = useStores();

  const handleAutoClose = (
    autoClose: TpSlTypeEnum,
    toggle: () => void
  ) => () => {
    switch (dropdownType) {
      case 'sl':
        SLTPstore.slType = autoClose;
        break;

      case 'tp':
        SLTPstore.tpType = autoClose;
        break;

      default:
        break;
    }
    toggle();
  };

  const availableAutoCloseTypes = [TpSlTypeEnum.Currency, TpSlTypeEnum.Price];

  const renderSymbol = useCallback(() => {
    switch (dropdownType) {
      case 'sl':
        return autoCloseTypes[SLTPstore.slType ?? TpSlTypeEnum.Currency].symbol;

      case 'tp':
        return autoCloseTypes[SLTPstore.tpType ?? TpSlTypeEnum.Currency].symbol;

      default:
        return '';
    }
  }, [SLTPstore.tpType, SLTPstore.slType]);

  return (
    <Toggle>
      {({ on, toggle }) => (
        <FlexContainer position="relative" alignItems="center">
          <DropdownButton
            isActive={on}
            onClick={toggle}
            type="button"
            disabled={isDisabled}
          >
            <PrimaryTextSpan
              color={on ? '#00FFDD' : 'rgba(255, 255, 255, 0.5)'}
            >
              {renderSymbol()}
            </PrimaryTextSpan>
            <SvgIcon
              {...IconShevronDown}
              fillColor="rgba(255, 255, 255, 0.5)"
            ></SvgIcon>
          </DropdownButton>
          {on && (
            <ProfitPercentPriceWrapper
              width="112px"
              backgroundColor="#000"
              padding="8px 8px 0"
              position="absolute"
              top="100%"
              right="0"
              flexDirection="column"
            >
              {availableAutoCloseTypes.map((key) => (
                <ProfitPercentPrice
                  key={key}
                  justifyContent="space-between"
                  padding="0 8px 8px 4px"
                  margin="0 0 8px 0"
                  onClick={handleAutoClose(key, toggle)}
                >
                  <PrimaryTextSpan
                    fontSize="12px"
                    lineHeight="14px"
                    color="rgba(255, 255, 255, 0.5)"
                  >
                    {t(autoCloseTypes[key].name)}
                  </PrimaryTextSpan>
                  <PrimaryTextSpan fontSize="12px" lineHeight="14px">
                    {autoCloseTypes[key].symbol}
                  </PrimaryTextSpan>
                </ProfitPercentPrice>
              ))}
            </ProfitPercentPriceWrapper>
          )}
        </FlexContainer>
      )}
    </Toggle>
  );
});

export default PnLTypeDropdown;

const DropdownButton = styled(ButtonWithoutStyles)<{ isActive?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 8px;
  height: 100%;
  width: 38px;
  background-color: ${(props) => (props.isActive ? '#000000' : 'transparent')};
  border-radius: 2px 2px 2px 0;

  &:before {
    content: '';
    position: absolute;
    background-color: transparent;
    ${(props) => props.isActive && OuterBorderRadius}
  }

  &:disabled:hover {
    cursor: default;
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

  &:hover {
    cursor: pointer;
    span {
      color: #00ffdd;
    }
  }
`;
