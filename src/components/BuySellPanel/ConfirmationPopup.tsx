import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import IconClose from '../../assets/svg/icon-close.svg';
import styled from '@emotion/styled';
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
  applyHandler: () => void;
  values: OpenPositionModelFormik;
  instrumentId: string;
  digits: number;
}

function ConfirmationPopup(props: Props) {
  const { closePopup, applyHandler, values, instrumentId, digits } = props;
  const { quotesStore, mainAppStore } = useStores();
  const apply = () => {
    applyHandler();
    closePopup();
  };
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
        <PrimaryButton type="button" onClick={apply} padding="8px 16px">
          <PrimaryTextSpan fontSize="14px" color="#1c2026" fontWeight="bold">
            Confirm Buying
          </PrimaryTextSpan>
        </PrimaryButton>
      </FlexContainer>
      {/* <FlexContainer>
        <Label>
          <InputCheckbox type="checkbox" />
          <Checkbox
            padding="4px"
            border="1px solid rgba(255, 255, 255, 0.19)"
            borderRadius="4px"
            className="always-checkbox"
            width="16px"
            margin="0 8px 0 0"
          />
          <PrimaryTextSpan fontSize="12px" color="rgba(255,255,255,0.4)">
            Always purchase in one click
          </PrimaryTextSpan>
        </Label>
      </FlexContainer> */}
    </FlexContainer>
  );
}

export default ConfirmationPopup;

const Label = styled.label`
  display: flex;
  align-items: center;
`;

const Checkbox = styled(FlexContainer)`
  transition: background-color 0.2s ease;
  overflow: hidden;
  &:before {
    content: '';
    background-color: rgba(255, 255, 255, 0.06);
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const InputCheckbox = styled.input`
  display: none;

  &:checked + .always-checkbox {
    background-color: #00fff2;
  }
`;
