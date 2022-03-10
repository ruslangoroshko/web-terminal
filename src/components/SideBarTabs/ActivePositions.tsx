import React, { FC, useCallback, useEffect, useRef } from 'react';
import * as yup from 'yup';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { AskBidEnum } from '../../enums/AskBid';
import SvgIcon from '../SvgIcon';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import { useStores } from '../../hooks/useStores';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import API from '../../helpers/API';
import {
  FormValues,
  PositionModelWSDTO,
  UpdateSLTP,
} from '../../types/Positions';
import { getProcessId } from '../../helpers/getProcessId';
import moment from 'moment';
import InformationPopup from '../InformationPopup';
import AutoClosePopupSideBar from './AutoClosePopupSideBar';
import { getNumberSign } from '../../helpers/getNumberSign';
import ClosePositionPopup from './ClosePositionPopup';
import ImageContainer from '../ImageContainer';
import Fields from '../../constants/fields';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import ErropPopup from '../ErropPopup';
import ColorsPallete from '../../styles/colorPallete';
import { useTranslation } from 'react-i18next';
import useInstrumentPrecision from '../../hooks/useInstrumentPrecision';
import apiResponseCodeMessages from '../../constants/apiResponseCodeMessages';
import { OperationApiResponseCodes } from '../../enums/OperationApiResponseCodes';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import mixapanelProps from '../../constants/mixpanelProps';
import EquityPnL from './EquityPnL';
import ActivePositionPnL from './ActivePositionPnL';
import ActivePositionPnLPercent from './ActivePositionPnLPercent';
import { IOrderLineAdapter } from '../../vendor/charting_library/charting_library';
import { autorun } from 'mobx';
import { Observer } from 'mobx-react-lite';
import mixpanelValues from '../../constants/mixpanelValues';
import { LOCAL_POSITION, LOCAL_POSITION_SORT } from '../../constants/global';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import hasValue from '../../helpers/hasValue';
import ActivePositionToppingUp from '../ActivePositionToppingUp';
import { SortByProfitEnum } from '../../enums/SortByProfitEnum';
import IconShield from '../../assets/svg/icon-shield.svg';

interface Props {
  position: PositionModelWSDTO;
  ready: boolean;
  needScroll?: boolean;
}

