import React, { useRef, useEffect, FC, useState, useCallback } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconShevronBuy from '../../assets/svg/icon-buy-sell-shevron-buy.svg';
import IconShevronSell from '../../assets/svg/icon-buy-sell-shevron-sell.svg';
import AutoClosePopup from './AutoClosePopup';
import * as yup from 'yup';
import { InstrumentModelWSDTO } from '../../types/InstrumentsTypes';
import { AskBidEnum } from '../../enums/AskBid';
import API from '../../helpers/API';
import InformationPopup from '../InformationPopup';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import Fields from '../../constants/fields';
import { useStores } from '../../hooks/useStores';
import ColorsPallete from '../../styles/colorPallete';
import ErropPopup from '../ErropPopup';
import MultiplierDropdown from './MultiplierDropdown';
import InvestAmountDropdown from './InvestAmountDropdown';
import { getProcessId } from '../../helpers/getProcessId';
import ConfirmationPopup from './ConfirmationPopup';
import { keyframes } from '@emotion/core';
import { OperationApiResponseCodes } from '../../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../../constants/apiResponseCodeMessages';
import { Observer } from 'mobx-react-lite';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import BadRequestPopup from '../BadRequestPopup';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import { useTranslation } from 'react-i18next';
import mixapanelProps from '../../constants/mixpanelProps';
import mixpanelValues from '../../constants/mixpanelValues';
import KeysInApi from '../../constants/keysInApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  FormValues,
  OpenPendingOrder,
  OpenPositionModel,
} from '../../types/Positions';
import hasValue from '../../helpers/hasValue';
import setValueAsNullIfEmpty from '../../helpers/setValueAsNullIfEmpty';
import OpenPricePopup from './OpenPricePopup';

// TODO: too much code, refactor

const PRECISION_USD = 2;
const DEFAULT_INVEST_AMOUNT_LIVE = 50;
const DEFAULT_INVEST_AMOUNT_DEMO = 1000;
const MAX_INPUT_VALUE = 9999999.99;

interface Props {
  instrument: InstrumentModelWSDTO;
}

