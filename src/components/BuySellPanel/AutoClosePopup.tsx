import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
} from '../../styles/TextsElements';
import Fields from '../../constants/fields';
import { OpenPositionModelFormik } from '../../types/Positions';
import { useStores } from '../../hooks/useStores';
import SetAutoclose from './SetAutoclose';
import IconClose from '../../assets/svg/icon-close.svg';
import { SecondaryButton } from '../../styles/Buttons';
import SvgIcon from '../SvgIcon';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';

interface Props {
  setFieldValue: (field: any, value: any) => void;
  setFieldError: (field: any, value: any) => void;
  values: OpenPositionModelFormik;
}

function AutoClosePopup(props: Props) {
  const { setFieldValue, values, setFieldError } = props;
  const { SLTPStore, mainAppStore } = useStores();
  const [on, toggle] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleToggle = () => {
    setFieldError(Fields.STOP_LOSS, '');
    setFieldError(Fields.TAKE_PROFIT, '');
    toggle(!on);
  };

  const handleApply = () => {
    setFieldValue(Fields.TAKE_PROFIT, +SLTPStore.takeProfitValue || null);
    setFieldValue(Fields.STOP_LOSS, +SLTPStore.stopLossValue || null);
    setFieldValue(
      Fields.TAKE_PROFIT_TYPE,
      SLTPStore.takeProfitValue ? SLTPStore.autoCloseTPType : null
    );
    setFieldValue(
      Fields.STOP_LOSS_TYPE,
      SLTPStore.stopLossValue ? SLTPStore.autoCloseSLType : null
    );

    return Promise.resolve();
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  const clearSLTP = () => {
    setFieldValue(Fields.TAKE_PROFIT, null);
    setFieldValue(Fields.STOP_LOSS, null);
    setFieldValue(Fields.TAKE_PROFIT_TYPE, null);
    setFieldValue(Fields.STOP_LOSS_TYPE, null);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderTPValue = () => {
    return `+${
      values.tp !== null
        ? `${
            values.tpType === TpSlTypeEnum.Currency
              ? mainAppStore.activeAccount?.symbol
              : ''
          }${values.tp}`
        : 'Non Set'
    }`;
  };

  const renderSLValue = () => {
    return `—${
      values.sl !== null
        ? `${
            values.slType === TpSlTypeEnum.Currency
              ? mainAppStore.activeAccount?.symbol
              : ''
          }${values.sl}`
        : 'Non Set'
    }`;
  };

  return (
    <FlexContainer position="relative" ref={wrapperRef}>
      <FlexContainer width="100%" position="relative">
        <ButtonAutoClosePurchase
          onClick={handleToggle}
          type="button"
          hasValues={!!(values.sl || values.tp)}
        >
          <FlexContainer flexDirection="column">
            {values.sl || values.tp ? (
              <FlexContainer
                justifyContent="space-between"
                alignItems="center"
                padding="0 20px 0 0"
                width="100%"
              >
                <PrimaryTextSpan color="#fffccc" fontSize="14px">
                  {renderTPValue()}
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="14px">
                  {renderSLValue()}
                </PrimaryTextSpan>
              </FlexContainer>
            ) : (
              <PrimaryTextParagraph color="#fffccc" fontSize="14px">
                Set
              </PrimaryTextParagraph>
            )}
          </FlexContainer>
        </ButtonAutoClosePurchase>
        {!!(values.sl || values.tp) && (
          <ClearSLTPButton type="button" onClick={clearSLTP}>
            <SvgIcon
              {...IconClose}
              fillColor="rgba(255,255,255,0.4)"
              hoverFillColor="#00FFDD"
            />
          </ClearSLTPButton>
        )}
      </FlexContainer>
      {on && (
        <FlexContainer position="absolute" top="20px" right="100%">
          <SetAutoclose
            handleApply={handleApply}
            stopLossValue={values.sl}
            takeProfitValue={values.tp}
            stopLossType={values.slType}
            takeProfitType={values.tpType}
            operation={values.operation}
            toggle={toggle}
            investedAmount={+values.investmentAmount}
          />
        </FlexContainer>
      )}
    </FlexContainer>
  );
}

export default AutoClosePopup;

const ButtonAutoClosePurchase = styled(SecondaryButton)<{
  hasValues?: boolean;
}>`
  height: 40px;
  width: 100%;
  margin-bottom: 14px;
  text-align: ${props => props.hasValues && 'left'};
  border: ${props => props.hasValues && '1px solid rgba(255, 255, 255, 0.1)'};
  background-color: ${props => props.hasValues && 'rgba(255, 255, 255, 0.06)'};
`;

const ClearSLTPButton = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 12px;
  right: 12px;
`;
