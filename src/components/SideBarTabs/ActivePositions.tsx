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
import { PositionModelWSDTO, UpdateSLTP } from '../../types/Positions';
import { getProcessId } from '../../helpers/getProcessId';
import moment from 'moment';
import InformationPopup from '../InformationPopup';
import AutoClosePopupSideBar from './AutoClosePopupSideBar';
import { getNumberSign } from '../../helpers/getNumberSign';
import ClosePositionPopup from './ClosePositionPopup';
import ImageContainer from '../ImageContainer';
import Fields from '../../constants/fields';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import { useFormik } from 'formik';
import ErropPopup from '../ErropPopup';
import ColorsPallete from '../../styles/colorPallete';
import { useTranslation } from 'react-i18next';
import useInstrument from '../../hooks/useInstrument';
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

interface Props {
  position: PositionModelWSDTO;
}

const ActivePositionsPortfolioTab: FC<Props> = ({ position }) => {
  const isBuy = position.operation === AskBidEnum.Buy;

  const instrumentRef = useRef<HTMLDivElement>(null);
  const clickableWrapper = useRef<HTMLDivElement>(null);
  const tooltipWrapperRef = useRef<HTMLDivElement>(null);

  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const {
    quotesStore,
    mainAppStore,
    badRequestPopupStore,
    instrumentsStore,
    SLTPStore,
    notificationStore,
    markersOnChartStore,
    tradingViewStore,
  } = useStores();

  const { t } = useTranslation();
  const { precision } = useInstrument(position.instrument);

  const initialValues = useCallback(
    () => ({
      accountId: mainAppStore.activeAccount?.id || '',
      instrumentId: position.instrument,
      positionId: position.id,
      processId: getProcessId(),
      tp: position.tp,
      sl: position.sl,
      tpType: position.tpType,
      slType: position.slType,
      operation: position.operation,
      investmentAmount: position.investmentAmount,
      multiplier: position.multiplier,
      closedByChart: false
    }),
    [position]
  );

  const currentPriceAsk = useCallback(
    () => quotesStore.quotes[position.instrument].ask.c,
    [quotesStore.quotes[position.instrument].ask.c, position.instrument]
  );

  const currentPriceBid = useCallback(
    () => quotesStore.quotes[position.instrument].bid.c,
    [quotesStore.quotes[position.instrument].bid.c, position.instrument]
  );

  const validationSchema = useCallback(
    () =>
      yup.object().shape({
        tp: yup
          .number()
          .nullable()
          .test(Fields.TAKE_PROFIT, t('Take Profit can not be zero'), (value) => {
            return value !== 0;
          })
          .when([Fields.OPERATION, Fields.TAKE_PROFIT_TYPE], {
            is: (operation, tpType) =>
              operation === AskBidEnum.Buy && tpType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.TAKE_PROFIT,
                `${t('Error message')}: ${t(
                  'This level is higher or lower than the one currently allowed'
                )}`,
                (value) => value > currentPriceBid()
              ),
          })
          .when([Fields.OPERATION, Fields.TAKE_PROFIT_TYPE], {
            is: (operation, tpType) =>
              operation === AskBidEnum.Sell && tpType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.TAKE_PROFIT,
                `${t('Error message')}: ${t(
                  'This level is higher or lower than the one currently allowed'
                )}`,
                (value) => value < currentPriceAsk()
              ),
          })
          .when([Fields.TAKE_PROFIT_TYPE], {
            is: (tpType) => tpType === TpSlTypeEnum.Currency,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.TAKE_PROFIT,
                t('Take profit level should be higher than the current P/L'),
                (value) => value === null || value > PnL()
              ),
          }),
        sl: yup
          .number()
          .nullable()
          .test(Fields.STOP_LOSS, t('Stop Loss can not be zero'), (value) => {
            return value !== 0;
          })
          .when([Fields.OPERATION, Fields.STOP_LOSS_TYPE], {
            is: (operation, slType) =>
              operation === AskBidEnum.Buy && slType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .test(
                Fields.STOP_LOSS,
                `${t('Error message')}: ${t(
                  'This level is higher or lower than the one currently allowed'
                )}`,
                (value) => value < currentPriceBid()
              ),
          })
          .when([Fields.OPERATION, Fields.STOP_LOSS_TYPE], {
            is: (operation, slType) =>
              operation === AskBidEnum.Sell && slType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .test(
                Fields.STOP_LOSS,
                `${t('Error message')}: ${t(
                  'This level is higher or lower than the one currently allowed'
                )}`,
                (value) => value > currentPriceAsk()
              ),
          })
          .when([Fields.STOP_LOSS_TYPE], {
            is: (slType) => slType === TpSlTypeEnum.Currency,
            then: yup
              .number()
              .test(
                Fields.STOP_LOSS,
                t('Stop loss level should be lower than the current P/L'),
                (value) => -1 * Math.abs(value) < PnL()
              )
              .test(
                Fields.STOP_LOSS,
                t('Stop loss level can not be higher than the Invest amount'),
                (value) => Math.abs(value) <= position.investmentAmount
              ),
          }),
        tpType: yup.number().nullable(),
        slType: yup.number().nullable(),
      }),
    [position, currentPriceBid, currentPriceAsk]
  );

  const getActualPricing = (value: number, sltp: string, type: TpSlTypeEnum | null) => {
    if (tradingViewStore.selectedPosition) {
      const swap = tradingViewStore.selectedPosition?.swap;
      const investmentAmount =
        tradingViewStore.selectedPosition?.investmentAmount;
      const multiplier = tradingViewStore.selectedPosition?.multiplier;
      const openPrice = tradingViewStore.selectedPosition?.openPrice;
      let actualPrice: number = tradingViewStore.selectedPosition?.openPrice;
      if (
        tradingViewStore.selectedPosition?.operation === AskBidEnum.Buy &&
        sltp === 'tp'
      ) {
        if (
          type === TpSlTypeEnum.Currency
        ) {
          const profitVolume =
            (Math.abs(value) - swap) / (investmentAmount * multiplier);
          actualPrice = openPrice + profitVolume * openPrice;
        } else {
          actualPrice = Math.abs(value);
        }
      } else if (
        tradingViewStore.selectedPosition?.operation === AskBidEnum.Buy &&
        sltp === 'sl'
      ) {
        if (
          type === TpSlTypeEnum.Currency
        ) {
          const profitVolume =
            (Math.abs(value) - swap) / (investmentAmount * multiplier);
          actualPrice = openPrice - profitVolume * openPrice;
        } else {
          actualPrice = Math.abs(value);
        }
      } else if (
        tradingViewStore.selectedPosition?.operation === AskBidEnum.Sell &&
        sltp === 'tp'
      ) {
        if (
          type === TpSlTypeEnum.Currency
        ) {
          const profitVolume =
            (Math.abs(value) - swap) / (investmentAmount * multiplier);
          actualPrice = openPrice - profitVolume * openPrice;
        } else {
          actualPrice = Math.abs(value);
        }
      } else if (
        tradingViewStore.selectedPosition?.operation === AskBidEnum.Sell &&
        sltp === 'sl'
      ) {
        if (
          type === TpSlTypeEnum.Currency
        ) {
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
    if (tradingViewStore.selectedPosition) {
      const swap = tradingViewStore.selectedPosition?.swap;
      const amount = tradingViewStore.selectedPosition?.investmentAmount;
      const multiplier = tradingViewStore.selectedPosition?.multiplier;
      const openPrice = tradingViewStore.selectedPosition?.openPrice;
      let actualPrice: number = tradingViewStore.selectedPosition?.openPrice;
      if (
        tradingViewStore.selectedPosition?.operation === AskBidEnum.Buy &&
        sltp === 'tp'
      ) {
        actualPrice =
          -(1 - swap / (amount * multiplier) - value / openPrice) *
          (amount * multiplier);
      } else if (
        tradingViewStore.selectedPosition?.operation === AskBidEnum.Buy &&
        sltp === 'sl'
      ) {
        actualPrice =
          (1 + swap / (amount * multiplier) - value / openPrice) *
          (amount * multiplier);
      } else if (
        tradingViewStore.selectedPosition?.operation === AskBidEnum.Sell &&
        sltp === 'tp'
      ) {
        actualPrice =
          (1 - swap / (amount * multiplier) - value / openPrice) *
          (amount * multiplier);
      } else if (
        tradingViewStore.selectedPosition?.operation === AskBidEnum.Sell &&
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
          [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
          [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
            ? 'real'
            : 'demo',
          [mixapanelProps.EVENT_REF]: closeFrom,
          [mixapanelProps.POSITION_ID]: response.position.id,
        });

        notificationStore.notificationMessage = t(
          'The order has been closed successfully'
        );
        notificationStore.isSuccessfull = true;
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
          [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
          [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
            ? 'real'
            : 'demo',
          [mixapanelProps.ERROR_TEXT]: apiResponseCodeMessages[response.result],
          [mixapanelProps.EVENT_REF]: closeFrom,
        });
        notificationStore.notificationMessage = t(
          apiResponseCodeMessages[response.result]
        );
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
        return Promise.reject();
      }
    } catch (error) {}
  };

  const updateSLTP = useCallback(
    async (values: UpdateSLTP) => {
      const valuesToSubmit = {
        ...values,
        slType: values.sl ? values.slType : null,
        tpType: values.tp ? values.tpType : null,
        sl: values.sl || null,
        tp: values.tp || null,
      };
      delete valuesToSubmit.closedByChart;
      try {
        const response = await API.updateSLTP(valuesToSubmit);
        if (response.result === OperationApiResponseCodes.Ok) {
          if (tradingViewStore.selectedPosition?.id === values.positionId) {
            checkSL(values.slType, valuesToSubmit.sl);
            checkTP(values.tpType, valuesToSubmit.tp);
          }
          position.sl = valuesToSubmit.sl;
          position.tp = valuesToSubmit.tp;
          position.slType = valuesToSubmit.slType;
          position.tpType = valuesToSubmit.tpType;
          tradingViewStore.selectedPosition = position;
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
            [mixapanelProps.AVAILABLE_BALANCE]:
              mainAppStore.activeAccount?.balance || 0,
            [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
            [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
              ? 'real'
              : 'demo',
            [mixapanelProps.EVENT_REF]: ((tradingViewStore.activePopup &&
              position.id === tradingViewStore.selectedPosition?.id) || values.closedByChart)
              ? mixpanelValues.CHART
              : mixpanelValues.PORTFOLIO,
            [mixapanelProps.POSITION_ID]: response.position.id,
          });
          tradingViewStore.toggleMovedPositionPopup(false);
          setFieldValue(Fields.CLOSED_BY_CHART, false);
        } else {
          if (tradingViewStore.selectedPosition?.id === values.positionId) {
            checkSL(position.slType, position.sl);
            checkTP(position.tpType, position.tp);
          }
          setFieldValue(Fields.STOP_LOSS, position.sl);
          setFieldValue(Fields.STOP_LOSS_TYPE, position.slType);
          setFieldValue(Fields.TAKE_PROFIT, position.tp);
          setFieldValue(Fields.TAKE_PROFIT_TYPE, position.tpType);
          mixpanel.track(mixpanelEvents.EDIT_SLTP_FAILED, {
            [mixapanelProps.AMOUNT]: valuesToSubmit.investmentAmount,
            [mixapanelProps.ACCOUNT_CURRENCY]:
              mainAppStore.activeAccount?.currency || '',
            [mixapanelProps.INSTRUMENT_ID]: valuesToSubmit.instrumentId,
            [mixapanelProps.MULTIPLIER]: valuesToSubmit.multiplier,
            [mixapanelProps.TREND]:
              valuesToSubmit.operation === AskBidEnum.Buy ? 'buy' : 'sell',
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
            [mixapanelProps.AVAILABLE_BALANCE]:
              mainAppStore.activeAccount?.balance || 0,
            [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
            [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
              ? 'real'
              : 'demo',
            [mixapanelProps.EVENT_REF]: ((tradingViewStore.activePopup &&
            position.id === tradingViewStore.selectedPosition?.id) || values.closedByChart)
              ? mixpanelValues.CHART
              : mixpanelValues.PORTFOLIO,
          });
          notificationStore.notificationMessage = t(
            apiResponseCodeMessages[response.result]
          );
          notificationStore.isSuccessfull = false;
          setFieldValue(Fields.CLOSED_BY_CHART, false);
          notificationStore.openNotification();
        }
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    },
    [mainAppStore.activeAccount]
  );

  const {
    setFieldValue,
    errors,
    submitForm,
    validateForm,
    resetForm,
    touched,
  } = useFormik<UpdateSLTP>({
    initialValues: initialValues(),
    onSubmit: updateSLTP,
    validationSchema: validationSchema(),
    validateOnBlur: true,
    validateOnChange: true,
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
          await instrumentsStore.switchInstrument(position.instrument);
          tradingViewStore.clearActivePositionLine();
          tradingViewStore.selectedPosition = position;

          tradingViewStore.activeOrderLinePosition = tradingViewStore.tradingWidget
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
            .setLineLength(10);

          tradingViewStore.activeOrderLinePositionPnL = tradingViewStore.tradingWidget
            ?.chart()
            .createOrderLine({
              disableUndo: true,
            })
            .onCancel(function (this: IOrderLineAdapter) {
              tradingViewStore.setApplyHandler(
                closePosition(mixpanelValues.CHART),
                true
              );
              tradingViewStore.confirmText = 'Close position?';
              tradingViewStore.toggleActivePositionPopup(true);
            })
            .setCancelTooltip('Close position')
            .setLineStyle(1)
            .setLineWidth(2)
            .setText(`${PnL() >= 0 ? '+' : '-'} $${Math.abs(PnL()).toFixed(2)}`)
            .setQuantity('')
            .setPrice(+position.openPrice)
            .setBodyBorderColor(PnL() > 0 ? '#00FFDD' : '#ED145B')
            .setBodyTextColor(PnL() > 0 ? '#252636' : '#ffffff')
            .setCancelButtonBackgroundColor('#2A2C33')
            .setCancelButtonBorderColor('#494C51')
            .setCancelButtonIconColor('#ffffff')
            .setBodyBackgroundColor(PnL() > 0 ? '#00FFDD' : '#ED145B')
            .setLineColor('rgba(73,76,81,1)')
            .setLineLength(10);

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
      tradingViewStore.selectedPosition,
    ]
  );

  const checkSL = (slType: number | null, sl: number | null) => {
    const slText: string = sl
      ? `STOP LOSS -$${slType === TpSlTypeEnum.Price
        ? Math.abs(getNewPricing(sl, 'sl')).toFixed(2)
        : Math.abs(sl)}`
      : '';
    if (sl && !tradingViewStore.activeOrderLinePositionSL) {
      tradingViewStore.activeOrderLinePositionSL = tradingViewStore.tradingWidget
        ?.chart()
        .createOrderLine({
          disableUndo: false,
        })
        .onMove(onMoveSL)
        .onCancel('', function () {
          tradingViewStore.setApplyHandler(removeSLChart);
          tradingViewStore.confirmText = 'Cancel Stop loss level?';
          tradingViewStore.toggleActivePositionPopup(true);
        })
        .setCancelTooltip('Cancel SL')
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
        .setLineLength(10);
    } else if (sl && tradingViewStore.activeOrderLinePositionSL) {
      tradingViewStore.activeOrderLinePositionSL
        .setPrice(getActualPricing(sl, 'sl', slType))
        .setText(slText);
    } else if (!sl && tradingViewStore.activeOrderLinePositionSL) {
      tradingViewStore.activeOrderLinePositionSL.remove();
      tradingViewStore.activeOrderLinePositionSL = undefined;
    }
  };

  const checkTP = (tpType: number | null, tp: number | null) => {
    const tpText: string = tp
      ? `TAKE PROFIT +$${tpType === TpSlTypeEnum.Price
        ? Math.abs(getNewPricing(tp, 'tp')).toFixed(2)
        : Math.abs(tp)}`
      : '';
    if (tp && !tradingViewStore.activeOrderLinePositionTP) {
      tradingViewStore.activeOrderLinePositionTP = tradingViewStore.tradingWidget
        ?.chart()
        .createOrderLine({
          disableUndo: false,
        })
        .onMove(onMoveTP)
        .onCancel('', function () {
          tradingViewStore.setApplyHandler(removeTPChart);
          tradingViewStore.confirmText = 'Cancel Take profit level?';
          tradingViewStore.toggleActivePositionPopup(true);
        })
        .setQuantity('')
        .setCancelTooltip('Cancel TP')
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
        .setLineLength(10);
    } else if (tp && tradingViewStore.activeOrderLinePositionTP) {
      tradingViewStore.activeOrderLinePositionTP
        .setPrice(getActualPricing(tp, 'tp', tpType))
        .setText(tpText);
    } else if (!tp && tradingViewStore.activeOrderLinePositionTP) {
      tradingViewStore.activeOrderLinePositionTP.remove();
      tradingViewStore.activeOrderLinePositionTP = undefined;
    }
  };

  const onMoveSL = useCallback(async () => {
    tradingViewStore.toggleMovedPositionPopup(false);
    SLTPStore.toggleBuySell(false);
    if (
      tradingViewStore.activeOrderLinePositionSL &&
      tradingViewStore.selectedPosition
    ) {
      const newPosition = position.slType === TpSlTypeEnum.Currency
        ? parseFloat(Math.abs(getNewPricing(tradingViewStore.activeOrderLinePositionSL?.getPrice(), 'sl')).toFixed(2))
        : tradingViewStore.activeOrderLinePositionSL?.getPrice();
      tradingViewStore.toggleMovedPositionPopup(true);
      checkSL(position.slType, newPosition);
      await setFieldValue(Fields.STOP_LOSS_TYPE, position.slType);
      await setFieldValue(Fields.STOP_LOSS, newPosition);
    }
  }, [
    tradingViewStore.activeOrderLinePositionSL,
    tradingViewStore.selectedPosition,
  ]);

  const onMoveTP = useCallback(async () => {
    SLTPStore.toggleBuySell(false);
    tradingViewStore.toggleMovedPositionPopup(false);
    if (
      tradingViewStore.activeOrderLinePositionTP &&
      tradingViewStore.selectedPosition
    ) {
      const newPosition = position.tpType === TpSlTypeEnum.Currency
        ? parseFloat(Math.abs(getNewPricing(tradingViewStore.activeOrderLinePositionTP?.getPrice(), 'tp')).toFixed(2))
        : tradingViewStore.activeOrderLinePositionTP?.getPrice();
      tradingViewStore.toggleMovedPositionPopup(true);
      checkTP(position.tpType, newPosition);
      await setFieldValue(Fields.TAKE_PROFIT_TYPE, position.tpType);
      await setFieldValue(Fields.TAKE_PROFIT, newPosition);
    }
  }, [
    tradingViewStore.activeOrderLinePositionTP,
    tradingViewStore.selectedPosition,
  ]);

  const getActualSL = useCallback(() => {
    if (
      tradingViewStore.activeOrderLinePositionSL &&
      tradingViewStore.selectedPosition
    ) {
      const newPosition = tradingViewStore.activeOrderLinePositionSL?.getPrice();
      return tradingViewStore.activePopup &&
        position.id === tradingViewStore.selectedPosition?.id
        ? [position.slType === TpSlTypeEnum.Currency
          ? parseFloat(getNewPricing(newPosition, 'sl').toFixed(2))
          : parseFloat(newPosition.toFixed(activeInstrument()?.digits || 2)), position.slType]
        : [position.sl, position.slType];
    }
    return [position.sl, position.slType];
  }, [
    tradingViewStore.selectedPosition,
    tradingViewStore.activeOrderLinePositionSL,
    position.sl,
    tradingViewStore.activePopup
  ]);

  const getActualTP = useCallback(() => {
    if (
      tradingViewStore.activeOrderLinePositionTP &&
      tradingViewStore.selectedPosition
    ) {
      const newPosition = tradingViewStore.activeOrderLinePositionTP?.getPrice();
      return tradingViewStore.activePopup &&
        position.id === tradingViewStore.selectedPosition?.id
        ? [position.tpType === TpSlTypeEnum.Currency
          ? parseFloat(getNewPricing(newPosition, 'tp').toFixed(2))
          : parseFloat(newPosition.toFixed(activeInstrument()?.digits || 2)), position.tpType]
        : [position.tp, position.tpType];
    }
    return [position.tp, position.tpType];
  }, [
    tradingViewStore.selectedPosition,
    tradingViewStore.activeOrderLinePositionTP,
    position.tp,
    tradingViewStore.activePopup
  ]);

  const resetSLTPLines = () => {
    if (tradingViewStore.selectedPosition?.id === position.id) {
      if (tradingViewStore.activeOrderLinePositionTP && position.tp) {
        const tpText: string = position.tp
          ? `TAKE PROFIT +$${position.tpType === TpSlTypeEnum.Price
            ? Math.abs(getNewPricing(position.tp, 'tp')).toFixed(2)
            : Math.abs(position.tp)}`
          : '';
        tradingViewStore.activeOrderLinePositionTP
          .setPrice(getActualPricing(position.tp, 'tp', position.tpType))
          .setText(tpText);
      }
      if (tradingViewStore.activeOrderLinePositionSL && position.sl) {
        const slText: string = position.sl
          ? `STOP LOSS -$${position.slType === TpSlTypeEnum.Price
            ? Math.abs(getNewPricing(position.sl, 'sl')).toFixed(2)
            : Math.abs(position.sl)}`
          : '';
        tradingViewStore.activeOrderLinePositionSL
          .setPrice(getActualPricing(position.sl, 'sl', position.slType))
          .setText(slText);
      }
      tradingViewStore.toggleMovedPositionPopup(false);
    }
  };

  const handleApply = useCallback(async () => {
    await setFieldValue(
      Fields.TAKE_PROFIT_TYPE,
      SLTPStore.takeProfitValue !== '' ? SLTPStore.autoCloseTPType : null
    );
    await setFieldValue(
      Fields.STOP_LOSS_TYPE,
      SLTPStore.stopLossValue !== '' ? SLTPStore.autoCloseSLType : null
    );
    await setFieldValue(
      Fields.TAKE_PROFIT,
      SLTPStore.takeProfitValue !== '' ? +SLTPStore.takeProfitValue : null
    );
    await setFieldValue(
      Fields.STOP_LOSS,
      SLTPStore.stopLossValue !== '' ? +SLTPStore.stopLossValue : null
    );
    return new Promise<void>(async (resolve, reject) => {
      const errors = await validateForm();
      if (!Object.keys(errors).length) {
        submitForm();
        resolve();
      } else {
        reject();
      }
    });
  }, [SLTPStore.takeProfitValue, SLTPStore.stopLossValue]);

  const removeSLChart = useCallback(async () => {
    if (tradingViewStore.selectedPosition) {
      setFieldValue(Fields.CLOSED_BY_CHART, true);
      tradingViewStore.activeOrderLinePositionSL?.remove();
      tradingViewStore.activeOrderLinePositionSL = undefined;
      removeSL();
      const objectToSend: UpdateSLTP = {
        tpType: tradingViewStore?.selectedPosition
          ? tradingViewStore.selectedPosition?.tpType
          : null,
        slType: null,
        tp: tradingViewStore?.selectedPosition
          ? tradingViewStore.selectedPosition?.tp
          : null,
        sl: null,
        processId: getProcessId(),
        accountId: mainAppStore.activeAccountId,
        positionId: tradingViewStore.selectedPosition?.id,
        investmentAmount: tradingViewStore.selectedPosition?.investmentAmount,
        multiplier: tradingViewStore.selectedPosition?.multiplier,
        operation: tradingViewStore.selectedPosition?.operation,
        instrumentId: tradingViewStore.selectedPosition?.instrument,
        closedByChart: true,
      };
      tradingViewStore.selectedPosition.sl = null;
      tradingViewStore.selectedPosition.slType = null;
      updateSLTP(objectToSend);
    }
  }, [tradingViewStore.selectedPosition]);

  const removeTPChart = useCallback(async () => {
    if (tradingViewStore.selectedPosition) {
      setFieldValue(Fields.CLOSED_BY_CHART, true);
      tradingViewStore.activeOrderLinePositionTP?.remove();
      tradingViewStore.activeOrderLinePositionTP = undefined;
      removeTP();
      const objectToSend: UpdateSLTP = {
        tpType: null,
        slType: tradingViewStore?.selectedPosition
          ? tradingViewStore.selectedPosition?.slType
          : null,
        tp: null,
        sl:
          tradingViewStore?.selectedPosition &&
          tradingViewStore.selectedPosition?.sl
            ? Math.abs(tradingViewStore.selectedPosition?.sl)
            : null,
        processId: getProcessId(),
        accountId: mainAppStore.activeAccountId,
        positionId: tradingViewStore.selectedPosition?.id,
        investmentAmount: tradingViewStore.selectedPosition?.investmentAmount,
        multiplier: tradingViewStore.selectedPosition?.multiplier,
        operation: tradingViewStore.selectedPosition?.operation,
        instrumentId: tradingViewStore.selectedPosition?.instrument,
        closedByChart: true,
      };
      tradingViewStore.selectedPosition.tp = null;
      tradingViewStore.selectedPosition.tpType = null;
      updateSLTP(objectToSend);
    }
  }, [tradingViewStore.selectedPosition]);

  const removeSL = () => {
    SLTPStore.stopLossValue = '';
    setFieldValue(Fields.STOP_LOSS, null);
  };

  const removeTP = () => {
    SLTPStore.takeProfitValue = '';
    setFieldValue(Fields.TAKE_PROFIT, null);
  };

  const activeInstrument = useCallback(() => {
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
          tradingViewStore.selectedPosition &&
          tradingViewStore.selectedPosition.id === position.id
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
            tradingViewStore.selectedPosition?.id === position.id
              ? 'active'
              : ''
          }
        >
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
              >
                {activeInstrument()?.name}
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
                      >
                        {t('Overnight fee')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color="#fffccc" fontSize="12px">
                        {getNumberSign(position.swap)}
                        {mainAppStore.activeAccount?.symbol}
                        {Math.abs(position.swap).toFixed(2)}
                      </PrimaryTextSpan>
                    </FlexContainer>
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
                {((touched.sl && errors.sl) || (touched.tp && errors.tp)) && (
                  <ErropPopup
                    textColor="#fffccc"
                    bgColor={ColorsPallete.RAZZMATAZZ}
                    classNameTooltip={Fields.AMOUNT}
                    direction="left"
                  >
                    {errors.sl || errors.tp}
                  </ErropPopup>
                )}

                <CustomForm
                  className={
                    tradingViewStore.activePopup &&
                    position.id === tradingViewStore.selectedPosition?.id
                      ? 'chart_update'
                      : ''
                  }
                >
                  <AutoClosePopupSideBar
                    ref={instrumentRef}
                    stopLossValue={getActualSL()[0]}
                    takeProfitValue={getActualTP()[0]}
                    stopLossType={getActualSL()[1]}
                    takeProfitType={getActualTP()[1]}
                    updateSLTP={handleApply}
                    stopLossError={errors.sl}
                    takeProfitError={errors.tp}
                    removeSl={removeSL}
                    removeTP={removeTP}
                    resetForm={resetForm}
                    toggleOut={resetSLTPLines}
                    instrumentId={position.instrument}
                    active={
                      tradingViewStore.activePopup &&
                      position.id === tradingViewStore.selectedPosition?.id
                    }
                  >
                    <SetSLTPButton>
                      <PrimaryTextSpan
                        fontSize="12px"
                        lineHeight="14px"
                        color={
                          position.tp ? '#fffccc' : 'rgba(255, 255, 255, 0.6)'
                        }
                      >
                        {t('TP')}
                      </PrimaryTextSpan>
                      &nbsp;
                      <PrimaryTextSpan
                        fontSize="12px"
                        lineHeight="14px"
                        color={
                          position.sl ? '#fffccc' : 'rgba(255, 255, 255, 0.6)'
                        }
                      >
                        {t('SL')}
                      </PrimaryTextSpan>
                    </SetSLTPButton>
                  </AutoClosePopupSideBar>
                </CustomForm>
                <ClosePositionPopup
                  applyHandler={closePosition(mixpanelValues.PORTFOLIO)}
                  buttonLabel={`${t('Close')}`}
                  ref={instrumentRef}
                  confirmText={`${t('Close position')}?`}
                  isButton
                ></ClosePositionPopup>
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
  border: 1px solid rgba(255, 255, 255, 0.12);
  margin-right: 8px;
  background-color: transparent;
  padding: 4px 8px;
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
