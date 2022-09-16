import React, { FC, useCallback, useEffect, useRef } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { PositionHistoryDTO } from '../../types/HistoryReportTypes';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import moment from 'moment';
import { AskBidEnum } from '../../enums/AskBid';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import SvgIcon from '../SvgIcon';
import { calculateInPercent } from '../../helpers/calculateInPercent';
import InformationPopup from '../InformationPopup';
import { getNumberSign } from '../../helpers/getNumberSign';
import { useStores } from '../../hooks/useStores';
import ImageContainer from '../ImageContainer';
import { useTranslation } from 'react-i18next';
import { LOCAL_HISTORY_POSITION } from '../../constants/global';
import { Observer } from 'mobx-react-lite';
import closingReasonText from '../../constants/ClosingReasonText';
import useInstrumentPrecision from '../../hooks/useInstrumentPrecision';
import Colors from '../../constants/Colors';

interface Props {
  tradingHistoryItem: PositionHistoryDTO;
  currencySymbol: string;
  needScroll?: boolean;
}

const TradingHistoryItem: FC<Props> = (props: Props) => {
  const {
    tradingHistoryItem: {
      closeDate,
      closePrice,
      closeReason,
      commission,
      equity,
      id,
      instrument,
      investmentAmount,
      leverage,
      openDate,
      openPrice,
      operation,
      profit,
      swap: swaps,
      reservedFundsForToppingUp,
    },
    currencySymbol,
    needScroll,
  } = props;

  // TODO: think about rotate 180
  const isBuy = operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const popupWrapperRef = useRef<HTMLDivElement>(null);
  const instrumentRef = useRef<HTMLDivElement>(document.createElement('div'));

  const { instrumentsStore, tradingViewStore, mainAppStore } = useStores();

  const positionInstrument = useCallback(() => {
    return instrumentsStore.instruments.find(
      (item) => item.instrumentItem.id === instrument
    )?.instrumentItem;
  }, [props.tradingHistoryItem]);

  const switchInstrument = (e: any) => {
    localStorage.setItem(
      LOCAL_HISTORY_POSITION,
      `${props.tradingHistoryItem.id}`
    );
    tradingViewStore.setSelectedHistory(`${props.tradingHistoryItem.id}`);
    if (popupWrapperRef.current && popupWrapperRef.current.contains(e.target)) {
      e.preventDefault();
    } else {
      instrumentsStore.switchInstrument(instrument);
    }
  };

  const { precision } = useInstrumentPrecision(instrument);

  useEffect(() => {
    const lastPendingActive =
      mainAppStore.paramsPortfolioHistory ||
      localStorage.getItem(LOCAL_HISTORY_POSITION);
    if (mainAppStore.paramsPortfolioHistory) {
      localStorage.removeItem(LOCAL_HISTORY_POSITION);
    }
    if (
      !!lastPendingActive &&
      props.tradingHistoryItem.id === parseFloat(lastPendingActive)
    ) {
      setTimeout(() => {
        instrumentRef.current.scrollIntoView();
      }, 500);
      tradingViewStore.setSelectedHistory(lastPendingActive);
      instrumentsStore.switchInstrument(props.tradingHistoryItem.instrument);
    }
  }, []);

  const { t } = useTranslation();

  return (
    <Observer>
      {() => (
        <TradingHistoryItemWrapper
          flexDirection="column"
          padding="0 16px"
          onClick={switchInstrument}
          minHeight="57px"
          ref={instrumentRef}
          className={
            tradingViewStore.selectedHistory &&
            tradingViewStore.selectedHistory ===
              `${props.tradingHistoryItem.id}`
              ? 'active'
              : ''
          }
        >
          <TradingHistoryItemWrapperBorder
            padding="12px 0"
            justifyContent="space-between"
          >
            <FlexContainer alignItems="center">
              <FlexContainer margin="0 8px 0 0" flexDirection="column">
                <PrimaryTextSpan
                  fontSize="10px"
                  color={Colors.WHITE_LIGHT}
                >
                  {moment(closeDate).format('DD MMM')}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="10px"
                  color={Colors.WHITE_LIGHT}
                >
                  {moment(closeDate).format('HH:mm:ss')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer width="32px" height="32px" margin="0 8px 0 0">
                <ImageContainer instrumentId={instrument} />
              </FlexContainer>
              <FlexContainer flexDirection="column">
                <PrimaryTextSpan
                  marginBottom="2px"
                  color={Colors.ACCENT}
                  fontSize="12px"
                >
                  {positionInstrument()?.name}
                </PrimaryTextSpan>
                <FlexContainer margin="0 4px 0 0">
                  <FlexContainer margin="0 4px 0 0">
                    <SvgIcon
                      {...Icon}
                      fillColor={isBuy ? Colors.PRIMARY : Colors.DANGER}
                    />
                  </FlexContainer>
                  <PrimaryTextSpan
                    fontSize="12px"
                    color={isBuy ? Colors.PRIMARY : Colors.DANGER}
                  >
                    {isBuy ? t('Buy') : t('Sell')}
                  </PrimaryTextSpan>
                </FlexContainer>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer flexDirection="column" alignItems="flex-end">
              <PrimaryTextSpan
                color={Colors.ACCENT}
                fontSize="12px"
                marginBottom="4px"
              >
                {currencySymbol}
                {investmentAmount.toFixed(2)}
              </PrimaryTextSpan>
              <PrimaryTextSpan color={Colors.WHITE_LIGHT} fontSize="10px">
                &times;{leverage}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer>
              <FlexContainer
                margin="0 4px 0 0"
                flexDirection="column"
                alignItems="flex-end"
              >
                <QuoteText
                  fontSize="12px"
                  isGrowth={profit >= 0}
                  marginBottom="4px"
                >
                  {getNumberSign(profit)}
                  {currencySymbol}
                  {Math.abs(profit).toFixed(2)}
                </QuoteText>
                <PrimaryTextSpan
                  color={Colors.WHITE_LIGHT}
                  fontSize="10px"
                >
                  {profit >= 0 ? '+' : ''}
                  {calculateInPercent(investmentAmount, profit)}%
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer ref={popupWrapperRef}>
                <InformationPopup
                  classNameTooltip={`trading_history_${id}`}
                  bgColor="#000"
                  width="250px"
                  direction="bottomLeft"
                  needScroll={needScroll}
                >
                  <InfoInner flexDirection="column" width="100%">
                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 8px 0"
                    >
                      <PrimaryTextSpan
                        color={Colors.WHITE_LIGHT}
                        fontSize="12px"
                      >
                        {t('Price opened')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                        {t('at')} {currencySymbol}
                        {openPrice.toFixed(+precision)}
                      </PrimaryTextSpan>
                    </FlexContainer>
                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 8px 0"
                    >
                      <PrimaryTextSpan
                        color={Colors.WHITE_LIGHT}
                        fontSize="12px"
                      >
                        {t('Price closed')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                        {t('at')} {currencySymbol}
                        {closePrice.toFixed(+precision)}
                      </PrimaryTextSpan>
                    </FlexContainer>
                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 8px 0"
                    >
                      <PrimaryTextSpan
                        color={Colors.WHITE_LIGHT}
                        fontSize="12px"
                      >
                        {t('Opened')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                        {moment(openDate).format('DD MMM, HH:mm:ss')}
                      </PrimaryTextSpan>
                    </FlexContainer>
                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 8px 0"
                    >
                      <PrimaryTextSpan
                        color={Colors.WHITE_LIGHT}
                        fontSize="12px"
                      >
                        {t('Closed')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                        {moment(closeDate).format('DD MMM, HH:mm:ss')}
                      </PrimaryTextSpan>
                    </FlexContainer>
                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 8px 0"
                    >
                      <PrimaryTextSpan
                        color={Colors.WHITE_LIGHT}
                        fontSize="12px"
                      >
                        {t('Equity')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                        {getNumberSign(+equity.toFixed(2))}
                        {currencySymbol}
                        {Math.abs(equity).toFixed(2)}
                      </PrimaryTextSpan>
                    </FlexContainer>
                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 8px 0"
                    >
                      <PrimaryTextSpan
                        color={Colors.WHITE_LIGHT}
                        fontSize="12px"
                        marginRight="20px"
                      >
                        {t('Overnight fee')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                        {getNumberSign(swaps)}
                        {currencySymbol}
                        {Math.abs(swaps + commission).toFixed(2)}
                      </PrimaryTextSpan>
                    </FlexContainer>
                    {reservedFundsForToppingUp !== 0 && (
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
                          {'$'}
                          {Math.abs(reservedFundsForToppingUp).toFixed(2)}
                        </PrimaryTextSpan>
                      </FlexContainer>
                    )}

                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 8px 0"
                    >
                      <PrimaryTextSpan
                        color={Colors.WHITE_LIGHT}
                        fontSize="12px"
                      >
                        {t('Closing Reason')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                        {t(closingReasonText[closeReason])}
                      </PrimaryTextSpan>
                    </FlexContainer>
                    <FlexContainer justifyContent="space-between">
                      <PrimaryTextSpan
                        color={Colors.WHITE_LIGHT}
                        fontSize="12px"
                      >
                        {t('Position ID')}
                      </PrimaryTextSpan>
                      <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                        {id}
                      </PrimaryTextSpan>
                    </FlexContainer>
                  </InfoInner>
                </InformationPopup>
              </FlexContainer>
            </FlexContainer>
          </TradingHistoryItemWrapperBorder>
        </TradingHistoryItemWrapper>
      )}
    </Observer>
  );
};

export default TradingHistoryItem;

const TradingHistoryItemWrapperBorder = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

const InfoInner = styled(FlexContainer)`
  position: relative;
`;

const TradingHistoryItemWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;
  will-change: background-color;

  &:hover,
  &.active {
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
`;
