import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import IconClose from '../../assets/svg/icon-close.svg';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import { PrimaryButton } from '../../styles/Buttons';
import { OpenPositionModelFormik } from '../../types/Positions';
import { AskBidEnum } from '../../enums/AskBid';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';

interface Props {
  closePopup: () => void;
  values: OpenPositionModelFormik;
  instrumentId: string;
  digits: number;
  disabled: boolean;
}

function ConfirmationPopup(props: Props) {
  const { closePopup, values, instrumentId, digits, disabled } = props;
  const { quotesStore, mainAppStore } = useStores();

  return (
    <FlexContainer
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
        Confirmation
      </PrimaryTextParagraph>
      <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
        <PrimaryTextSpan color="rgba(255,255,255,0.4)" fontSize="12px">
          Price opened
        </PrimaryTextSpan>
        <Observer>
          {() => (
            <PrimaryTextSpan color="#fffccc" fontSize="12px">
              {quotesStore.quotes[instrumentId].ask.c.toFixed(digits)}
            </PrimaryTextSpan>
          )}
        </Observer>
      </FlexContainer>
      <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
        <PrimaryTextSpan color="rgba(255,255,255,0.4)" fontSize="12px">
          Type
        </PrimaryTextSpan>
        <PrimaryTextSpan color="#fffccc" fontSize="12px">
          {values.operation !== null ? AskBidEnum[values.operation] : ''}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
        <PrimaryTextSpan color="rgba(255,255,255,0.4)" fontSize="12px">
          Investment
        </PrimaryTextSpan>
        <PrimaryTextSpan color="#fffccc" fontSize="12px">
          {mainAppStore.activeAccount?.symbol}
          {values.investmentAmount}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
        <PrimaryTextSpan color="rgba(255,255,255,0.4)" fontSize="12px">
          Multiplier
        </PrimaryTextSpan>
        <PrimaryTextSpan color="#fffccc" fontSize="12px">
          &times;{values.multiplier}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer justifyContent="space-between" margin="0 0 16px 0">
        <PrimaryTextSpan color="rgba(255,255,255,0.4)" fontSize="12px">
          Volume
        </PrimaryTextSpan>
        <PrimaryTextSpan color="#fffccc" fontSize="12px">
          {mainAppStore.activeAccount?.symbol}
          {values.investmentAmount * values.multiplier}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer flexDirection="column">
        <PrimaryButton type="submit" padding="8px 16px" disabled={disabled}>
          <PrimaryTextSpan fontSize="14px" color="#1c2026" fontWeight="bold">
            Confirm {values.operation === AskBidEnum.Buy ? 'Buying' : 'Selling'}
          </PrimaryTextSpan>
        </PrimaryButton>
      </FlexContainer>
    </FlexContainer>
  );
}

export default ConfirmationPopup;
