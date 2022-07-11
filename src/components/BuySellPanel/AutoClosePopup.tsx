import React, { useState, useRef, useEffect, FC, useCallback } from 'react';
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
import { observer, Observer } from 'mobx-react-lite';
import Colors from '../../constants/Colors';

interface Props {
  instrumentId: string;
  amount?: number;
}

const AutoClosePopup: FC<Props> = observer(({ instrumentId, amount, children }) => {
  const { mainAppStore, SLTPstore } = useStores();
  const [on, toggle] = useState(false);
  const { t } = useTranslation();

  const {
    setValue,
    clearErrors,
    getValues,
    trigger,
    watch,
    formState,
    reset,
  } = useFormContext<FormValues>();
  const valuesWatch = watch();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    toggle(!on);
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      e.preventDefault();
      let { sl, tp, ...otherValues } = valuesWatch;
      const isTpExist = !!formState.dirtyFields.tp && formState.touched.tp;
      const isSlExist = !!formState.dirtyFields.sl && formState.touched.sl;
      reset(otherValues, { dirtyFields: true, touched: true, isDirty: true });
      if (isTpExist) {
        setValue('tp', tp, {
          shouldDirty: true,
        });
      }
      if (isSlExist) {
        setValue('sl', sl, {
          shouldDirty: true,
        });
      }

      handleClose();
      const tmp = document.createElement('input');
      document.body.appendChild(tmp);
      tmp.focus();
      document.body.removeChild(tmp);
    }
  };

  const clearSLTP = (setValue: any) => () => {
    setValue('tp', undefined);
    setValue('sl', undefined);
    SLTPstore.setTpTypeNewOrder(TpSlTypeEnum.Currency);
    SLTPstore.setSlTypeNewOrder(TpSlTypeEnum.Currency);
    clearErrors();
  };

  const handleClose = () => {
    toggle(false);
  };

  useEffect(() => {
    if (on) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [on]);

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

  const handleApplySetAutoClose = () => {
    trigger(['sl', 'tp']).then((isValid) => {
      if (isValid) {
        toggle(false);
      }
    });
  };

  const resetValues = useCallback(() => {
    if (!hasValue(valuesWatch.sl)) {
      SLTPstore.setSlTypeNewOrder(TpSlTypeEnum.Currency);
    }

    if (!hasValue(valuesWatch.tp)) {
      SLTPstore.setTpTypeNewOrder(TpSlTypeEnum.Currency);
    }
  }, [valuesWatch]);

  useEffect(() => {
    if (on) {
      resetValues();
      SLTPstore.setInstrumentIdNewOrder(instrumentId);
    }
  }, [on]);

  return (
    <>
      {!on && children}
      <FlexContainer position="relative">
        <FlexContainer width="100%" position="relative">
          <ButtonAutoClosePurchase
            onMouseDown={handleToggle}
            type="button"
            hasValues={hasValue(valuesWatch.sl) || hasValue(valuesWatch.tp)}
          >
            <FlexContainer flexDirection="column" alignItems="center">
              {!on && (hasValue(valuesWatch.sl) || hasValue(valuesWatch.tp)) ? (
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
                          title={renderTPValue(SLTPstore.tpTypeNewOrder)}
                          color={Colors.ACCENT}
                          fontSize="14px"
                        >
                          {renderTPValue(SLTPstore.tpTypeNewOrder)}
                        </PrimaryTextSpan>
                        <PrimaryTextSpan
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          title={renderSLValue(SLTPstore.slTypeNewOrder)}
                          color={Colors.ACCENT}
                          fontSize="14px"
                        >
                          {renderSLValue(SLTPstore.slTypeNewOrder)}
                        </PrimaryTextSpan>
                      </>
                    )}
                  </Observer>
                </FlexContainer>
              ) : (
                <PrimaryTextParagraph color={Colors.ACCENT} fontSize="14px">
                  {t('Set')}
                </PrimaryTextParagraph>
              )}
            </FlexContainer>
          </ButtonAutoClosePurchase>
          {!on && (hasValue(valuesWatch.sl) || hasValue(valuesWatch.tp)) && (
            <ClearSLTPButton type="button" onClick={clearSLTP(setValue)}>
              <SvgIcon
                {...IconClose}
                fillColor={Colors.WHITE_LIGHT}
                hoverFillColor={Colors.PRIMARY}
              />
            </ClearSLTPButton>
          )}
        </FlexContainer>
        <FlexContainer
          ref={wrapperRef}
          position="absolute"
          top="20px"
          right="100%"
          visibilityProp={on ? 'visible' : 'hidden'}
        >
          <SetAutoclose toggle={toggle} isActive={on} isNewOrder={on} amount={amount}>
            <ButtonApply type="button" onClick={handleApplySetAutoClose}>
              {t('Apply')}
            </ButtonApply>
          </SetAutoclose>
        </FlexContainer>
      </FlexContainer>
    </>
  );
});

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
  background: ${Colors.PRIMARY};
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #003a38;
  height: 32px;
`;
