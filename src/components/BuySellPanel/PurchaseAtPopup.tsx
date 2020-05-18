import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import IconClose from '../../assets/svg/icon-popup-close.svg';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import Fields from '../../constants/fields';
import { SecondaryButton } from '../../styles/Buttons';

interface Props {
  setFieldValue: (field: any, value: any) => void;
  purchaseAtValue: number | null;
  instrumentId: string;
  digits: number;
}

function PurchaseAtPopup(props: Props) {
  const { setFieldValue, purchaseAtValue, instrumentId, digits } = props;

  const handleChangePurchaseAt = (e: ChangeEvent<HTMLInputElement>) => {
    SLTPStore.purchaseAtValue = e.target.value.replace(',', '.');
  };

  const [on, toggle] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    quotesStore,
    SLTPStore,
    instrumentsStore,
    mainAppStore,
  } = useStores();

  const handleToggle = () => {
    toggle(!on);
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  const applyPurchaseAt = () => {
    setFieldValue(Fields.PURCHASE_AT, +SLTPStore.purchaseAtValue);
    toggle(false);
  };

  const handleBeforeInput = (e: any) => {
    if (!e.data.match(/^[0-9.,]*$/)) {
      e.preventDefault();
      return;
    }
    if (e.currentTarget.value && [',', '.'].includes(e.data)) {
      if (e.currentTarget.value.includes('.')) {
        e.preventDefault();
        return;
      }
    }
    const regex = `^[0-9]+(\.[0-9]{1,${instrumentsStore.activeInstrument!
      .instrumentItem.digits - 1}})?$`;

    if (
      e.currentTarget.value &&
      e.currentTarget.value[e.currentTarget.value.length - 1] !== '.' &&
      !e.currentTarget.value.match(regex)
    ) {
      e.preventDefault();
      return;
    }
  };

  const clearPurchaseAt = () => {
    setFieldValue(Fields.PURCHASE_AT, null);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    SLTPStore.purchaseAtValue = purchaseAtValue ? `purchaseAtValue` : '';
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <FlexContainer position="relative" ref={wrapperRef}>
      {purchaseAtValue ? (
        <FlexContainer position="relative" width="100%">
          <ButtonAutoClosePurchase
            onClick={handleToggle}
            type="button"
            hasPrice={!!purchaseAtValue}
          >
            <PrimaryTextSpan color="#fffccc" fontSize="14px">
              {mainAppStore.activeAccount?.symbol}
              {purchaseAtValue}
            </PrimaryTextSpan>
          </ButtonAutoClosePurchase>
          <ClearPurchaseAtButton type="button" onClick={clearPurchaseAt}>
            <SvgIcon
              {...IconClose}
              fillColor="rgba(255, 255, 255, 0.6)"
              hoverFillColor="#00FFDD"
            />
          </ClearPurchaseAtButton>
        </FlexContainer>
      ) : (
        <ButtonAutoClosePurchase
          onClick={handleToggle}
          type="button"
          hasPrice={!!purchaseAtValue}
        >
          <PrimaryTextSpan color="#fffccc" fontSize="14px">
            Set Price
          </PrimaryTextSpan>
        </ButtonAutoClosePurchase>
      )}
      {on && (
        <SetPriceWrapper position="absolute" bottom="0px" right="100%">
          <Wrapper
            position="relative"
            padding="16px"
            flexDirection="column"
            width="200px"
          >
            <ButtonClose type="button" onClick={handleToggle}>
              <SvgIcon
                {...IconClose}
                fillColor="rgba(255, 255, 255, 0.6)"
                hoverFillColor="#00FFDD"
              ></SvgIcon>
            </ButtonClose>
            <PrimaryTextParagraph marginBottom="16px">
              Purchase At
            </PrimaryTextParagraph>
            <FlexContainer
              margin="0 0 6px 0"
              alignItems="center"
              justifyContent="space-between"
            >
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                color="rgba(255, 255, 255, 0.3)"
                textTransform="uppercase"
              >
                When Price is
              </PrimaryTextSpan>
              <InfoIcon
                width="14px"
                justifyContent="center"
                alignItems="center"
              >
                i
              </InfoIcon>
            </FlexContainer>
            <InputWrapper
              margin="0 0 16px 0"
              height="32px"
              width="100%"
              position="relative"
              justifyContent="space-between"
            >
              <Observer>
                {() => (
                  <InputPnL
                    onBeforeInput={handleBeforeInput}
                    onChange={handleChangePurchaseAt}
                    value={SLTPStore.purchaseAtValue}
                    placeholder="Non Set"
                  ></InputPnL>
                )}
              </Observer>
              <FlexContainer>
                <ButtonIncreaseDecreasePrice type="button">
                  <PrimaryTextSpan
                    fontSize="16px"
                    fontWeight="bold"
                    color="rgba(255, 255, 255, 0.5)"
                  >
                    -
                  </PrimaryTextSpan>
                </ButtonIncreaseDecreasePrice>
                <ButtonIncreaseDecreasePrice type="button">
                  <PrimaryTextSpan
                    fontSize="16px"
                    fontWeight="bold"
                    color="rgba(255, 255, 255, 0.5)"
                  >
                    +
                  </PrimaryTextSpan>
                </ButtonIncreaseDecreasePrice>
              </FlexContainer>
            </InputWrapper>
            <FlexContainer
              justifyContent="space-between"
              alignItems="center"
              margin="0 0 16px 0"
            >
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.3)"
                fontSize="11px"
                lineHeight="12px"
              >
                Current price
              </PrimaryTextSpan>
              <PrimaryTextSpan
                textDecoration="underline"
                color="rgba(255, 255, 255, 0.8)"
                fontSize="11px"
                lineHeight="12px"
              >
                <Observer>
                  {() => (
                    <>
                      {quotesStore.quotes[instrumentId].bid.c.toFixed(digits)}
                    </>
                  )}
                </Observer>
              </PrimaryTextSpan>
            </FlexContainer>
            <ButtonApply type="button" onClick={applyPurchaseAt}>
              Apply
            </ButtonApply>
          </Wrapper>
        </SetPriceWrapper>
      )}
    </FlexContainer>
  );
}