const ActivePositionsPortfolioTab: FC<Props> = ({
  position,
  ready,
  needScroll,
}) => {
  const isBuy = position.operation === AskBidEnum.Buy;

  const instrumentRef = useRef<HTMLDivElement>(document.createElement('div'));
  const clickableWrapper = useRef<HTMLDivElement>(null);
  const tooltipWrapperRef = useRef<HTMLDivElement>(null);

  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const {
    quotesStore,
    mainAppStore,
    badRequestPopupStore,
    instrumentsStore,
    notificationStore,
    markersOnChartStore,
    tradingViewStore,
    SLTPstore,
    sortingStore,
  } = useStores();

  const { t } = useTranslation();
  const { precision } = useInstrumentPrecision(position.instrument);

  const currentPriceAsk = useCallback(
    () =>
      quotesStore.quotes[position.instrument]
        ? quotesStore.quotes[position.instrument].ask.c
        : 0,
    [quotesStore.quotes[position.instrument], position.instrument]
  );

  const currentPriceBid = useCallback(
    () =>
      quotesStore.quotes[position.instrument]
        ? quotesStore.quotes[position.instrument].bid.c
        : 0,
    [quotesStore.quotes[position.instrument], position.instrument]
  );

  const PnL = useCallback(
    () =>
      calculateFloatingProfitAndLoss({
        investment: position.investmentAmount,
        multiplier: position.multiplier,
        costs: position.swap + position.commission,
        side: isBuy ? 1 : -1,
        currentPrice: isBuy ? currentPriceBid() : currentPriceAsk(),
        openPrice: position.openPrice,
      }),
    [currentPriceBid, currentPriceAsk, position]
  );

  const validationSchema = useCallback(
    () =>
      yup.object().shape<FormValues>({
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
            t('Take profit level should be higher than the current P/L'),
            (value) => {
              if (!hasValue(value)) {
                return true;
              }
              if (SLTPstore.tpType === TpSlTypeEnum.Currency) {
                return value === null || value > PnL();
              }
              return true;
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
                switch (position.operation) {
                  case AskBidEnum.Sell:
                    return value < currentPriceAsk();
                  case AskBidEnum.Buy:
                    return value > currentPriceBid();

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
                switch (position.operation) {
                  case AskBidEnum.Sell:
                    return value > currentPriceAsk();
                  case AskBidEnum.Buy:
                    return value < currentPriceBid();

                  default:
                    return true;
                }
              }

              return true;
            }
          )
          .test(
            Fields.STOP_LOSS,
            t('Stop loss level should be lower than the current P/L'),
            (value) => {
              if (!hasValue(value)) {
                return true;
              }
              if (SLTPstore.slType === TpSlTypeEnum.Currency) {
                return -1 * Math.abs(value) < PnL();
              }
              return true;
            }
          ),
        isToppingUpActive: yup.boolean(),
        investmentAmount: yup.number(),
      }),
    [
      position,
      currentPriceBid,
      currentPriceAsk,
      SLTPstore.slType,
      SLTPstore.tpType,
      PnL,
    ]
  );

  const getActualPricing = (
    value: number,
    sltp: string,
    type: TpSlTypeEnum | null
  ) => {
    if (quotesStore.selectedPosition) {
      const swap = quotesStore.selectedPosition.swap;
      const investmentAmount = quotesStore.selectedPosition.investmentAmount;
      const multiplier = quotesStore.selectedPosition.multiplier;
      const openPrice = quotesStore.selectedPosition.openPrice;
      let actualPrice: number = quotesStore.selectedPosition.openPrice;
      if (
        quotesStore.selectedPosition.operation === AskBidEnum.Buy &&
        sltp === 'tp'
      ) {
        if (type === TpSlTypeEnum.Currency) {
          const profitVolume =
            (Math.abs(value) - swap) / (investmentAmount * multiplier);
          actualPrice = openPrice + profitVolume * openPrice;
        } else {
          actualPrice = Math.abs(value);
        }
      } else if (
        quotesStore.selectedPosition.operation === AskBidEnum.Buy &&
        sltp === 'sl'
      ) {
        if (type === TpSlTypeEnum.Currency) {
          const profitVolume =
            (Math.abs(value) - swap) / (investmentAmount * multiplier);
          actualPrice = openPrice - profitVolume * openPrice;
        } else {
          actualPrice = Math.abs(value);
        }
      } else if (
        quotesStore.selectedPosition.operation === AskBidEnum.Sell &&
        sltp === 'tp'
      ) {
        if (type === TpSlTypeEnum.Currency) {
          const profitVolume =
            (Math.abs(value) - swap) / (investmentAmount * multiplier);
          actualPrice = openPrice - profitVolume * openPrice;
        } else {
          actualPrice = Math.abs(value);
        }
      } else if (
        quotesStore.selectedPosition.operation === AskBidEnum.Sell &&
        sltp === 'sl'
      ) {
        if (type === TpSlTypeEnum.Currency) {
          const profitVolume =
            (Math.abs(value) + swap) / (investmentAmount * multiplier);
          actualPrice = openPrice + profitVolume * openPrice;
        } else {
          actualPrice = Math.abs(value);
        }
      }
      return actualPrice;
    }
    return 0;
  };

  const getNewPricing = (value: number, sltp: string) => {
    if (quotesStore.selectedPosition) {
      const swap = quotesStore.selectedPosition.swap;
      const amount = quotesStore.selectedPosition.investmentAmount;
      const multiplier = quotesStore.selectedPosition.multiplier;
      const openPrice = quotesStore.selectedPosition.openPrice;
      let actualPrice: number = quotesStore.selectedPosition.openPrice;
      if (
        quotesStore.selectedPosition.operation === AskBidEnum.Buy &&
        sltp === 'tp'
      ) {
        actualPrice =
          -(1 - swap / (amount * multiplier) - value / openPrice) *
          (amount * multiplier);
      } else if (
        quotesStore.selectedPosition.operation === AskBidEnum.Buy &&
        sltp === 'sl'
      ) {
        actualPrice =
          (1 + swap / (amount * multiplier) - value / openPrice) *
          (amount * multiplier);
      } else if (
        quotesStore.selectedPosition.operation === AskBidEnum.Sell &&
        sltp === 'tp'
      ) {
        actualPrice =
          (1 - swap / (amount * multiplier) - value / openPrice) *
          (amount * multiplier);
      } else if (
        quotesStore.selectedPosition.operation === AskBidEnum.Sell &&
        sltp === 'sl'
      ) {
        actualPrice =
          -(1 + swap / (amount * multiplier) - value / openPrice) *
          (amount * multiplier);
      }
      return actualPrice;
    }
    return 0;
  };

  const closePosition = (closeFrom: string) => async () => {
    try {
      const response = await API.closePosition({
        accountId: mainAppStore.activeAccount!.id,
        positionId: position.id,
        processId: getProcessId(),
      });

      if (response.result === OperationApiResponseCodes.Ok) {
        if (
          instrumentsStore.activeInstrument?.instrumentItem.id ===
          position.instrument
        ) {
          markersOnChartStore.removeMarkerByPositionId(position.id);
        }

        mixpanel.track(mixpanelEvents.CLOSE_ORDER, {
          [mixapanelProps.AMOUNT]: response.position.investmentAmount,
          [mixapanelProps.ACCOUNT_CURRENCY]:
            mainAppStore.activeAccount?.currency || '',
          [mixapanelProps.INSTRUMENT_ID]: response.position.instrument,
          [mixapanelProps.MULTIPLIER]: response.position.multiplier,
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
          [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
          [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
            ? 'real'
            : 'demo',
          [mixapanelProps.EVENT_REF]: closeFrom,
          [mixapanelProps.POSITION_ID]: response.position.id,
        });

        notificationStore.setNotification(
          t('The order has been closed successfully')
        );
        notificationStore.setIsSuccessfull(true);
        notificationStore.openNotification();
        return Promise.resolve();
      } else {
        mixpanel.track(mixpanelEvents.CLOSE_ORDER_FAILED, {
          [mixapanelProps.AMOUNT]: position.investmentAmount,
          [mixapanelProps.ACCOUNT_CURRENCY]:
            mainAppStore.activeAccount?.currency || '',
          [mixapanelProps.INSTRUMENT_ID]: position.instrument,
          [mixapanelProps.MULTIPLIER]: position.multiplier,
          [mixapanelProps.TREND]:
            position.operation === AskBidEnum.Buy ? 'buy' : 'sell',
          [mixapanelProps.SL_TYPE]:
            position.slType !== null ? mixpanelValues[position.slType] : null,
          [mixapanelProps.TP_TYPE]:
            position.tpType !== null ? mixpanelValues[position.tpType] : null,
          [mixapanelProps.SL_VALUE]:
            position.sl !== null ? Math.abs(position.sl) : null,
          [mixapanelProps.TP_VALUE]: position.tp,
          [mixapanelProps.SAVE_POSITION]: `${position.isToppingUpActive}`,
          [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
          [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
            ? 'real'
            : 'demo',
          [mixapanelProps.ERROR_TEXT]: apiResponseCodeMessages[response.result],
          [mixapanelProps.EVENT_REF]: closeFrom,
        });
        notificationStore.setNotification(
          t(apiResponseCodeMessages[response.result])
        );
        notificationStore.setIsSuccessfull(false);
        notificationStore.openNotification();
        return Promise.reject();
      }
    } catch (error) {}
  };

  const updateSLTP = useCallback(
    async (values: FormValues) => {
      if (needReject()) {
        return false;
      }
      const valuesToSubmit: UpdateSLTP = !SLTPstore.closedByChart
        ? {
            ...values,
            sl: values.sl ?? null,
            tp: values.tp ?? null,
            slType: values.sl ? SLTPstore.slType : null,
            tpType: values.tp ? SLTPstore.tpType : null,
            instrumentId: position.instrument,
            accountId: mainAppStore.activeAccountId,
            multiplier: position.multiplier,
            operation: position.operation,
            positionId: position.id,
            investmentAmount: position.investmentAmount,
            processId: getProcessId(),
            isToppingUpActive: values.isToppingUpActive,
          }
        : {
            ...values,
            sl: values.sl ?? null,
            tp: values.tp ?? null,
            slType: values.sl ? SLTPstore.slType : null,
            tpType: values.tp ? SLTPstore.tpType : null,
            instrumentId:
              quotesStore.selectedPosition?.instrument || position.instrument,
            accountId: mainAppStore.activeAccountId,
            processId: getProcessId(),
            positionId: quotesStore.selectedPosition?.id || position.id,
            investmentAmount:
              quotesStore.selectedPosition?.investmentAmount ||
              position.investmentAmount,
            multiplier:
              quotesStore.selectedPosition?.multiplier || position.multiplier,
            operation:
              quotesStore.selectedPosition?.operation || position.operation,
            isToppingUpActive: values.isToppingUpActive,
          };

      try {
        if (
          (values.sl === position.sl || (!values.sl && !position.sl)) &&
          (values.tp === position.tp || (!values.tp && !position.tp)) &&
          values.isToppingUpActive === position.isToppingUpActive
        ) {
          return false;
        }
        const response = await API.updateSLTP(valuesToSubmit);
        if (response.result === OperationApiResponseCodes.Ok) {
          try {
            if (valuesToSubmit.isToppingUpActive !== position.isToppingUpActive)
              await API.updateToppingUp({
                processId: getProcessId(),
                accountId: valuesToSubmit.accountId,
                isToppingUpActive: valuesToSubmit.isToppingUpActive,
                positionId: valuesToSubmit.positionId,
              });
          } catch (error) {}

          if (quotesStore.selectedPosition?.id === position.id) {
            checkSL(SLTPstore.slType, valuesToSubmit.sl);
            checkTP(SLTPstore.tpType, valuesToSubmit.tp);
          }
          reset({
            investmentAmount: response.position.investmentAmount,
            isToppingUpActive: valuesToSubmit.isToppingUpActive,
            tp: response.position.tp ?? undefined,
            sl: hasValue(response.position.sl)
              ? Math.abs(response.position.sl!)
              : undefined,
          });
          position.sl = response.position.sl;
          position.slType = response.position.slType;
          position.tp = response.position.tp;
          position.tpType = response.position.tpType;
          position.isToppingUpActive = response.position.isToppingUpActive;
          SLTPstore.setTpType(
            response.position.tpType ?? TpSlTypeEnum.Currency
          );
          SLTPstore.setSlType(
            response.position.slType ?? TpSlTypeEnum.Currency
          );
          quotesStore.setSelectedPositionId(position.id);
          localStorage.setItem(LOCAL_POSITION, `${position.id}`);
          mixpanel.track(mixpanelEvents.EDIT_SLTP, {
            [mixapanelProps.AMOUNT]: response.position.investmentAmount,
            [mixapanelProps.ACCOUNT_CURRENCY]:
              mainAppStore.activeAccount?.currency || '',
            [mixapanelProps.INSTRUMENT_ID]: response.position.instrument,
            [mixapanelProps.MULTIPLIER]: response.position.multiplier,
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
            [mixapanelProps.SAVE_POSITION]: `${valuesToSubmit.isToppingUpActive}`,
            [mixapanelProps.AVAILABLE_BALANCE]:
              mainAppStore.activeAccount?.balance || 0,
            [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccountId,
            [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
              ? 'real'
              : 'demo',
            [mixapanelProps.EVENT_REF]:
              (tradingViewStore.activePopup &&
                position.id === quotesStore.selectedPositionId) ||
              SLTPstore.closedByChart
                ? mixpanelValues.CHART
                : mixpanelValues.PORTFOLIO,
            [mixapanelProps.POSITION_ID]: response.position.id,
          });
          tradingViewStore.toggleMovedPositionPopup(false);
          SLTPstore.toggleClosedByChart(false);
        } else {
          if (quotesStore.selectedPositionId === position.id) {
            checkSL(position.slType, position.sl);
            checkTP(position.tpType, position.tp);
          }
          reset();
          mixpanel.track(mixpanelEvents.EDIT_SLTP_FAILED, {
            [mixapanelProps.AMOUNT]: valuesToSubmit.investmentAmount,
            [mixapanelProps.ACCOUNT_CURRENCY]:
              mainAppStore.activeAccount?.currency || '',
            [mixapanelProps.INSTRUMENT_ID]: position.instrument,
            [mixapanelProps.MULTIPLIER]: position.multiplier,
            [mixapanelProps.TREND]:
              position.operation === AskBidEnum.Buy ? 'buy' : 'sell',
            [mixapanelProps.SL_TYPE]:
              valuesToSubmit.slType !== null
                ? mixpanelValues[valuesToSubmit.slType]
                : null,
            [mixapanelProps.TP_TYPE]:
              valuesToSubmit.tpType !== null
                ? mixpanelValues[valuesToSubmit.tpType]
                : null,
            [mixapanelProps.SL_VALUE]:
              valuesToSubmit.sl !== null ? Math.abs(valuesToSubmit.sl) : null,
            [mixapanelProps.TP_VALUE]: valuesToSubmit.tp,
            [mixapanelProps.SAVE_POSITION]: `${valuesToSubmit.isToppingUpActive}`,
            [mixapanelProps.AVAILABLE_BALANCE]:
              mainAppStore.activeAccount?.balance || 0,
            [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccountId,
            [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
              ? 'real'
              : 'demo',
            [mixapanelProps.EVENT_REF]:
              (tradingViewStore.activePopup &&
                position.id === quotesStore.selectedPositionId) ||
              SLTPstore.closedByChart
                ? mixpanelValues.CHART
                : mixpanelValues.PORTFOLIO,
          });
          notificationStore.setNotification(
            t(apiResponseCodeMessages[response.result])
          );
          notificationStore.setIsSuccessfull(false);
          notificationStore.openNotification();
        }
      } catch (error) {
      }
    },
    [
      mainAppStore.activeAccountId,
      mainAppStore.activeAccount,
      position,
      SLTPstore.slType,
      SLTPstore.tpType,
      SLTPstore.closedByChart,
      quotesStore.selectedPositionId,
    ]
  );

  const {
    errors,
    getValues,
    formState,
    setValue,
    reset,
    handleSubmit,
    watch,
    ...otherMethods
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema()),
    mode: 'onSubmit',
    defaultValues: {
      tp: position.tp ?? undefined,
      sl: hasValue(position.sl) ? Math.abs(position.sl) : undefined,
      investmentAmount: position.investmentAmount,
      isToppingUpActive: position.isToppingUpActive,
    },
  });

  const setInstrumentActive = useCallback(
    async (e: any) => {
      if (
        (clickableWrapper.current &&
          clickableWrapper.current.contains(e.target)) ||
        (tooltipWrapperRef.current &&
          tooltipWrapperRef.current.contains(e.target))
      ) {
        e.preventDefault();
      } else {
        try {
          tradingViewStore.toggleMovedPositionPopup(false);
          tradingViewStore.clearActivePositionLine();
          quotesStore.setSelectedPositionId(position.id);
          localStorage.setItem(LOCAL_POSITION, `${position.id}`);
          await instrumentsStore.switchInstrument(position.instrument);
          tradingViewStore.setActiveOrderLinePosition(
            tradingViewStore.tradingWidget
              ?.chart()
              .createOrderLine({ disableUndo: true })
              .setLineStyle(1)
              .setLineWidth(2)
              .setLineColor('rgba(73,76,81,1)')
              .setQuantity(`x${position.multiplier}`)
              .setQuantityBorderColor('#494C51')
              .setQuantityTextColor('#ffffff')
              .setQuantityBackgroundColor('#2A2C33')
              .setText(`$${position.investmentAmount}`)
              .setBodyBackgroundColor('#2A2C33')
              .setBodyTextColor('#ffffff')
              .setBodyBorderColor('#494C51')
              .setPrice(position.openPrice)
              .setLineLength(10)
          );

          tradingViewStore.setActiveOrderLinePositionPnL(
            tradingViewStore.tradingWidget
              ?.chart()
              .createOrderLine({
                disableUndo: true,
              })
              .onCancel(function (this: IOrderLineAdapter) {
                tradingViewStore.setApplyHandler(
                  closePosition(mixpanelValues.CHART),
                  true
                );
                tradingViewStore.setConfirmText(`${t('Close position')}?`);
                tradingViewStore.toggleActivePositionPopup(true);
              })
              .setCancelTooltip(t('Close position'))
              .setLineStyle(1)
              .setLineWidth(2)
              .setText(
                `${PnL() >= 0 ? '+' : '-'} $${Math.abs(PnL()).toFixed(2)}`
              )
              .setQuantity('')
              .setPrice(+position.openPrice)
              .setBodyBorderColor(PnL() > 0 ? '#00FFDD' : '#ED145B')
              .setBodyTextColor(PnL() > 0 ? '#252636' : '#ffffff')
              .setCancelButtonBackgroundColor('#2A2C33')
              .setCancelButtonBorderColor('#494C51')
              .setCancelButtonIconColor('#ffffff')
              .setBodyBackgroundColor(PnL() > 0 ? '#00FFDD' : '#ED145B')
              .setLineColor('rgba(73,76,81,1)')
              .setLineLength(10)
          );

          checkSL(position.slType, position.sl);
          checkTP(position.tpType, position.tp);
        } catch (error) {
          console.log(error);
        }
      }
    },
    [
      position,
      tradingViewStore.tradingWidget,
      instrumentsStore.instruments,
      tradingViewStore.activeOrderLinePositionPnL,
      quotesStore.selectedPosition,
      quotesStore.selectedPositionId,
    ]
  );

  const checkSL = (slType: number | null, sl: number | null) => {
    const slText: string = sl
      ? `STOP LOSS ${
          slType === TpSlTypeEnum.Price
            ? `${
                  getNumberSign(
                    getNewPricing(sl, 'sl')
                  )
                }${
                  mainAppStore.activeAccount?.symbol
                }${
                  Math.abs(getNewPricing(sl, 'sl')).toFixed(2)
                }`
            : `-${mainAppStore.activeAccount?.symbol}${Math.abs(sl)}`
        }`
      : '';
    if (sl && !tradingViewStore.activeOrderLinePositionSL) {
      tradingViewStore.setActiveOrderLinePositionSL(
        tradingViewStore.tradingWidget
          ?.chart()
          .createOrderLine({
            disableUndo: false,
          })
          .onMove(onMoveSL)
          .onCancel('', function () {
            tradingViewStore.setApplyHandler(removeSLChart);
            tradingViewStore.setConfirmText(t('Cancel Stop loss level?'));
            tradingViewStore.toggleActivePositionPopup(true);
          })
          .setCancelTooltip(t('Cancel SL'))
          .setText(slText)
          .setQuantity('')
          .setPrice(getActualPricing(sl, 'sl', slType))
          .setExtendLeft(false)
          .setBodyBorderColor('#494C51')
          .setBodyTextColor('#ffffff')
          .setCancelButtonBackgroundColor('#2A2C33')
          .setCancelButtonBorderColor('#494C51')
          .setCancelButtonIconColor('#ffffff')
          .setBodyBackgroundColor('#2A2C33')
          .setLineColor('#494C51')
          .setLineLength(10)
      );
    } else if (sl && tradingViewStore.activeOrderLinePositionSL) {
      tradingViewStore.activeOrderLinePositionSL
        .setPrice(getActualPricing(sl, 'sl', slType))
        .setText(slText);
    } else if (!sl && tradingViewStore.activeOrderLinePositionSL) {
      tradingViewStore.activeOrderLinePositionSL.remove();
      tradingViewStore.setActiveOrderLinePositionSL(undefined);
    }
  };

  const checkTP = (tpType: number | null, tp: number | null) => {
    const tpText: string = tp
      ? `TAKE PROFIT ${
          tpType === TpSlTypeEnum.Price
            ? `${getNumberSign(getNewPricing(tp, 'tp'))}${mainAppStore.activeAccount?.symbol}${Math.abs(getNewPricing(tp, 'tp')).toFixed(2)}`
            : `+${mainAppStore.activeAccount?.symbol}${Math.abs(tp)}`
        }`
      : '';
    if (tp && !tradingViewStore.activeOrderLinePositionTP) {
      tradingViewStore.setActiveOrderLinePositionTP(
        tradingViewStore.tradingWidget
          ?.chart()
          .createOrderLine({
            disableUndo: false,
          })
          .onMove(onMoveTP)
          .onCancel('', function () {
            tradingViewStore.setApplyHandler(removeTPChart);
            tradingViewStore.setConfirmText(t('Cancel Take profit level?'));
            tradingViewStore.toggleActivePositionPopup(true);
          })
          .setQuantity('')
          .setCancelTooltip(t('Cancel TP'))
          .setText(tpText)
          .setPrice(getActualPricing(tp, 'tp', tpType))
          .setExtendLeft(false)
          .setBodyBorderColor('#494C51')
          .setBodyTextColor('#ffffff')
          .setCancelButtonBackgroundColor('#2A2C33')
          .setCancelButtonBorderColor('#494C51')
          .setCancelButtonIconColor('#ffffff')
          .setBodyBackgroundColor('#2A2C33')
          .setLineColor('#494C51')
          .setLineLength(10)
      );
    } else if (tp && tradingViewStore.activeOrderLinePositionTP) {
      tradingViewStore.activeOrderLinePositionTP
        .setPrice(getActualPricing(tp, 'tp', tpType))
        .setText(tpText);
    } else if (!tp && tradingViewStore.activeOrderLinePositionTP) {
      tradingViewStore.activeOrderLinePositionTP.remove();
      tradingViewStore.setActiveOrderLinePositionTP(undefined);
    }
  };

  const onMoveSL = useCallback(async () => {
    tradingViewStore.toggleMovedPositionPopup(false);
    if (
      tradingViewStore.activeOrderLinePositionSL &&
      quotesStore.selectedPosition
    ) {
      const newPosition =
        SLTPstore.slType === TpSlTypeEnum.Currency
          ? parseFloat(
              Math.abs(
                getNewPricing(
                  tradingViewStore.activeOrderLinePositionSL?.getPrice(),
                  'sl'
                )
              ).toFixed(2)
            )
          : tradingViewStore.activeOrderLinePositionSL?.getPrice();
      tradingViewStore.toggleMovedPositionPopup(true);
      SLTPstore.toggleCloseOpenPrice(true);
      checkSL(SLTPstore.slType, newPosition);
      setValue('sl', newPosition);
    }
  }, [
    tradingViewStore.activeOrderLinePositionSL,
    quotesStore.selectedPosition,
    SLTPstore.slType,
  ]);

  const onMoveTP = useCallback(async () => {
    tradingViewStore.toggleMovedPositionPopup(false);
    if (
      tradingViewStore.activeOrderLinePositionTP &&
      quotesStore.selectedPosition
    ) {
      const newPosition =
        SLTPstore.tpType === TpSlTypeEnum.Currency
          ? parseFloat(
              Math.abs(
                getNewPricing(
                  tradingViewStore.activeOrderLinePositionTP?.getPrice(),
                  'tp'
                )
              ).toFixed(2)
            )
          : tradingViewStore.activeOrderLinePositionTP?.getPrice();
      tradingViewStore.toggleMovedPositionPopup(true);
      SLTPstore.toggleCloseOpenPrice(true);
      checkTP(SLTPstore.tpType, newPosition);
      setValue('tp', newPosition);
    }
  }, [
    tradingViewStore.activeOrderLinePositionTP,
    quotesStore.selectedPosition,
    SLTPstore.tpType,
  ]);

  const removeSLChart = useCallback(async () => {
    if (quotesStore.selectedPosition) {
      const objectToSend: FormValues = {
        tp: quotesStore.selectedPosition.tp ?? undefined,
        investmentAmount: quotesStore.selectedPosition.investmentAmount,
        isToppingUpActive: position.isToppingUpActive,
      };
      SLTPstore.toggleClosedByChart(true);
      await updateSLTP(objectToSend);
      // setValue(Fields.CLOSED_BY_CHART, true);
      tradingViewStore.activeOrderLinePositionSL?.remove();
      tradingViewStore.setActiveOrderLinePositionSL(undefined);
      removeSL();
      quotesStore.selectedPosition.sl = null;
      quotesStore.selectedPosition.slType = null;
    }
  }, [quotesStore.selectedPosition, position]);

  const removeTPChart = useCallback(async () => {
    if (quotesStore.selectedPosition) {
      const objectToSend: FormValues = {
        sl: hasValue(quotesStore.selectedPosition.sl)
          ? Math.abs(quotesStore.selectedPosition.sl!)
          : undefined,
        investmentAmount: quotesStore.selectedPosition.investmentAmount,
        isToppingUpActive: position.isToppingUpActive,
      };
      SLTPstore.toggleClosedByChart(true);
      await updateSLTP(objectToSend);
      tradingViewStore.activeOrderLinePositionTP?.remove();
      tradingViewStore.setActiveOrderLinePositionTP(undefined);
      removeTP();
      quotesStore.selectedPosition.tp = null;
      quotesStore.selectedPosition.tpType = null;
    }
  }, [quotesStore.selectedPosition]);

  const removeSL = () => {
    setValue('sl', undefined);
  };

  const removeTP = () => {
    setValue('tp', undefined);
  };

  const positionInstrument = useCallback(() => {
    return instrumentsStore.instruments.find(
      (item) => item.instrumentItem.id === position.instrument
    )?.instrumentItem;
  }, [position]);

  useEffect(() => {
    const disposer = autorun(
      () => {
        if (
          tradingViewStore.activeOrderLinePositionPnL &&
          instrumentsStore.activeInstrument &&
          quotesStore.selectedPosition &&
          quotesStore.selectedPosition.id === position.id &&
          tradingViewStore.tradingWidget &&
          quotesStore.quotes[
            instrumentsStore.activeInstrument.instrumentItem.id
          ]
        ) {
          tradingViewStore.tradingWidget?.applyOverrides({
            'scalesProperties.showSeriesLastValue': false,
            'mainSeriesProperties.showPriceLine': false,
          });

          tradingViewStore.activeOrderLinePositionPnL
            .setPrice(
              quotesStore.quotes[
                instrumentsStore.activeInstrument.instrumentItem.id
              ].bid.c
            )
            .setBodyTextColor(PnL() >= 0 ? '#252636' : '#ffffff')
            .setBodyBackgroundColor(PnL() >= 0 ? '#00FFDD' : '#ED145B')
            .setBodyBorderColor(PnL() >= 0 ? '#00FFDD' : '#ED145B')
            .setText(
              `${PnL() >= 0 ? '+' : '-'} $${Math.abs(PnL()).toFixed(2)}`
            );
        }
      },
      { delay: 100 }
    );
    const lastPosition =
      mainAppStore.paramsPortfolioActive ||
      localStorage.getItem(LOCAL_POSITION);
    if (mainAppStore.paramsPortfolioActive) {
      sortingStore.setActivePositionsSortBy(SortByProfitEnum.NewFirstAsc);
      localStorage.setItem(LOCAL_POSITION_SORT, `${SortByProfitEnum.NewFirstAsc}`);
      localStorage.setItem(LOCAL_POSITION, mainAppStore.paramsPortfolioActive);
      mainAppStore.setParamsPortfolioActive(null);
    }
    if (lastPosition && position.id === +lastPosition) {
      setTimeout(() => {
        instrumentRef.current.scrollIntoView();
      }, 0);
    }
    return () => {
      disposer();
      tradingViewStore.tradingWidget?.applyOverrides({
        'scalesProperties.showSeriesLastValue': true,
        'mainSeriesProperties.showPriceLine': true,
      });
      if (tradingViewStore.activeOrderLinePositionPnL) {
        tradingViewStore.clearActivePositionLine();
      }
    };
  }, []);

  useEffect(() => {
    if (ready) {
      const lastPosition =
        mainAppStore.paramsPortfolioActive ||
        localStorage.getItem(LOCAL_POSITION);
      if (lastPosition && position.id === +lastPosition) {
        setTimeout(() => {
          instrumentRef.current.scrollIntoView();
        }, 0);
        setInstrumentActive(false);
      }
    }
  }, [ready]);

  const { sl, tp, isToppingUpActive } = watch();

  const challengeStopOutBySlValue = useCallback(
    (stopLoss) => {
      const isBuy = position.operation === AskBidEnum.Buy;
      const direction = position.operation === AskBidEnum.Buy ? 1 : -1;

      const currentPrice = isBuy
        ? SLTPstore.getCurrentPriceBid(position.instrument)
        : SLTPstore.getCurrentPriceAsk(position.instrument);
      switch (SLTPstore.slType) {
        case TpSlTypeEnum.Currency:
          console.log(
            'positionStopOut Currency',
            SLTPstore.positionStopOut(
              position.investmentAmount,
              position.instrument
            ),
            'sl',
            stopLoss,
            'SL RATE',
            //SL Rate = Current Price + ($SL - Comission) * Сurrent Price /Invest amount *direction*multiplier
            currentPrice +
              ((stopLoss - (position.swap + position.commission)) *
                currentPrice) /
                (position.investmentAmount * direction * position.multiplier)
          );
          setValue(
            'isToppingUpActive',
            stopLoss >
              SLTPstore.positionStopOut(
                position.investmentAmount,
                position.instrument
              )
          );
          break;

        case TpSlTypeEnum.Price:
          const soValue = SLTPstore.positionStopOutByPrice({
            openPrice: position.openPrice,
            instrumentId: position.instrument,
            investmentAmount: position.investmentAmount,
            multiplier: position.multiplier,
            operation: position.operation,
            slPrice: stopLoss,
            commission: position.swap + position.commission,
          });
          console.log(
            'positionStopOut Price',
            soValue,
            'sl',
            stopLoss,
            'SL $ ',
            (stopLoss / currentPrice - 1) *
              position.investmentAmount *
              position.multiplier *
              direction +
              (position.swap + position.commission)
          );
          setValue(
            'isToppingUpActive',
            soValue <= 0 &&
              Math.abs(soValue) >
                SLTPstore.positionStopOut(
                  position.investmentAmount,
                  position.instrument
                )
          );
          break;

        default:
          break;
      }
    },
    [SLTPstore.slType, position]
  );

  const challengeStopOutByToppingUp = useCallback(
    (isToppingUp: boolean) => {
      switch (SLTPstore.slType) {
        case TpSlTypeEnum.Currency:
          // TODO: think refactor
          console.log(
            'positionStopOut Currency',
            SLTPstore.positionStopOut(
              position.investmentAmount,
              position.instrument
            ),
            'sl',
            sl
          );
          if (
            (hasValue(sl) &&
              sl >
                SLTPstore.positionStopOut(
                  position.investmentAmount,
                  position.instrument
                ) &&
              !isToppingUp) ||
            (hasValue(sl) &&
              sl <=
                SLTPstore.positionStopOut(
                  position.investmentAmount,
                  position.instrument
                ) &&
              isToppingUp)
          ) {
            setValue('sl', undefined);
          }
          break;

        case TpSlTypeEnum.Price:
          const soValue = SLTPstore.positionStopOutByPrice({
            instrumentId: position.instrument,
            investmentAmount: position.investmentAmount,
            multiplier: position.multiplier,
            operation: position.operation,
            slPrice: sl || 0,
            commission: position.swap + position.commission,
          });
          console.log('positionStopOut Price', soValue, 'sl', sl);
          if (!isToppingUp) {
            if (
              hasValue(sl) &&
              soValue <= 0 &&
              Math.abs(soValue) >
                SLTPstore.positionStopOut(
                  position.investmentAmount,
                  position.instrument
                )
            ) {
              setValue('sl', undefined);
            }
          } else {
            if (
              hasValue(sl) &&
              soValue <= 0 &&
              Math.abs(soValue) <=
                SLTPstore.positionStopOut(
                  position.investmentAmount,
                  position.instrument
                )
            ) {
              setValue('sl', undefined);
            }
          }
          break;

        default:
          break;
      }
    },
    [SLTPstore.slType, sl, position]
  );

  const handleResetLines = () => {
    checkSL(position.slType, position.sl || null);
    checkTP(position.tpType, position.tp || null);
  };

  const resetFormStateToInitial = useCallback(() => {
    reset({
      investmentAmount: position.investmentAmount,
      isToppingUpActive: position.isToppingUpActive,
      openPrice: position.openPrice,
      sl: hasValue(position.sl) ? Math.abs(position.sl) : undefined,
      tp: position.tp ?? undefined,
    });
    // SLTPstore.setTpType(position.tpType ?? TpSlTypeEnum.Currency);
    // SLTPstore.setSlType(position.slType ?? TpSlTypeEnum.Currency);
  }, [position]);

  const needReject = useCallback(() => {
    const isSlNull =
      getValues(Fields.STOP_LOSS) === undefined && position.sl === null;
    const isTpNull =
      getValues(Fields.TAKE_PROFIT) === undefined && position.tp === null;
    const isToppingUpNull =
      !getValues(Fields.IS_TOPPING_UP) && !position.isToppingUpActive;
    return isSlNull && isTpNull && isToppingUpNull;
  }, [position]);

  useEffect(() => {
    if (quotesStore.selectedPosition?.id === position.id) {
      checkSL(SLTPstore.slType, position.sl);
      checkTP(SLTPstore.tpType, position.tp);
    }
  }, [quotesStore.selectedPositionId]);

  const methodsForForm = {
    errors,
    getValues,
    formState,
    setValue,
    reset,
    watch,
    handleSubmit,
    ...otherMethods,
  };

  return (
    <Observer>
      {() => (
        <InstrumentInfoWrapper
          padding="8px 8px 0 12px"
          ref={instrumentRef}
          flexDirection="column"
          onClick={setInstrumentActive}
          minHeight="79px"
          className={
            quotesStore.selectedPositionId === position.id ||
            (parseInt(localStorage.getItem(LOCAL_POSITION) || '0') ===
            position.id
              ? 'active'
              : '') ||
            parseInt(mainAppStore.paramsPortfolioActive || '0') === position.id
              ? 'active'
              : ''
          }
        >
          <ActivePositionToppingUp
            isToppingUpActive={isToppingUpActive}
            sl={sl}
            challengeStopOutBySlValue={challengeStopOutBySlValue}
            challengeStopOutByToppingUp={challengeStopOutByToppingUp}
            setValue={setValue}
          ></ActivePositionToppingUp>
          <InstrumentInfoWrapperForBorder
            justifyContent="space-between"
            padding="0 0 8px 0"
          >
            <FlexContainer width="32px" alignItems="flex-start">
              <ImageContainer instrumentId={position.instrument} />
            </FlexContainer>
            <FlexContainer flexDirection="column" margin="0 6px 0 0">
              <PrimaryTextSpan
                fontSize="12px"
                lineHeight="14px"
                marginBottom="2px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                maxWidth="74px"
                title={positionInstrument()?.name}
              >
                {positionInstrument()?.name}
              </PrimaryTextSpan>
              <FlexContainer margin="0 0 12px 0" alignItems="center">
                <FlexContainer margin="0 4px 0 0">
                  <SvgIcon
                    {...Icon}
                    fillColor={isBuy ? '#00FFDD' : '#ED145B'}
                  />
                </FlexContainer>
                <PrimaryTextSpan
                  fontSize="10px"
                  color={isBuy ? '#00FFDD' : '#ED145B'}
                  textTransform="uppercase"
                  fontWeight="bold"
                >
                  {isBuy ? t('Buy') : t('Sell')}
                </PrimaryTextSpan>
              </FlexContainer>
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.5)"
                fontSize="10px"
                lineHeight="12px"
              >
                {moment(position.openDate).format('DD MMM, HH:mm:ss')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer flexDirection="column" alignItems="flex-end">
              <PrimaryTextSpan
                marginBottom="4px"
                fontSize="12px"
                lineHeight="14px"
              >
                {mainAppStore.activeAccount?.symbol}
                {position.investmentAmount.toFixed(2)}
              </PrimaryTextSpan>
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.5)"
                fontSize="10px"
                lineHeight="12px"
                marginBottom="12px"
              >
                &times;{position.multiplier}
              </PrimaryTextSpan>

              <FlexContainer ref={tooltipWrapperRef}>
                <InformationPopup
                  classNameTooltip={`position_${position.id}`}
                  bgColor="#000"
                  width="200px"
                  direction="bottom"
                  needScroll={needScroll}
                >
                  <FlexContainer flexDirection="column" width="100%">
                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 8px 0"
                    >
                      <PrimaryTextSpan
                        color="rgba(255, 255, 255, 0.4)"
                        fontSize="12px"
                      >
                        {t('Price opened')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color="#fffccc" fontSize="12px">
                        {t('at')} {position.openPrice.toFixed(+precision)}
                      </PrimaryTextSpan>
                    </FlexContainer>
                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 8px 0"
                    >
                      <PrimaryTextSpan
                        color="rgba(255, 255, 255, 0.4)"
                        fontSize="12px"
                      >
                        {t('Opened')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color="#fffccc" fontSize="12px">
                        {moment(position.openDate).format('DD MMM, HH:mm:ss')}
                      </PrimaryTextSpan>
                    </FlexContainer>
                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 8px 0"
                    >
                      <PrimaryTextSpan
                        color="rgba(255, 255, 255, 0.4)"
                        fontSize="12px"
                      >
                        {t('Equity')}
                      </PrimaryTextSpan>
                      <EquityPnL position={position} />
                    </FlexContainer>
                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 8px 0"
                    >
                      <PrimaryTextSpan
                        color="rgba(255, 255, 255, 0.4)"
                        fontSize="12px"
                        marginRight="20px"
                      >
                        {t('Overnight fee')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color="#fffccc" fontSize="12px">
                        {getNumberSign(position.swap)}
                        {mainAppStore.activeAccount?.symbol}
                        {Math.abs(position.swap + position.commission).toFixed(2)}
                      </PrimaryTextSpan>
                    </FlexContainer>

                    {position.tp && (
                      <FlexContainer
                        justifyContent="space-between"
                        margin="0 0 8px 0"
                      >
                        <PrimaryTextSpan
                          color="rgba(255, 255, 255, 0.4)"
                          fontSize="12px"
                        >
                          {t('Take profit')}
                        </PrimaryTextSpan>
                        <PrimaryTextSpan color="#fffccc" fontSize="12px">
                          {position.tpType === TpSlTypeEnum.Currency
                            ? `+${mainAppStore.activeAccount?.symbol}${Math.abs(position.tp).toFixed(2)}`
                            : Math.abs(position.tp).toFixed(+precision)
                          }
                        </PrimaryTextSpan>
                      </FlexContainer>
                    )}

                    {position.sl && (
                      <FlexContainer
                        justifyContent="space-between"
                        margin="0 0 8px 0"
                      >
                        <PrimaryTextSpan
                          color="rgba(255, 255, 255, 0.4)"
                          fontSize="12px"
                        >
                          {t('Stop loss')}
                        </PrimaryTextSpan>
                        <PrimaryTextSpan color="#fffccc" fontSize="12px">
                          {position.slType === TpSlTypeEnum.Currency
                            ? `-${mainAppStore.activeAccount?.symbol}${Math.abs(position.sl).toFixed(2)}`
                            : Math.abs(position.sl).toFixed(+precision)
                          }
                        </PrimaryTextSpan>
                      </FlexContainer>
                    )}

                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 8px 0"
                    >
                      <PrimaryTextSpan
                        color="rgba(255, 255, 255, 0.4)"
                        fontSize="12px"
                      >
                        {t('Save position')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color="#fffccc" fontSize="12px">
                        {position.isToppingUpActive ? t('On') : t('Off')}
                      </PrimaryTextSpan>
                    </FlexContainer>

                    {position.reservedFundsForToppingUp !== 0 && (
                      <FlexContainer
                        justifyContent="space-between"
                        margin="0 0 8px 0"
                      >
                        <PrimaryTextSpan
                          color="rgba(255, 255, 255, 0.4)"
                          fontSize="12px"
                        >
                          {t('Insurance amount')}
                        </PrimaryTextSpan>
                        <PrimaryTextSpan color="#fffccc" fontSize="12px">
                          {mainAppStore.activeAccount?.symbol}
                          {Math.abs(position.reservedFundsForToppingUp).toFixed(
                            2
                          )}
                        </PrimaryTextSpan>
                      </FlexContainer>
                    )}

                    <FlexContainer justifyContent="space-between">
                      <PrimaryTextSpan
                        color="rgba(255, 255, 255, 0.4)"
                        fontSize="12px"
                      >
                        {t('Position ID')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color="#fffccc" fontSize="12px">
                        {position.id}
                      </PrimaryTextSpan>
                    </FlexContainer>
                  </FlexContainer>
                </InformationPopup>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer flexDirection="column">
              <FlexContainer justifyContent="flex-end" margin="0 0 8px 0">
                <FlexContainer
                  flexDirection="column"
                  alignItems="flex-end"
                  margin="0 8px 0 0"
                >
                  <ActivePositionPnL position={position} />
                  <ActivePositionPnLPercent position={position} />
                </FlexContainer>
              </FlexContainer>
              <FlexContainer ref={clickableWrapper}>
                {((formState.touched.sl && errors.sl) ||
                  (formState.touched.tp && errors.tp)) && (
                  <ErropPopup
                    textColor="#fffccc"
                    bgColor={ColorsPallete.RAZZMATAZZ}
                    classNameTooltip={Fields.INVEST_AMOUNT}
                    direction="left"
                  >
                    {errors.sl?.message || errors.tp?.message}
                  </ErropPopup>
                )}

                <FormProvider {...methodsForForm}>
                  <CustomForm
                    className={
                      tradingViewStore.activePopup &&
                      position.id === quotesStore.selectedPositionId
                        ? 'chart_update'
                        : ''
                    }
                    onSubmit={handleSubmit(updateSLTP)}
                    id={`activepos${position.id}`}
                    name={`activepos${position.id}`}
                  >
                    <AutoClosePopupSideBar
                      ref={instrumentRef}
                      handleSumbitMethod={updateSLTP}
                      tpType={position.tpType}
                      slType={position.slType}
                      instrumentId={position.instrument}
                      positionId={position.id}
                      handleResetLines={handleResetLines}
                      resetFormStateToInitial={resetFormStateToInitial}
                      amount={position.investmentAmount}
                    >
                      <SetSLTPButton>
                        <FlexContainer
                          background={
                            hasValue(tp)
                              ? 'rgba(255, 255, 255, 0.12)'
                              : 'transparent'
                          }
                          padding="1px 2px"
                          marginRight="1px"
                        >
                          <PrimaryTextSpan
                            fontSize="12px"
                            lineHeight="18px"
                            color={
                              hasValue(tp)
                                ? '#fffccc'
                                : 'rgba(255, 255, 255, 0.6)'
                            }
                          >
                            {t('TP')}
                          </PrimaryTextSpan>
                        </FlexContainer>
                        <FlexContainer
                          background={
                            hasValue(sl)
                              ? 'rgba(255, 255, 255, 0.12)'
                              : 'transparent'
                          }
                          padding="1px 2px"
                          marginRight="1px"
                        >
                          <PrimaryTextSpan
                            fontSize="12px"
                            lineHeight="18px"
                            color={
                              hasValue(sl)
                                ? '#fffccc'
                                : 'rgba(255, 255, 255, 0.6)'
                            }
                          >
                            {t('SL')}
                          </PrimaryTextSpan>
                        </FlexContainer>
                        <FlexContainer
                          background={
                            (position.isToppingUpActive || position.reservedFundsForToppingUp !== 0)
                              ? 'rgba(255, 255, 255, 0.12)'
                              : 'transparent'
                          }
                          padding="1px 2px"
                          height="20px"
                          alignItems="center"
                        >
                          <SvgIcon {...IconShield} fillColor={
                            position.reservedFundsForToppingUp !== 0
                              ? '#ED145B'
                              : position.isToppingUpActive
                              ? '#fffccc'
                              : '#77797D'
                          } />
                        </FlexContainer>
                      </SetSLTPButton>
                    </AutoClosePopupSideBar>
                  </CustomForm>
                </FormProvider>
                <ClosePositionPopup
                  applyHandler={closePosition(mixpanelValues.PORTFOLIO)}
                  buttonLabel={`${t('Close')}`}
                  ref={instrumentRef}
                  confirmText={`${t('Close position')}?`}
                  beClosed={
                    tradingViewStore.activePositionPopup ||
                    SLTPstore.closeOpenPrice
                  }
                  isButton
                />
              </FlexContainer>
            </FlexContainer>
          </InstrumentInfoWrapperForBorder>
        </InstrumentInfoWrapper>
      )}
    </Observer>
  );
};

export default ActivePositionsPortfolioTab;

const InstrumentInfoWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;
  will-change: background-color;

  &:hover,
  &.active {
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
`;

const InstrumentInfoWrapperForBorder = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

const SetSLTPButton = styled(FlexContainer)`
  border: 2px solid rgba(255, 255, 255, 0.12);
  margin-right: 8px;
  background-color: transparent;
  transition: background-color 0.2s ease;
  will-change: background-color;
  border-radius: 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.24);
  }

  &:focus {
    background-color: rgba(0, 0, 0, 0.24);
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
    & span {
      color: rgba(255, 255, 255, 0.4);
    }
  }
`;

const CustomForm = styled.form`
  margin: 0;
  &.chart_update > div > div {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
