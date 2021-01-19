import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useCallback,
} from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
} from '../../styles/TextsElements';
import Fields from '../../constants/fields';
import {
  PositionModelWSDTO,
  OpenPositionModelFormik,
} from '../../types/Positions';
import { useStores } from '../../hooks/useStores';
import SetAutoclose from './SetAutoclose';
import IconClose from '../../assets/svg/icon-close.svg';
import { SecondaryButton } from '../../styles/Buttons';
import SvgIcon from '../SvgIcon';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import { FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';

interface Props {
  stopLossValue: PositionModelWSDTO['sl'];
  stopLossType: PositionModelWSDTO['slType'];
  takeProfitValue: PositionModelWSDTO['tp'];
  takeProfitType: PositionModelWSDTO['tpType'];
  stopLossError?: string;
  takeProfitError?: string;
  isDisabled?: boolean;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => any;
  validateForm: (
    values?: OpenPositionModelFormik | undefined
  ) => Promise<FormikErrors<OpenPositionModelFormik>>;
  setFieldError: (field: string, value: string | undefined) => void;
  opened: boolean;
  instrumentId: string;
  investAmount?: number;
  onToggle?: (arg0: boolean) => void;
}
const noop = () => {}
const AutoClosePopup = forwardRef<HTMLDivElement, Props>(
  (props, setAutocloseRef) => {
    const {
      stopLossValue,
      stopLossType,
      takeProfitValue,
      takeProfitType,
      setFieldValue,
      stopLossError,
      takeProfitError,
      validateForm,
      setFieldError,
      opened,
      instrumentId,
      investAmount,
      onToggle = noop
    } = props;
    const { mainAppStore, SLTPStore } = useStores();
    const [on, toggle] = useState(false);
    const { t } = useTranslation();

    const wrapperRef = useRef<HTMLDivElement>(null);
    const handleToggle = () => {
      if (!on) {
        setFieldError(Fields.TAKE_PROFIT, '');
        setFieldError(Fields.STOP_LOSS, '');
      }
      onToggle(!on);
      SLTPStore.toggleBuySell(!on);
    };

    const handleClickOutside = (e: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        handleClose();
      }
    };

    const clearSLTP = async () => {
      await setFieldValue(Fields.TAKE_PROFIT, null);
      await setFieldValue(Fields.STOP_LOSS, null);
      await setFieldValue(Fields.TAKE_PROFIT_TYPE, null);
      await setFieldValue(Fields.STOP_LOSS_TYPE, null);
      await validateForm();
    };

    const handleClose = () => {
      SLTPStore.toggleBuySell(false);
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    useEffect(() => {
      toggle(SLTPStore.openedBuySell);
    }, [opened]);

    const handleApplySetAutoClose = useCallback(async () => {
      await setFieldValue(
        Fields.TAKE_PROFIT_TYPE,
        SLTPStore.takeProfitValue ? SLTPStore.autoCloseTPType : null
      );
      await setFieldValue(
        Fields.STOP_LOSS_TYPE,
        SLTPStore.stopLossValue ? SLTPStore.autoCloseSLType : null
      );
      await setFieldValue(
        Fields.TAKE_PROFIT,
        SLTPStore.takeProfitValue === '' ? null : +SLTPStore.takeProfitValue
      );
      await setFieldValue(Fields.STOP_LOSS, SLTPStore.stopLossValue === '' ? null : SLTPStore.stopLossValue);
      SLTPStore.toggleBuySell(false);
      return new Promise<void>(async (resolve, reject) => {
        const errors = await validateForm();
        if (!Object.keys(errors).length) {
          resolve();
        } else {
          reject();
        }
      });
    }, [SLTPStore.takeProfitValue, SLTPStore.stopLossValue]);

    const renderTPValue = () => {
      return `+${
        takeProfitValue !== null
          ? `${
              takeProfitType === TpSlTypeEnum.Currency
                ? mainAppStore.activeAccount?.symbol
                : ''
            }${takeProfitValue}`
          : t('Non Set')
      }`;
    };

    const renderSLValue = () => {
      return `—${
        stopLossValue !== null
          ? `${
              stopLossType === TpSlTypeEnum.Currency
                ? mainAppStore.activeAccount?.symbol
                : ''
            }${stopLossValue}`
          : t('Non Set')
      }`;
    };
    const removeSL = () => {
      SLTPStore.stopLossValue = '';
      setFieldValue(Fields.STOP_LOSS, null);
    };

    const removeTP = () => {
      SLTPStore.takeProfitValue = '';
      setFieldValue(Fields.TAKE_PROFIT, null);
    };

    return (
      <FlexContainer position="relative" ref={wrapperRef}>
        <FlexContainer width="100%" position="relative">
          <ButtonAutoClosePurchase
            onClick={handleToggle}
            type="button"
            hasValues={!!(stopLossValue || takeProfitValue)}
          >
            <FlexContainer flexDirection="column">
              {stopLossValue || takeProfitValue ? (
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
                    title={renderTPValue()}
                    color="#fffccc"
                    fontSize="14px"
                  >
                    {renderTPValue()}
                  </PrimaryTextSpan>
                  <PrimaryTextSpan
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    title={renderSLValue()}
                    color="#fffccc"
                    fontSize="14px"
                  >
                    {renderSLValue()}
                  </PrimaryTextSpan>
                </FlexContainer>
              ) : (
                <PrimaryTextParagraph color="#fffccc" fontSize="14px">
                  {t('Set')}
                </PrimaryTextParagraph>
              )}
            </FlexContainer>
          </ButtonAutoClosePurchase>
          {!!(stopLossValue || takeProfitValue) && (
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
          <FlexContainer
            position="absolute"
            top="20px"
            right="100%"
            ref={setAutocloseRef}
          >
            <SetAutoclose
              handleApply={handleApplySetAutoClose}
              stopLossValue={stopLossValue}
              takeProfitValue={takeProfitValue}
              stopLossType={stopLossType}
              takeProfitType={takeProfitType}
              slError={stopLossError}
              tpError={takeProfitError}
              toggle={SLTPStore.toggleBuySell}
              removeSL={removeSL}
              removeTP={removeTP}
              instrumentId={instrumentId}
              investAmount={investAmount}
            />
          </FlexContainer>
        )}
      </FlexContainer>
    );
  }
);

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