const BuySellPanel: FC<Props> = ({ instrument }) => {
  const {
    quotesStore,
    notificationStore,
    mainAppStore,
    badRequestPopupStore,
    markersOnChartStore,
    instrumentsStore,
    SLTPstore,
  } = useStores();

  const { t } = useTranslation();

  const setAutoCloseWrapperRef = useRef<HTMLDivElement>(null);

  const [isLoading, setLoading] = useState(true);
  const [operation, setOperation] = useState<AskBidEnum | null>(null);
  const [multiplier, setMultiplier] = useState(instrument.multiplier[0]);

  const currentPriceAsk = useCallback(
    () => quotesStore.quotes[instrument.id].ask.c,
    [quotesStore.quotes[instrument.id].ask.c]
  );
  const currentPriceBid = useCallback(
    () => quotesStore.quotes[instrument.id].bid.c,
    [quotesStore.quotes[instrument.id].bid.c]
  );

  const validationSchema = useCallback(
    () =>
      yup.object().shape<FormValues>({
        investmentAmount: yup
          .number()
          .test(
            Fields.INVEST_AMOUNT,
            `${t('Insufficient funds to open a position. You have only')} $${
              mainAppStore.activeAccount?.balance
            }`,
            (value) => {
              if (value) {
                return value <= (mainAppStore.activeAccount?.balance || 0);
              }
              return true;
            }
          )
          .test(
            Fields.INVEST_AMOUNT,
            `${t('Minimum trade volume')} $${
              instrument.minOperationVolume
            }. ${t('Please increase your trade amount or multiplier')}.`,
            function (value) {
              if (value) {
                return value >= instrument.minOperationVolume / multiplier;
              }
              return true;
            }
          )
          .test(
            Fields.INVEST_AMOUNT,
            `${t('Maximum trade volume')} $${
              instrument.maxOperationVolume
            }. ${t('Please decrease your trade amount or multiplier')}.`,
            function (value) {
              if (value) {
                return value <= instrument.maxOperationVolume / multiplier;
              }
              return true;
            }
          )
          .required(t('Please fill Invest amount')),
        tp: yup
          .number()
          .test(
            Fields.TAKE_PROFIT,
            t('Take Profit can not be zero'),
            (value) => {
              return value !== 0 || value === null;
            }
          )
          .test(
            Fields.TAKE_PROFIT,
            `${t('Error message')}: ${t(
              'This level is higher or lower than the one currently allowed'
            )}`,
            (value) => {
              if (!hasValue(value)) {
                return true;
              }
              if (SLTPstore.tpType === TpSlTypeEnum.Price) {
                switch (operation) {
                  case AskBidEnum.Buy:
                    return value > currentPriceAsk();
                  case AskBidEnum.Sell:
                    return value < currentPriceBid();

                  default:
                    return true;
                }
              }

              return true;
            }
          ),

        sl: yup
          .number()
          .test(Fields.STOP_LOSS, t('Stop Loss can not be zero'), (value) => {
            return value !== 0 || value === null;
          })
          .test(
            Fields.STOP_LOSS,
            `${t('Error message')}: ${t(
              'This level is higher or lower than the one currently allowed'
            )}`,
            (value) => {
              if (!hasValue(value)) {
                return true;
              }
              if (SLTPstore.slType === TpSlTypeEnum.Price) {
                switch (operation) {
                  case AskBidEnum.Buy:
                    return value < currentPriceAsk();
                  case AskBidEnum.Sell:
                    return value > currentPriceBid();

                  default:
                    return true;
                }
              }

              return true;
            }
          ),
        openPrice: yup.number(),
        isToppingUpActive: yup.boolean().required(),
      }),
    [
      instrument,
      currentPriceBid,
      currentPriceAsk,
      mainAppStore.activeAccount,
      operation,
      SLTPstore.slType,
      SLTPstore.tpType,
      multiplier,
    ]
  );

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (values) => {
      let availableBalance = mainAppStore.activeAccount?.balance || 0;

      if (values.openPrice) {
        const modelToSubmit: OpenPendingOrder = {
          ...values,
          tp: values.tp ?? null,
          sl: values.sl ?? null,
          operation: operation ?? AskBidEnum.Buy,
          openPrice: values.openPrice || 0,
          investmentAmount: values.investmentAmount,
          tpType: hasValue(values.tp) ? SLTPstore.tpType : null,
          slType: hasValue(values.sl) ? SLTPstore.slType : null,
          accountId: mainAppStore.activeAccountId,
          instrumentId: instrument.id,
          processId: getProcessId(),
          multiplier,
          isToppingUpActive: values.isToppingUpActive,
        };
        try {
          const response = await API.openPendingOrder(modelToSubmit);

          notificationStore.setNotification(
            t(apiResponseCodeMessages[response.result])
          );
          notificationStore.setIsSuccessfull(
            response.result === OperationApiResponseCodes.Ok
          );
          notificationStore.openNotification();

          if (response.result === OperationApiResponseCodes.Ok) {
            reset();
            setOperation(null);
            setValue('investmentAmount', values.investmentAmount);
            SLTPstore.setSlType(TpSlTypeEnum.Currency);
            SLTPstore.setTpType(TpSlTypeEnum.Currency);
            API.setKeyValue({
              key: mainAppStore.activeAccount?.isLive
                ? KeysInApi.DEFAULT_INVEST_AMOUNT_REAL
                : KeysInApi.DEFAULT_INVEST_AMOUNT_DEMO,
              value: `${response.order.investmentAmount}`,
            });
            API.setKeyValue({
              key: `mult_${instrument.id.trim().toLowerCase()}`,
              value: `${
                response.order?.multiplier || modelToSubmit.multiplier
              }`,
            });
            setValue('openPrice', undefined);
            mixpanel.track(mixpanelEvents.LIMIT_ORDER, {
              [mixapanelProps.AMOUNT]: response.order.investmentAmount,
              [mixapanelProps.ACCOUNT_CURRENCY]:
                mainAppStore.activeAccount?.currency || '',
              [mixapanelProps.INSTRUMENT_ID]: response.order.instrument,
              [mixapanelProps.MULTIPLIER]:
                response.order?.multiplier || modelToSubmit.multiplier,
              [mixapanelProps.TREND]:
                response.order.operation === AskBidEnum.Buy ? 'buy' : 'sell',
              [mixapanelProps.SL_TYPE]:
                response.order.slType !== null
                  ? mixpanelValues[response.order.slType]
                  : null,
              [mixapanelProps.TP_TYPE]:
                response.order.tpType !== null
                  ? mixpanelValues[response.order.tpType]
                  : null,
              [mixapanelProps.SL_VALUE]:
                response.order.sl !== null ? Math.abs(response.order.sl) : null,
              [mixapanelProps.TP_VALUE]: response.order.tp,
              [mixapanelProps.SAVE_POSITION]: `${response.order.isToppingUpActive}`,
              [mixapanelProps.AVAILABLE_BALANCE]: availableBalance,
              [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
              [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
                ? 'real'
                : 'demo',
              [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
              [mixapanelProps.POSITION_ID]: response.order.id,
            });
          } else {
            mixpanel.track(mixpanelEvents.LIMIT_ORDER_FAILED, {
              [mixapanelProps.AMOUNT]: modelToSubmit.investmentAmount,
              [mixapanelProps.ACCOUNT_CURRENCY]:
                mainAppStore.activeAccount?.currency || '',
              [mixapanelProps.INSTRUMENT_ID]: modelToSubmit.instrumentId,
              [mixapanelProps.MULTIPLIER]: modelToSubmit.multiplier,
              [mixapanelProps.TREND]:
                modelToSubmit.operation === AskBidEnum.Buy ? 'buy' : 'sell',
              [mixapanelProps.SL_TYPE]: modelToSubmit.slType
                ? mixpanelValues[modelToSubmit.slType]
                : null,
              [mixapanelProps.TP_TYPE]:
                modelToSubmit.tpType !== null &&
                modelToSubmit.tpType !== undefined
                  ? mixpanelValues[modelToSubmit.tpType]
                  : null,
              [mixapanelProps.SL_VALUE]:
                modelToSubmit.sl !== null && modelToSubmit.sl !== undefined
                  ? Math.abs(modelToSubmit.sl)
                  : null,
              [mixapanelProps.TP_VALUE]: modelToSubmit.tp,
              [mixapanelProps.SAVE_POSITION]: `${modelToSubmit.isToppingUpActive}`,
              [mixapanelProps.AVAILABLE_BALANCE]: availableBalance,
              [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
              [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
                ? 'real'
                : 'demo',
              [mixapanelProps.ERROR_TEXT]:
                apiResponseCodeMessages[response.result],
              [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
            });
          }
        } catch (error) {
          badRequestPopupStore.openModal();
          badRequestPopupStore.setMessage(error);
        }
      } else {
        const modelToSubmit: OpenPositionModel = {
          ...values,
          tp: values.tp ?? null,
          sl: values.sl ?? null,
          operation: operation ?? AskBidEnum.Buy,
          investmentAmount: values.investmentAmount,
          tpType: hasValue(values.tp) ? SLTPstore.tpType : null,
          slType: hasValue(values.sl) ? SLTPstore.slType : null,
          accountId: mainAppStore.activeAccountId,
          instrumentId: instrument.id,
          processId: getProcessId(),
          multiplier,
          isToppingUpActive: values.isToppingUpActive,
        };
        try {
          const response = await API.openPosition(modelToSubmit);

          notificationStore.setNotification(
            t(apiResponseCodeMessages[response.result])
          );
          notificationStore.setIsSuccessfull(
            response.result === OperationApiResponseCodes.Ok
          );
          notificationStore.openNotification();

          if (response.result === OperationApiResponseCodes.Ok) {
            setOperation(null);
            markersOnChartStore.addNewMarker(response.position);
            API.setKeyValue({
              key: mainAppStore.activeAccount?.isLive
                ? KeysInApi.DEFAULT_INVEST_AMOUNT_REAL
                : KeysInApi.DEFAULT_INVEST_AMOUNT_DEMO,
              value: `${response.position.investmentAmount}`,
            });
            API.setKeyValue({
              key: `mult_${instrument.id.trim().toLowerCase()}`,
              value: `${
                response.position?.multiplier || modelToSubmit.multiplier
              }`,
            });
            reset();
            setValue('investmentAmount', values.investmentAmount);
            mixpanel.track(mixpanelEvents.MARKET_ORDER, {
              [mixapanelProps.AMOUNT]: response.position.investmentAmount,
              [mixapanelProps.ACCOUNT_CURRENCY]:
                mainAppStore.activeAccount?.currency || '',
              [mixapanelProps.INSTRUMENT_ID]: response.position.instrument,
              [mixapanelProps.MULTIPLIER]:
                response.position?.multiplier || modelToSubmit.multiplier,
              [mixapanelProps.TREND]:
                response.position.operation === AskBidEnum.Buy ? 'buy' : 'sell',
              [mixapanelProps.SL_TYPE]:
                response.position.slType !== null
                  ? mixpanelValues[response.position.slType]
                  : null,
              [mixapanelProps.TP_TYPE]:
                response.position.tpType !== null
                  ? mixpanelValues[response.position.tpType]
                  : null,
              [mixapanelProps.SL_VALUE]:
                response.position.sl !== null
                  ? Math.abs(response.position.sl)
                  : null,
              [mixapanelProps.TP_VALUE]: response.position.tp,
              [mixapanelProps.SAVE_POSITION]: `${response.position.isToppingUpActive}`,
              [mixapanelProps.AVAILABLE_BALANCE]: availableBalance,
              [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
              [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
                ? 'real'
                : 'demo',
              [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
              [mixapanelProps.POSITION_ID]: response.position.id,
            });
          } else {
            mixpanel.track(mixpanelEvents.MARKET_ORDER_FAILED, {
              [mixapanelProps.AMOUNT]: modelToSubmit.investmentAmount,
              [mixapanelProps.ACCOUNT_CURRENCY]:
                mainAppStore.activeAccount?.currency || '',
              [mixapanelProps.INSTRUMENT_ID]: modelToSubmit.instrumentId,
              [mixapanelProps.MULTIPLIER]: modelToSubmit.multiplier,
              [mixapanelProps.TREND]:
                modelToSubmit.operation === AskBidEnum.Buy ? 'buy' : 'sell',
              [mixapanelProps.SL_TYPE]:
                modelToSubmit.slType !== null &&
                modelToSubmit.slType !== undefined
                  ? mixpanelValues[modelToSubmit.slType]
                  : null,
              [mixapanelProps.TP_TYPE]:
                modelToSubmit.tpType !== null &&
                modelToSubmit.tpType !== undefined
                  ? mixpanelValues[modelToSubmit.tpType]
                  : null,
              [mixapanelProps.SL_VALUE]:
                modelToSubmit.sl !== null && modelToSubmit.sl !== undefined
                  ? Math.abs(modelToSubmit.sl)
                  : null,
              [mixapanelProps.TP_VALUE]: modelToSubmit.tp,
              [mixapanelProps.SAVE_POSITION]: `${modelToSubmit.isToppingUpActive}`,
              [mixapanelProps.AVAILABLE_BALANCE]: availableBalance,
              [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
              [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
                ? 'real'
                : 'demo',
              [mixapanelProps.ERROR_TEXT]:
                apiResponseCodeMessages[response.result],
              [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
            });
          }
        } catch (error) {
          badRequestPopupStore.openModal();
          badRequestPopupStore.setMessage(error);
        }
      }
    },
    [
      SLTPstore.tpType,
      SLTPstore.slType,
      operation,
      multiplier,
      instrument,
      mainAppStore.activeAccount,
      mainAppStore.activeAccountId,
    ]
  );

  const {
    register,
    handleSubmit,
    errors,
    setValue,
    clearErrors,
    getValues,
    reset,
    watch,
    formState,
    ...otherMethods
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema()),
    mode: 'onChange',
    defaultValues: {
      isToppingUpActive: false,
    },
  });

  const { investmentAmount, sl, isToppingUpActive } = watch();

  useEffect(() => {
    reset();
    SLTPstore.setInstrumentId(instrument.id);
    SLTPstore.setSlType(TpSlTypeEnum.Currency);
    SLTPstore.setTpType(TpSlTypeEnum.Currency);
  }, [mainAppStore.activeAccountId, instrument.id]);

  useEffect(() => {
    async function fetchDefaultInvestAmount() {
      try {
        const response: string = await API.getKeyValue(
          mainAppStore.activeAccount?.isLive
            ? KeysInApi.DEFAULT_INVEST_AMOUNT_REAL
            : KeysInApi.DEFAULT_INVEST_AMOUNT_DEMO
        );
        if (response.length > 0) {
          setValue('investmentAmount', parseFloat(response));
        } else {
          setValue(
            'investmentAmount',
            mainAppStore.activeAccount?.isLive
              ? DEFAULT_INVEST_AMOUNT_LIVE
              : DEFAULT_INVEST_AMOUNT_DEMO
          );
        }
        setLoading(false);
      } catch (error) {}
    }
    async function fetchMultiplier() {
      try {
        const response = await API.getKeyValue(
          `mult_${instrument.id.trim().toLowerCase()}`
        );
        if (response.length > 0) {
          setMultiplier(parseInt(response));
        } else {
          const realMultiplier =
            instrument.multiplier[0] ??
            instrumentsStore.instruments.find(
              (item) => item.instrumentItem.id === instrument.id
            )?.instrumentItem.multiplier[0];
          setMultiplier(realMultiplier);
        }
      } catch (error) {}
    }
    fetchMultiplier();
    fetchDefaultInvestAmount();
  }, [mainAppStore.activeAccount?.isLive, instrument]);

  const handleChangeInputAmount = (increase: boolean) => () => {
    const { investmentAmount } = getValues();
    const newValue = increase
      ? (investmentAmount + 1).toFixed(PRECISION_USD)
      : investmentAmount < 1
      ? 0
      : (investmentAmount - 1).toFixed(PRECISION_USD);

    if (newValue <= MAX_INPUT_VALUE) {
      setValue('investmentAmount', newValue);
    }
  };

  const closePopup = () => {
    setOperation(null);
  };

  const openConfirmBuyingPopup = (operationType: AskBidEnum) => () => {
    setOperation(operationType);
  };

  const [investedAmountDropdown, toggleInvestemAmountDropdown] = useState(
    false
  );
  const investAmountRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    toggleInvestemAmountDropdown(!investedAmountDropdown);
  };

  const handleClickOutside = (e: any) => {
    if (
      investAmountRef.current &&
      !investAmountRef.current.contains(e.target)
    ) {
      toggleInvestemAmountDropdown(false);
    }
  };

  // TODO: make one helper for all inputs (autoclose, price at)
  const investOnBeforeInputHandler = (e: any) => {
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
    const regex = `^[0-9]{1,7}([,.][0-9]{1,${PRECISION_USD}})?$`;
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

  const investOnFocusHandler = () => {
    clearErrors('investmentAmount');
    toggleInvestemAmountDropdown(true);
  };

  const investOnBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      // TODO: research typings
      // @ts-ignore
      !investAmountRef.current?.contains(e.relatedTarget) &&
      !getValues('investmentAmount')
    ) {
      setValue(
        'investmentAmount',
        mainAppStore.activeAccount?.isLive
          ? DEFAULT_INVEST_AMOUNT_LIVE
          : DEFAULT_INVEST_AMOUNT_DEMO
      );
    }
  };

  const handleResetError = () => {
    setOperation(null);
    clearErrors(['investmentAmount', 'openPrice']);
  };

  const challengeStopOutBySlValue = useCallback(
    (stopLoss) => {
      switch (SLTPstore.slType) {
        case TpSlTypeEnum.Currency:
          setValue(
            'isToppingUpActive',
            stopLoss >
              SLTPstore.positionStopOut(investmentAmount, instrument.id)
          );
          break;

        case TpSlTypeEnum.Price:
          if (operation !== null) {
            const soValue = SLTPstore.positionStopOutByPrice({
              instrumentId: instrument.id,
              slPrice: stopLoss,
              investmentAmount: investmentAmount,
              multiplier: multiplier,
              operation: operation,
            });
            setValue(
              'isToppingUpActive',
              soValue <= 0 &&
                Math.abs(soValue) >
                  SLTPstore.positionStopOut(investmentAmount, instrument.id)
            );
          }

          break;

        default:
          break;
      }
    },
    [SLTPstore.slType, investmentAmount]
  );
  const challengeStopOutByToppingUp = useCallback(
    (isToppingUp: boolean) => {
      switch (SLTPstore.slType) {
        case TpSlTypeEnum.Currency:
          // TODO: think refactor
          if (
            (hasValue(sl) &&
              sl > SLTPstore.positionStopOut(investmentAmount, instrument.id) &&
              !isToppingUp) ||
            (hasValue(sl) &&
              sl <=
                SLTPstore.positionStopOut(investmentAmount, instrument.id) &&
              isToppingUp)
          ) {
            setValue('sl', undefined);
          }
          break;

        case TpSlTypeEnum.Price:
          if (operation !== null) {
            const soValue = SLTPstore.positionStopOutByPrice({
              instrumentId: instrument.id,
              slPrice: sl || 0,
              investmentAmount: investmentAmount,
              multiplier: multiplier,
              operation: operation,
            });
            if (isToppingUp) {
              if (
                soValue <= 0 &&
                Math.abs(soValue) >
                  SLTPstore.positionStopOut(investmentAmount, instrument.id)
              ) {
                setValue('sl', undefined);
              }
            } else {
              if (
                soValue <= 0 &&
                Math.abs(soValue) <=
                  SLTPstore.positionStopOut(investmentAmount, instrument.id)
              ) {
                setValue('sl', undefined);
              }
            }
          }

          break;

        default:
          break;
      }
    },
    [SLTPstore.slType, sl, investmentAmount]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onKeyDown = (keyEvent: any) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  useEffect(() => {
    if (hasValue(sl)) {
      challengeStopOutBySlValue(sl!);
    }
  }, [sl]);

  useEffect(() => {
    if (hasValue(isToppingUpActive)) {
      challengeStopOutByToppingUp(isToppingUpActive);
    }
  }, [isToppingUpActive]);

  const methods = {
    watch,
    register,
    handleSubmit,
    errors,
    setValue,
    clearErrors,
    getValues,
    reset,
    formState,
    ...otherMethods,
  };

  return (
    <FlexContainer padding="16px" flexDirection="column">
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>
      <FormProvider {...methods}>
        <CustomForm
          autoComplete="off"
          id="buySellForm"
          name="buySellForm"
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={onKeyDown}
        >
          <FlexContainer
            justifyContent="space-between"
            flexWrap="wrap"
            margin="0 0 4px 0"
            alignItems="center"
          >
            <PrimaryTextSpan
              fontSize="11px"
              lineHeight="12px"
              textTransform="uppercase"
              color="rgba(255, 255, 255, 0.3)"
            >
              {t('Invest')}
            </PrimaryTextSpan>
            <InformationPopup
              bgColor="#000000"
              classNameTooltip="invest"
              width="212px"
              direction="left"
            >
              <PrimaryTextSpan color="#fffccc" fontSize="12px">
                {t('The amount you’d like to invest')}
              </PrimaryTextSpan>
            </InformationPopup>
          </FlexContainer>
          <InvestedAmoutInputWrapper
            padding="0 0 0 4px"
            margin="0 0 14px 0"
            position="relative"
            alignItems="center"
            zIndex="100"
          >
            {formState.touched.investmentAmount && errors.investmentAmount && (
              <ErropPopup
                textColor="#fffccc"
                bgColor={ColorsPallete.RAZZMATAZZ}
                classNameTooltip={'investmentAmount'}
                direction="left"
              >
                {errors.investmentAmount.message}
              </ErropPopup>
            )}
            <PrimaryTextSpan fontWeight="bold" marginRight="2px">
              {mainAppStore.activeAccount?.symbol}
            </PrimaryTextSpan>

            <FlexContainer alignItems="center" ref={investAmountRef}>
              <InvestInput
                onBeforeInput={investOnBeforeInputHandler}
                onFocus={investOnFocusHandler}
                onBlur={investOnBlurHandler}
                name={Fields.INVEST_AMOUNT}
                ref={register({ setValueAs: setValueAsNullIfEmpty })}
              />
              {investedAmountDropdown && (
                <InvestAmountDropdown
                  toggle={handleToggle}
                  setFieldValue={setValue}
                />
              )}
              <PlusMinusButtonWrapper flexDirection="column">
                <PlusButton
                  type="button"
                  onClick={handleChangeInputAmount(true)}
                >
                  <PrimaryTextSpan fontWeight="bold">&#43;</PrimaryTextSpan>
                </PlusButton>
                <MinusButton
                  type="button"
                  onClick={handleChangeInputAmount(false)}
                  disabled={investmentAmount === 0}
                >
                  <PrimaryTextSpan fontWeight="bold">&minus;</PrimaryTextSpan>
                </MinusButton>
              </PlusMinusButtonWrapper>
            </FlexContainer>
          </InvestedAmoutInputWrapper>
          <FlexContainer
            justifyContent="space-between"
            flexWrap="wrap"
            margin="0 0 4px 0"
            alignItems="center"
          >
            <PrimaryTextSpan
              fontSize="11px"
              lineHeight="12px"
              textTransform="uppercase"
              color="rgba(255, 255, 255, 0.3)"
            >
              {t('Multiplier')}
            </PrimaryTextSpan>
            <InformationPopup
              bgColor="#000000"
              classNameTooltip="leverage"
              width="212px"
              direction="left"
            >
              <PrimaryTextSpan color="#fffccc" fontSize="12px">
                {t(
                  'The coefficient that multiplies the potential profit and level of risk accordingly the value of Multiplier.'
                )}
              </PrimaryTextSpan>
            </InformationPopup>
          </FlexContainer>
          <Observer>
            {() => (
              <MultiplierDropdown
                onToggle={handleResetError}
                multipliers={
                  instrumentsStore.instruments.find(
                    (item) => item.instrumentItem.id === instrument.id
                  )?.instrumentItem.multiplier || instrument.multiplier
                }
                selectedMultiplier={multiplier}
                setMultiplier={setMultiplier}
              ></MultiplierDropdown>
            )}
          </Observer>
          <FlexContainer
            justifyContent="space-between"
            flexWrap="wrap"
            margin="0 0 4px 0"
            alignItems="center"
          >
            <PrimaryTextSpan
              fontSize="11px"
              lineHeight="12px"
              textTransform="uppercase"
              color="rgba(255, 255, 255, 0.3)"
            >
              {t('Autoclose')}
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
          <FlexContainer position="relative" flexDirection="column">
            <AutoClosePopup instrumentId={instrument.id}>
              <>
                {((formState.touched.sl && errors.sl) ||
                  (formState.touched.tp && errors.tp)) && (
                  <ErropPopup
                    textColor="#fffccc"
                    bgColor={ColorsPallete.RAZZMATAZZ}
                    classNameTooltip="investmentAmount"
                    direction="left"
                  >
                    {errors.sl?.message || errors.tp?.message}
                  </ErropPopup>
                )}
              </>
            </AutoClosePopup>
          </FlexContainer>

          <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
            <PrimaryTextSpan
              fontSize="11px"
              lineHeight="12px"
              textTransform="uppercase"
              color="rgba(255, 255, 255, 0.3)"
            >
              {t('Volume')}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              fontSize="12px"
              color={isLoading ? '#fffccc00' : '#fffccc'}
            >
              {mainAppStore.activeAccount?.symbol}
              {(investmentAmount * multiplier).toFixed(PRECISION_USD)}
            </PrimaryTextSpan>
          </FlexContainer>
          <FlexContainer justifyContent="space-between" margin="0 0 12px 0">
            <PrimaryTextSpan
              fontSize="11px"
              lineHeight="12px"
              textTransform="uppercase"
              color="rgba(255, 255, 255, 0.3)"
            >
              {t('Spread')}
            </PrimaryTextSpan>
            <Observer>
              {() => (
                <>
                  {quotesStore.quotes[instrument.id] && (
                    <PrimaryTextSpan fontSize="12px" color="#fffccc">
                      {Math.abs(
                        quotesStore.quotes[instrument.id].bid.c -
                          quotesStore.quotes[instrument.id].ask.c
                      ).toFixed(instrument.digits)}
                    </PrimaryTextSpan>
                  )}
                </>
              )}
            </Observer>
          </FlexContainer>
          <FlexContainer flexDirection="column" position="relative">
            <ConfirmPopupWrapper
              position="absolute"
              right="100%"
              top="0px"
              visibilityProp={hasValue(operation) ? 'visible' : 'hidden'}
            >
              <ConfirmationPopup
                closePopup={closePopup}
                digits={instrument.digits}
                instrumentId={instrument.id}
                disabled={formState.isSubmitting}
                investmentAmount={getValues(Fields.INVEST_AMOUNT)}
                multiplier={multiplier}
                operation={operation}
                //  handleSubmit={handleSubmit(onSubmit)}
              ></ConfirmationPopup>
            </ConfirmPopupWrapper>
            <ButtonBuy
              type="button"
              onClick={openConfirmBuyingPopup(AskBidEnum.Buy)}
            >
              <FlexContainer margin="0 8px 0 0">
                <SvgIcon {...IconShevronBuy} fillColor="#003A38"></SvgIcon>
              </FlexContainer>
              {t('Buy')}
            </ButtonBuy>
            <ButtonSell
              type="button"
              onClick={openConfirmBuyingPopup(AskBidEnum.Sell)}
            >
              <FlexContainer margin="0 8px 0 0">
                <SvgIcon {...IconShevronSell} fillColor="#fff"></SvgIcon>
              </FlexContainer>
              {t('Sell')}
            </ButtonSell>
          </FlexContainer>
          <FlexContainer
            justifyContent="space-between"
            flexWrap="wrap"
            margin="0 0 4px 0"
          >
            <PrimaryTextSpan
              fontSize="11px"
              lineHeight="12px"
              textTransform="uppercase"
              color="rgba(255, 255, 255, 0.3)"
            >
              {t('Purchase at')}
            </PrimaryTextSpan>
            <InformationPopup
              bgColor="#000000"
              classNameTooltip="purchase-at"
              width="212px"
              direction="left"
            >
              <PrimaryTextSpan color="#fffccc" fontSize="12px">
                {t(
                  'Position will be opened automatically when the price reaches this level.'
                )}
              </PrimaryTextSpan>
            </InformationPopup>
          </FlexContainer>
          <OpenPricePopup
            digits={instrument.digits}
            instrumentId={instrument.id}
          ></OpenPricePopup>
        </CustomForm>
      </FormProvider>
    </FlexContainer>
  );
};

export default BuySellPanel;

const InvestInput = styled.input`
  width: calc(100% - 27px);
  outline: none;
  border: none;
  background-color: transparent;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #fffccc;
`;

const ButtonSell = styled(ButtonWithoutStyles)`
  background-color: #ed145b;
  border-radius: 4px;
  height: 56px;
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 18px;
  transition: background-color 0.2s ease;
  will-change: background-color;

  &:hover {
    background-color: #ff557e;
  }

  &:focus {
    background-color: #bd1d51;
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

const ButtonBuy = styled(ButtonSell)`
  background-color: #00ffdd;
  box-shadow: 0px 4px 8px rgba(0, 255, 242, 0.17),
    inset 0px -3px 6px rgba(0, 255, 242, 0.26);
  color: #003a38;
  margin-bottom: 8px;

  &:hover {
    background-color: #9ffff2;
  }

  &:focus {
    background-color: #21b3a4;
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

const CustomForm = styled.form`
  margin: 0;
`;

const InvestedAmoutInputWrapper = styled(FlexContainer)`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.06);

  &:focus-within {
    border: 1px solid #21b3a4;
  }
`;

const MinusButton = styled(ButtonWithoutStyles)`
  display: flex;
  width: 26px;
  height: 19px;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
`;

const PlusButton = styled(MinusButton)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PlusMinusButtonWrapper = styled(FlexContainer)`
  border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

const fadein = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const ConfirmPopupWrapper = styled(FlexContainer)`
  animation: ${fadein} 0.2s ease forwards;

  @media (max-height: 700px) {
    top: -40px;
  }
`;
