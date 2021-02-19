import React, { useState, useRef, useEffect, FC } from 'react';
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
import { useTranslation } from 'react-i18next';
import InformationPopup from '../InformationPopup';
import ErropPopup from '../ErropPopup';
import ColorsPallete from '../../styles/colorPallete';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../../types/Positions';
import setValueAsNullIfEmpty from '../../helpers/setValueAsNullIfEmpty';
import hasValue from '../../helpers/hasValue';

interface Props {
  instrumentId: string;
  digits: number;
}

const OpenPricePopup: FC<Props> = ({ instrumentId, digits }) => {
  const [on, toggle] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const { setValue, register, errors, watch } = useFormContext<FormValues>();

  const { quotesStore, instrumentsStore, mainAppStore } = useStores();

  const handleToggle = () => {
    toggle(!on);
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  const applyOpenPrice = (errors: any) => () => {
    if (!Object.keys(errors).length) {
      toggle(false);
    }
  };

  const handleBeforeInput = (e: any) => {
    const currTargetValue = e.currentTarget.value;

    if (!e.data.match(/^[0-9.,]*$/g)) {
      e.preventDefault();
      return;
    }

    if (!currTargetValue && [',', '.'].includes(e.data)) {
      e.preventDefault();
      return;
    }

    if ([',', '.'].includes(e.data)) {
      if (
        !currTargetValue ||
        (currTargetValue && currTargetValue.includes('.'))
      ) {
        e.preventDefault();
        return;
      }
    }
    // see another regex
    const regex = `^[0-9]{1,7}([,.][0-9]{1,${
      instrumentsStore.activeInstrument?.instrumentItem.digits || 2
    }})?$`;
    const splittedValue =
      currTargetValue.substring(0, e.currentTarget.selectionStart) +
      e.data +
      currTargetValue.substring(e.currentTarget.selectionStart);
    if (
      currTargetValue &&
      ![',', '.'].includes(e.data) &&
      !splittedValue.match(regex)
    ) {
      e.preventDefault();
      return;
    }
    if (e.data.length > 1 && !splittedValue.match(regex)) {
      e.preventDefault();
      return;
    }
  };

  const clearOpenPrice = () => {
    setValue('openPrice', null);
  };

  const setCurrentPrice = (value: string) => () => {
    setValue('openPrice', value);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { openPrice } = watch();
  return (
    <FlexContainer position="relative" ref={wrapperRef}>
      {hasValue(openPrice) && !on ? (
        <FlexContainer position="relative" width="100%">
          <ButtonAutoClosePurchase
            onClick={handleToggle}
            type="button"
            hasPrice={true}
          >
            <PrimaryTextSpan color="#fffccc" fontSize="14px">
              {mainAppStore.activeAccount?.symbol}
              {openPrice}
            </PrimaryTextSpan>
          </ButtonAutoClosePurchase>
          <ClearOpenPriceButton type="button" onClick={clearOpenPrice}>
            <SvgIcon
              {...IconClose}
              fillColor="rgba(255, 255, 255, 0.6)"
              hoverFillColor="#00FFDD"
            />
          </ClearOpenPriceButton>
        </FlexContainer>
      ) : (
        <ButtonAutoClosePurchase
          onClick={handleToggle}
          type="button"
          hasPrice={false}
        >
          <PrimaryTextSpan color="#fffccc" fontSize="14px">
            {t('Set Price')}
          </PrimaryTextSpan>
        </ButtonAutoClosePurchase>
      )}
      <SetPriceWrapper
        position="absolute"
        bottom="0px"
        right="100%"
        display={on ? 'flex' : 'none'}
      >
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
            {t('Purchase at')}
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
              {t('When Price is')}
            </PrimaryTextSpan>
            <InformationPopup
              bgColor="#000000"
              classNameTooltip="autoclose"
              width="212px"
              direction="left"
            >
              <PrimaryTextSpan color="#fffccc" fontSize="12px">
                {t(
                  'When the position reached the specified take profit or stop loss level, the position will be closed automatically.'
                )}
              </PrimaryTextSpan>
            </InformationPopup>
          </FlexContainer>
          <InputWrapper
            margin="0 0 16px 0"
            height="32px"
            width="100%"
            position="relative"
            justifyContent="space-between"
          >
            {errors.openPrice && (
              <ErropPopup
                textColor="#fffccc"
                bgColor={ColorsPallete.RAZZMATAZZ}
                classNameTooltip={Fields.OPEN_PRICE}
                direction="left"
              >
                {errors.openPrice.message}
              </ErropPopup>
            )}
            <InputPnL
              onBeforeInput={handleBeforeInput}
              name={Fields.OPEN_PRICE}
              placeholder={t('Non Set')}
              ref={register({ setValueAs: setValueAsNullIfEmpty })}
            ></InputPnL>
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
              {t('Current price')}
            </PrimaryTextSpan>
            <Observer>
              {() => (
                <ButtonWithoutStyles
                  type="button"
                  onClick={setCurrentPrice(
                    quotesStore.quotes[instrumentId]?.bid.c.toFixed(digits) ||
                      ''
                  )}
                >
                  <PrimaryTextSpan
                    textDecoration="underline"
                    color="rgba(255, 255, 255, 0.8)"
                    fontSize="11px"
                    lineHeight="12px"
                  >
                    {quotesStore.quotes[instrumentId]?.bid.c.toFixed(digits)}
                  </PrimaryTextSpan>
                </ButtonWithoutStyles>
              )}
            </Observer>
          </FlexContainer>
          <ButtonApply type="button" onClick={applyOpenPrice(errors)}>
            {t('Apply')}
          </ButtonApply>
        </Wrapper>
      </SetPriceWrapper>
    </FlexContainer>
  );
};

export default OpenPricePopup;

const Wrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 1);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
  }
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
  color: #fffccc;
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
  background-color: ${(props) =>
    props.hasPrice ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.12)'};
  width: 100%;
  border: 1px solid
    ${(props) =>
      props.hasPrice ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0)'};

  display: flex;
  justify-content: ${(props) => (props.hasPrice ? 'space-between' : 'center')};
  align-items: center;
`;

const ClearOpenPriceButton = styled(ButtonWithoutStyles)`
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
  top: -96px;
  bottom: auto;
  @media (max-height: 700px) {
    top: auto;
    bottom: 0;
  }
`;
