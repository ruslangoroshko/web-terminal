import React, { useState, useRef, useEffect, FC } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
} from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import SetAutoclose from './SetAutoclose';
import IconClose from '../../assets/svg/icon-close.svg';
import { SecondaryButton } from '../../styles/Buttons';
import SvgIcon from '../SvgIcon';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import { useTranslation } from 'react-i18next';
import { DeepMap, FieldError, useFormContext, useWatch } from 'react-hook-form';
import hasValue from '../../helpers/hasValue';
import { ConnectForm } from './ConnectForm';
import { FormValues } from '../../types/Positions';

interface Props {
  instrumentId: string;
}

const AutoClosePopup: FC<Props> = ({ instrumentId }) => {
  const { mainAppStore, SLTPstore } = useStores();
  const [on, toggle] = useState(false);
  const { t } = useTranslation();

  const { setValue } = useFormContext<FormValues>();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = (clearErrors: any) => () => {
    toggle(!on);
    if (!on) {
      clearErrors(['tp', 'sl']);
    }
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      if (on) {
        setValue('tp', undefined);
        setValue('sl', undefined);
      }
      handleClose();
    }
  };

  const clearSLTP = (setValue: any) => () => {
    setValue('tp', undefined);
    setValue('sl', undefined);
    SLTPstore.setTpType(TpSlTypeEnum.Currency);
    SLTPstore.setSlType(TpSlTypeEnum.Currency);
  };

  const handleClose = () => {
    toggle(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderTPValue = (getValues: any) => {
    const { tp, tpType } = getValues();
    return `${
      hasValue(tp)
        ? `+${
            tpType === TpSlTypeEnum.Currency
              ? mainAppStore.activeAccount?.symbol
              : ''
          }${tp}`
        : ''
    }`;
  };

  const renderSLValue = (getValues: any) => {
    const { sl, slType } = getValues();
    return `${
      hasValue(sl)
        ? `-${
            slType === TpSlTypeEnum.Currency
              ? mainAppStore.activeAccount?.symbol
              : ''
          }${sl}`
        : ''
    }`;
  };

  const { sl, tp } = useWatch({});

  useEffect(() => {
    SLTPstore.setSlType(TpSlTypeEnum.Currency);
    SLTPstore.setTpType(TpSlTypeEnum.Currency);
    SLTPstore.setInstrumentId(instrumentId);
  }, []);

  const handleApplySetAutoClose = (
    errors: DeepMap<Record<string, any>, FieldError>
  ) => () => {
    console.log(Object.keys(errors));
    if (!Object.keys(errors).length) {
      toggle(false);
    }
  };

  return (
    <ConnectForm>
      {({ getValues, clearErrors, errors }) => (
        <>
          <FlexContainer position="relative" ref={wrapperRef}>
            <FlexContainer width="100%" position="relative">
              <ButtonAutoClosePurchase
                onClick={handleToggle(clearErrors)}
                type="button"
                hasValues={!!(sl || tp)}
              >
                <FlexContainer flexDirection="column" alignItems="center">
                  {!on && (hasValue(sl) || hasValue(tp)) ? (
                    <FlexContainer
                      alignItems="center"
                      padding="0 20px 0 0"
                      width="100%"
                      flexWrap="wrap"
                    >
                      <PrimaryTextSpan
                        overflow="hidden"
                        marginRight="4px"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        title={renderTPValue(getValues)}
                        color="#fffccc"
                        fontSize="14px"
                      >
                        {renderTPValue(getValues)}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        title={renderSLValue(getValues)}
                        color="#fffccc"
                        fontSize="14px"
                      >
                        {renderSLValue(getValues)}
                      </PrimaryTextSpan>
                    </FlexContainer>
                  ) : (
                    <PrimaryTextParagraph color="#fffccc" fontSize="14px">
                      {t('Set')}
                    </PrimaryTextParagraph>
                  )}
                </FlexContainer>
              </ButtonAutoClosePurchase>
              {!on && (hasValue(sl) || hasValue(tp)) && (
                <ClearSLTPButton type="button" onClick={clearSLTP(setValue)}>
                  <SvgIcon
                    {...IconClose}
                    fillColor="rgba(255,255,255,0.4)"
                    hoverFillColor="#00FFDD"
                  />
                </ClearSLTPButton>
              )}
            </FlexContainer>
            <FlexContainer
              position="absolute"
              top="20px"
              right="100%"
              visibilityProp={on ? 'visible' : 'hidden'}
            >
              <SetAutoclose toggle={toggle}>
                <ButtonApply
                  type="button"
                  onClick={handleApplySetAutoClose(errors)}
                >
                  {t('Apply')}
                </ButtonApply>
              </SetAutoclose>
            </FlexContainer>
          </FlexContainer>
        </>
      )}
    </ConnectForm>
  );
};

export default AutoClosePopup;

const ButtonAutoClosePurchase = styled(SecondaryButton)<{
  hasValues?: boolean;
}>`
  height: 40px;
  width: 100%;
  margin-bottom: 14px;
  text-align: ${(props) => props.hasValues && 'left'};
  border: ${(props) => props.hasValues && '1px solid rgba(255, 255, 255, 0.1)'};
  background-color: ${(props) =>
    props.hasValues && 'rgba(255, 255, 255, 0.06)'};
`;

const ClearSLTPButton = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 12px;
  right: 12px;
`;

const ButtonApply = styled(ButtonWithoutStyles)`
  background: linear-gradient(0deg, #00fff2, #00fff2);
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #003a38;
  height: 32px;
`;
