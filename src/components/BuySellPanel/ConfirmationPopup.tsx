import React, { useRef, useEffect, FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import IconClose from '../../assets/svg/icon-close.svg';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import { PrimaryButton } from '../../styles/Buttons';
import { AskBidEnum } from '../../enums/AskBid';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

interface Props {
  closePopup: () => void;
  instrumentId: string;
  digits: number;
  disabled: boolean;
  investmentAmount: number;
  operation: AskBidEnum | null;
  multiplier: number;
  //handleSubmit: () => void;
}

const ConfirmationPopup: FC<Props> = ({
  closePopup,
  instrumentId,
  digits,
  disabled,
  operation,
  multiplier,
  investmentAmount,
}) => {
  const { quotesStore, mainAppStore } = useStores();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      closePopup();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <FlexContainer
      ref={wrapperRef}
      padding="24px"
      width="248px"
      backgroundColor="#1c2026"
      borderRadius="4px"
      position="relative"
      flexDirection="column"
    >
      <FlexContainer position="absolute" top="16px" right="16px">
        <ButtonWithoutStyles type="button" onClick={closePopup}>
          <SvgIcon
            {...IconClose}
            fillColor="rgba(255, 255, 255, 0.6)"
            hoverFillColor="#00FFDD"
          />
        </ButtonWithoutStyles>
      </FlexContainer>
      <PrimaryTextParagraph
        color="#fffccc"
        fontSize="16px"
        marginBottom="16px"
        fontWeight="bold"
      >
        {t('Confirmation')}
      </PrimaryTextParagraph>
      <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
        <PrimaryTextSpan color="rgba(255,255,255,0.4)" fontSize="12px">
          {t('Open price')}
        </PrimaryTextSpan>
        <Observer>
          {() => (
            <PrimaryTextSpan color="#fffccc" fontSize="12px">
              {quotesStore.quotes[instrumentId] &&
                quotesStore.quotes[instrumentId][
                  operation === AskBidEnum.Buy ? 'ask' : 'bid'
                ].c.toFixed(digits)}
            </PrimaryTextSpan>
          )}
        </Observer>
      </FlexContainer>
      <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
        <PrimaryTextSpan color="rgba(255,255,255,0.4)" fontSize="12px">
          {t('Type')}
        </PrimaryTextSpan>
        <PrimaryTextSpan color="#fffccc" fontSize="12px">
          {operation !== null ? AskBidEnum[operation] : ''}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
        <PrimaryTextSpan color="rgba(255,255,255,0.4)" fontSize="12px">
          {t('Investment')}
        </PrimaryTextSpan>
        <PrimaryTextSpan color="#fffccc" fontSize="12px">
          {`${mainAppStore.activeAccount?.symbol} ${investmentAmount}`}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
        <PrimaryTextSpan color="rgba(255,255,255,0.4)" fontSize="12px">
          {t('Multiplier')}
        </PrimaryTextSpan>
        <PrimaryTextSpan color="#fffccc" fontSize="12px">
          &times;{multiplier}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer justifyContent="space-between" margin="0 0 16px 0">
        <PrimaryTextSpan color="rgba(255,255,255,0.4)" fontSize="12px">
          {t('Volume')}
        </PrimaryTextSpan>
        <PrimaryTextSpan color="#fffccc" fontSize="12px">
          {mainAppStore.activeAccount?.symbol}
          {(investmentAmount * multiplier).toFixed(2)}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer flexDirection="column">
        {operation === AskBidEnum.Buy ? (
          <PrimaryButton type="submit" padding="8px 16px" disabled={disabled}>
            <PrimaryTextSpan fontSize="14px" color="#1c2026" fontWeight="bold">
              {t('Confirm Buying')}
            </PrimaryTextSpan>
          </PrimaryButton>
        ) : (
          <ButtonSell type="submit" disabled={disabled}>
            <PrimaryTextSpan fontSize="14px" color="#ffffff" fontWeight="bold">
              {t('Confirm Selling')}
            </PrimaryTextSpan>
          </ButtonSell>
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default ConfirmationPopup;

const ButtonSell = styled(ButtonWithoutStyles)`
  background-color: #ed145b;
  border-radius: 4px;
  padding: 8px 16px;
  transition: background-color 0.2s ease;
  will-change: background-color;

  &:hover {
    background-color: #ff557e;
  }

  &:focus {
    background-color: #bd1d51;
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;
