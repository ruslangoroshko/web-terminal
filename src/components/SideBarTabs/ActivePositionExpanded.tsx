import React, { useCallback, useRef } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PositionModelWSDTO } from '../../types/Positions';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import SvgIcon from '../SvgIcon';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import { AskBidEnum } from '../../enums/AskBid';
import moment from 'moment';
import { getNumberSign } from '../../helpers/getNumberSign';
import { useStores } from '../../hooks/useStores';
import InformationPopup from '../InformationPopup';
import API from '../../helpers/API';
import { getProcessId } from '../../helpers/getProcessId';
import { DisplayContents, Td } from '../../styles/TableElements';
import ImageContainer from '../ImageContainer';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import ClosePositionPopup from './ClosePositionPopup';
import { useTranslation } from 'react-i18next';
import useInstrumentPrecision from '../../hooks/useInstrumentPrecision';
import apiResponseCodeMessages from '../../constants/apiResponseCodeMessages';
import { OperationApiResponseCodes } from '../../enums/OperationApiResponseCodes';
import ActivePositionPnL from './ActivePositionPnL';
import ActivePositionPnLPercent from './ActivePositionPnLPercent';
import ActivePositionEquity from './ActivePositionEquity';
import EquityPnL from './EquityPnL';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import mixapanelProps from '../../constants/mixpanelProps';
import mixpanelValues from '../../constants/mixpanelValues';
import Colors from '../../constants/Colors';

interface Props {
  position: PositionModelWSDTO;
  currencySymbol: string;
}