export default PurchaseAtPopup;

const Wrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
  }
`;

const InfoIcon = styled(FlexContainer)`
  font-size: 11px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fffccc;
  font-style: italic;
`;

const ButtonClose = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputPnL = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  padding: 8px 0 8px 8px;

  &:-webkit-input-placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }

  &:-ms-input-placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }

  &::placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }
`;

const InputWrapper = styled(FlexContainer)`
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  background-color: rgba(255, 255, 255, 0.06);
`;

const ButtonIncreaseDecreasePrice = styled(ButtonWithoutStyles)`
  padding: 0 4px;
  height: 100%;
`;

const ButtonApply = styled(ButtonWithoutStyles)`
  background-color: #00fff2;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #003a38;
  height: 32px;

  &:hover {
    background-color: #9ffff2;
  }

  &:focus {
    background-color: #21b3a4;
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
    color: white;
  }
`;

const ButtonAutoClosePurchase = styled(SecondaryButton)<{
  hasPrice?: boolean;
}>`
  height: 40px;
  background-color: ${props =>
    props.hasPrice ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.12)'};
  width: 100%;
  border: 1px solid
    ${props =>
      props.hasPrice ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0)'};

  display: flex;
  justify-content: ${props => (props.hasPrice ? 'space-between' : 'center')};
`;

const ClearPurchaseAtButton = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 12px;
  transition: background-color 0.2s ease;
  will-change: background-color;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const SetPriceWrapper = styled(FlexContainer)`
  top: -54px;
  bottom: auto;
  @media (max-height: 700px) {
    top: auto;
    bottom: 0;
  }
`;
