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
import { useFormContext } from 'react-hook-form';
import hasValue from '../../helpers/hasValue';
import { FormValues } from '../../types/Positions';
import { Observer } from 'mobx-react-lite';

interface Props {
  instrumentId: string;
}

const AutoClosePopup: FC<Props> = ({ instrumentId }) => {
  const { mainAppStore, SLTPstore } = useStores();
  const [on, toggle] = useState(false);
  const { t } = useTranslation();

  const {
    setValue,
    clearErrors,
    errors,
    getValues,
    trigger,
    watch,
  } = useFormContext<FormValues>();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
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

  const renderTPValue = (tpType: TpSlTypeEnum) => {
    const { tp } = getValues();
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

  const renderSLValue = (slType: TpSlTypeEnum) => {
    const { sl } = getValues();
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

  const { sl, tp } = watch();

  const handleApplySetAutoClose = () => {
    trigger().then(() => {
      if (!Object.keys(errors).length) {
        toggle(false);
      }
    });
  };

  useEffect(() => {
    SLTPstore.setSlType(TpSlTypeEnum.Currency);
    SLTPstore.setTpType(TpSlTypeEnum.Currency);
    SLTPstore.setInstrumentId(instrumentId);
  }, []);

  return (
    <FlexContainer position="relative" ref={wrapperRef}>
      <FlexContainer width="100%" position="relative">
        <ButtonAutoClosePurchase
          onClick={handleToggle}
          type="button"
          hasValues={hasValue(sl) || hasValue(tp)}
        >
          <FlexContainer flexDirection="column" alignItems="center">
            {!on && (hasValue(sl) || hasValue(tp)) ? (
              <FlexContainer
                alignItems="center"
                padding="0 20px 0 0"
                width="100%"
                flexWrap="wrap"
              >
                <Observer>
                  {() => (
                    <>
                      <PrimaryTextSpan
                        overflow="hidden"
                        marginRight="4px"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        title={renderTPValue(SLTPstore.tpType)}
                        color="#fffccc"
                        fontSize="14px"
                      >
                        {renderTPValue(SLTPstore.tpType)}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        title={renderSLValue(SLTPstore.slType)}
                        color="#fffccc"
                        fontSize="14px"
                      >
                        {renderSLValue(SLTPstore.slType)}
                      </PrimaryTextSpan>
                    </>
                  )}
                </Observer>
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
        <SetAutoclose toggle={toggle} isActive={on}>
          <ButtonApply type="button" onClick={handleApplySetAutoClose}>
            {t('Apply')}
          </ButtonApply>
        </SetAutoclose>
      </FlexContainer>
    </FlexContainer>
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
