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
import { DeepMap, FieldError, useWatch } from 'react-hook-form';
import hasValue from '../../helpers/hasValue';
import { ConnectForm } from './ConnectForm';

interface Props {
  instrumentId: string;
  refAutoclose: React.RefObject<HTMLDivElement>;
}

const AutoClosePopup: FC<Props> = ({ instrumentId, refAutoclose }) => {
  const { mainAppStore, SLTPstore } = useStores();
  const [on, toggle] = useState(false);
  const { t } = useTranslation();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = (clearErrors: any) => () => {
    toggle(!on);
    if (!on) {
      clearErrors(['tp', 'sl']);
    }
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
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
    return `+${
      hasValue(tp)
        ? `${
            tpType === TpSlTypeEnum.Currency
              ? mainAppStore.activeAccount?.symbol
              : ''
          }${tp}`
        : t('Non Set')
    }`;
  };

  const renderSLValue = (getValues: any) => {
    const { sl, slType } = getValues();
    return `—${
      hasValue(sl)
        ? `${
            slType === TpSlTypeEnum.Currency
              ? mainAppStore.activeAccount?.symbol
              : ''
          }${sl}`
        : t('Non Set')
    }`;
  };

  const { sl, tp } = useWatch({});

  useEffect(() => {
    SLTPstore.setSlType(TpSlTypeEnum.Currency);
    SLTPstore.setTpType(TpSlTypeEnum.Currency);
    SLTPstore.setInstrumentId(instrumentId);
  }, []);

  useEffect(() => {
   if (!on) {
     SLTPstore.toggleToppingUp(false);
   }
  }, [on]);

  const handleApplySetAutoClose = (
    errors: DeepMap<Record<string, any>, FieldError>,
    setError: (arg0: string, arg1: any) => void,
    getValues: any
  ) => () => {
    const { sl, tp } = getValues();
    if (tp === 0) {
      setError('tp', {
        type: 'manual',
        message: t('Take Profit can not be zero')
      });
    }
    if (sl === 0) {
      setError('sl', {
        type: 'manual',
        message: t('Stop Loss can not be zero')
      });
    }
    if (!Object.keys(errors).length) {
      toggle(false);
    }
  };

  return (
    <ConnectForm>
      {({
        getValues,
        clearErrors,
        errors,
        setValue,
        setError,
      }) => (
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
                      justifyContent="space-between"
                      alignItems="center"
                      padding="0 20px 0 0"
                      width="100%"
                      flexWrap="wrap"
                    >
                      <PrimaryTextSpan
                        overflow="hidden"
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
              display={on ? 'flex' : 'none'}
              ref={refAutoclose}
            >
              <SetAutoclose toggle={toggle} on={on}>
                <ButtonApply
                  type="button"
                  form="buySellForm"
                  disabled={!hasValue(sl) && !hasValue(tp)}
                  onClick={handleApplySetAutoClose(errors, setError, getValues)}
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
