import React, { useRef, useEffect, FC, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import IconShevronDropdown from '../../assets/svg/icon-shevron-down.svg';
import { paymentCurrencies } from '../../constants/paymentCurrencies';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';

interface Props {
  selectedCurrency: string;
  handleSelectCurrency: (value: string) => void;
  width?: string;
  disabled?: boolean;
}

const CurrencyDropdown: FC<Props> = ({
  selectedCurrency,
  handleSelectCurrency,
  width,
  disabled = false
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [on, toggle] = useState(false);
  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  const handleToggleDropdown = (flag: boolean) => () => {
    toggle(flag);
  };

  const handleSelectCurrencyDropdown = (currency: string) => () => {
    handleSelectCurrency(currency);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <FlexContainer
      position="relative"
      ref={wrapperRef}
      padding="12px"
      onClick={handleToggleDropdown(!on)}
      borderRadius="4px 4px 0 0"
      width={width || "140px"}
      justifyContent={disabled ? 'center' : ''}
    >
      {!disabled && (<FlexContainer position="absolute" right="8px" top="16px">
        <ButtonWithoutStyles onClick={handleToggleDropdown(false)}>
          <SvgIcon
            {...IconShevronDropdown}
            fillColor={Colors.ACCENT}
            hoverFillColor={Colors.PRIMARY}
            width={8}
          />
        </ButtonWithoutStyles>
      </FlexContainer>)}

      <PrimaryTextSpan fontWeight={400} color={Colors.WHITE} fontSize="14px">
        {t('Amount')}, {selectedCurrency}
      </PrimaryTextSpan>
      {on && !disabled && (
        <FlexContainer
          position="absolute"
          top="100%"
          left="0"
          right="0"
          flexDirection="column"
          backgroundColor="#272832"
        >
          {paymentCurrencies.map(item => (
            <CurrencyItem
              key={item}
              onClick={handleSelectCurrencyDropdown(item)}
            >
              <CurrencyItemText fontSize="14px" color={Colors.ACCENT}>
                {item}
              </CurrencyItemText>
            </CurrencyItem>
          ))}
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default CurrencyDropdown;

const CurrencyItem = styled(ButtonWithoutStyles)`
  padding: 8px;
  margin-bottom: 8px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover > span {
    color: ${Colors.PRIMARY};
  }
`;

const CurrencyItemText = styled(PrimaryTextSpan)`
  transition: all 0.2s ease;
`;