function ActivePositionExpanded(props: Props) {
  const { position, currencySymbol } = props;

  const {
    mainAppStore,
    notificationStore,
    markersOnChartStore,
    instrumentsStore,
  } = useStores();
  const { t } = useTranslation();

  const { precision } = useInstrumentPrecision(position.instrument);

  const instrumentRef = useRef<HTMLDivElement>(null);

  const isBuy = position.operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const positionInstrument = useCallback(() => {
    return instrumentsStore.instruments.find(
      (item) => item.instrumentItem.id === position.instrument
    )?.instrumentItem;
  }, [props.position]);

  const closePosition = async () => {
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
          [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
          [mixapanelProps.POSITION_ID]: response.position.id,
        });
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
          [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
        });
      }

      notificationStore.setNotification(
        t(apiResponseCodeMessages[response.result])
      );
      notificationStore.setIsSuccessfull(
        response.result === OperationApiResponseCodes.Ok
      );
      notificationStore.openNotification();
    } catch (error) {}
  };
  return (
    <DisplayContents>
      <Td>
        <FlexContainer width="32px" height="32px" marginRight="8px">
          <ImageContainer instrumentId={position.instrument} />
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="0 8px 0 0" width="170px">
          <PrimaryTextSpan fontSize="14px" color={Colors.ACCENT} marginBottom="4px">
            {positionInstrument()?.name}
          </PrimaryTextSpan>
          <PrimaryTextSpan fontSize="10px" color={Colors.WHITE_LIGHT}>
            {position.instrument}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td>
        <FlexContainer>
          <FlexContainer margin="0 6px 0 0">
            <SvgIcon {...Icon} fillColor={isBuy ? Colors.PRIMARY : Colors.DANGER} />
          </FlexContainer>
          <FlexContainer flexDirection="column">
            <PrimaryTextSpan
              fontSize="14px"
              lineHeight="20px"
              color={isBuy ? Colors.PRIMARY : Colors.DANGER}
              textTransform="uppercase"
              marginBottom="2px"
            >
              {isBuy ? t('Buy') : t('Sell')}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              fontSize="11px"
              color={Colors.WHITE_LIGHT}
              whiteSpace="nowrap"
            >
              {t('at')} {position.openPrice.toFixed(+precision)}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
      </Td>
      <Td>
        <FlexContainer flexDirection="column">
          <PrimaryTextSpan
            color={Colors.ACCENT}
            fontSize="14px"
            lineHeight="20px"
            marginBottom="2px"
          >
            {moment(position.openDate).format('DD MMM')}
          </PrimaryTextSpan>
          <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="11px">
            {moment(position.openDate).format('HH:mm:ss')}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td justifyContent="flex-end">
        <FlexContainer flexDirection="column" alignItems="flex-end">
          <PrimaryTextSpan
            color={Colors.ACCENT}
            fontSize="14px"
            lineHeight="20px"
            marginBottom="2px"
          >
            {currencySymbol}
            {position.investmentAmount.toFixed(2)}
          </PrimaryTextSpan>
          <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="11px">
            &times;{position.multiplier}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td justifyContent="flex-end">
        <FlexContainer flexDirection="column" alignItems="flex-end">
          <ActivePositionPnL position={position}></ActivePositionPnL>
          <ActivePositionPnLPercent
            position={position}
          ></ActivePositionPnLPercent>
        </FlexContainer>
      </Td>
      <Td justifyContent="center" alignItems="center">
        <FlexContainer flexDirection="column" alignItems="flex-end">
          <ActivePositionEquity position={position}></ActivePositionEquity>
        </FlexContainer>
      </Td>
      <Td justifyContent="center" alignItems="center">
        <FlexContainer flexDirection="column" alignItems="center">
          <PrimaryTextSpan fontSize="12px" color={Colors.WHITE}>
            {position.tp !== null ? (
              <>
                {position.tpType !== TpSlTypeEnum.Price &&
                  position.tp < 0 &&
                  '-'}
                {position.tpType !== TpSlTypeEnum.Price && currencySymbol}
                {position.tpType === TpSlTypeEnum.Price
                  ? Math.abs(position.tp)
                  : Math.abs(position.tp).toFixed(2)}
              </>
            ) : (
              '-'
            )}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td justifyContent="center" alignItems="center">
        <FlexContainer flexDirection="column" alignItems="center">
          <PrimaryTextSpan fontSize="12px" color={Colors.WHITE}>
            {position.sl !== null ? (
              <>
                {position.slType !== TpSlTypeEnum.Price &&
                  position.sl < 0 &&
                  '-'}
                {position.slType !== TpSlTypeEnum.Price && currencySymbol}
                {position.slType === TpSlTypeEnum.Price
                  ? Math.abs(position.sl)
                  : Math.abs(position.sl).toFixed(2)}
              </>
            ) : (
              '-'
            )}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td alignItems="center">
        <FlexContainer
          flexDirection="column"
          alignItems="center"
          margin="0 16px 0 0"
          position="relative"
        >
          <ClosePositionPopup
            applyHandler={closePosition}
            ref={instrumentRef}
            buttonLabel={`${t('Close')}`}
            confirmText={`${t('Close position')}?`}
            isButton
            alignPopup="right"
          />
        </FlexContainer>
        <FlexContainer flexDirection="column" alignItems="center">
          <InformationPopup
            classNameTooltip={`position_expaned_${position.id}`}
            bgColor="#000"
            width="250px"
            direction="left"
          >
            <FlexContainer flexDirection="column" width="100%">
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color={Colors.WHITE_LIGHT}
                  fontSize="12px"
                >
                  {t('Price opened')}
                </PrimaryTextSpan>
                <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                  {t('at')} {position.openPrice.toFixed(+precision)}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color={Colors.WHITE_LIGHT}
                  fontSize="12px"
                >
                  {t('Opened')}
                </PrimaryTextSpan>
                <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                  {moment(position.openDate).format('DD MMM, HH:mm')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color={Colors.WHITE_LIGHT}
                  fontSize="12px"
                >
                  {t('Equity')}
                </PrimaryTextSpan>
                <EquityPnL position={position} />
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color={Colors.WHITE_LIGHT}
                  fontSize="12px"
                  marginRight="20px"
                >
                  {t('Overnight fee')}
                </PrimaryTextSpan>
                <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                  {getNumberSign(position.swap)}
                  {mainAppStore.activeAccount?.symbol}
                  {Math.abs(position.swap + position.commission).toFixed(2)}
                </PrimaryTextSpan>
              </FlexContainer>

              {position.reservedFundsForToppingUp !== 0 && (
                <FlexContainer
                  justifyContent="space-between"
                  margin="0 0 8px 0"
                >
                  <PrimaryTextSpan
                    color={Colors.WHITE_LIGHT}
                    fontSize="12px"
                  >
                    {t('Insurance amount')}
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                    {mainAppStore.activeAccount?.symbol}
                    {Math.abs(position.reservedFundsForToppingUp).toFixed(2)}
                  </PrimaryTextSpan>
                </FlexContainer>
              )}

              <FlexContainer justifyContent="space-between">
                <PrimaryTextSpan
                  color={Colors.WHITE_LIGHT}
                  fontSize="12px"
                >
                  {t('Position ID')}
                </PrimaryTextSpan>
                <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                  {position.id}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
          </InformationPopup>
        </FlexContainer>
      </Td>
    </DisplayContents>
  );
}

export default ActivePositionExpanded;
