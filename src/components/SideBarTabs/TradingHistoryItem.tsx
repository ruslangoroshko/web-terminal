import React, { FC, useEffect, useRef } from 'react';
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
    },
    currencySymbol,
    needScroll,
  } = props;

  // TODO: think about rotate 180
  const isBuy = operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const popupWrapperRef = useRef<HTMLDivElement>(null);
  const instrumentRef = useRef<HTMLDivElement>(document.createElement("div"));

  const { instrumentsStore, tradingViewStore } = useStores();

  const switchInstrument = (e: any) => {
    localStorage.setItem(LOCAL_HISTORY_POSITION, `${props.tradingHistoryItem.id}`);
    tradingViewStore.selectedHistory = `${props.tradingHistoryItem.id}`;
    if (popupWrapperRef.current && popupWrapperRef.current.contains(e.target)) {
      e.preventDefault();
    } else {
      instrumentsStore.switchInstrument(instrument);
    }
  };

  useEffect(() => {
    const lastPendingActive = localStorage.getItem(LOCAL_HISTORY_POSITION);
    if (!!lastPendingActive && props.tradingHistoryItem.id === parseFloat(lastPendingActive)) {
      setTimeout(() => {
        instrumentRef.current.scrollIntoView();
      }, 500)
      tradingViewStore.selectedHistory = lastPendingActive;
      instrumentsStore.switchInstrument(props.tradingHistoryItem.instrument);
    }
  }, [])

  const { t } = useTranslation();

  return (
    <Observer>
      {() => <TradingHistoryItemWrapper
        flexDirection="column"
        padding="0 16px"
        onClick={switchInstrument}
        minHeight="57px"
        ref={instrumentRef}
        className={tradingViewStore.selectedHistory
        && tradingViewStore.selectedHistory === `${props.tradingHistoryItem.id}`
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
              <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.4)">
                {moment(closeDate).format('DD MMM')}
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.4)">
                {moment(closeDate).format('HH:mm:ss')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer width="32px" height="32px" margin="0 8px 0 0">
              <ImageContainer instrumentId={instrument} />
            </FlexContainer>
            <FlexContainer flexDirection="column">
              <PrimaryTextSpan marginBottom="2px" color="#fffccc" fontSize="12px">
                {instrument}
              </PrimaryTextSpan>
              <FlexContainer margin="0 4px 0 0">
                <FlexContainer margin="0 4px 0 0">
                  <SvgIcon {...Icon} fillColor={isBuy ? '#00FFDD' : '#ED145B'} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontSize="12px"
                  color={isBuy ? '#00FFDD' : '#ED145B'}
                >
                  {isBuy ? t('Buy') : t('Sell')}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer flexDirection="column" alignItems="flex-end">
            <PrimaryTextSpan color="#fffccc" fontSize="12px" marginBottom="4px">
              {currencySymbol}
              {investmentAmount.toFixed(2)}
            </PrimaryTextSpan>
            <PrimaryTextSpan color="rgba(255, 255, 255, 0.4)" fontSize="10px">
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
              <PrimaryTextSpan color="rgba(255, 255, 255, 0.4)" fontSize="10px">
                {profit >= 0 ? '+' : ''}
                {calculateInPercent(investmentAmount, profit)}%
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer ref={popupWrapperRef}>
              <InformationPopup
                classNameTooltip={`trading_history_${id}`}
                bgColor="#000"
                width="200px"
                direction="bottomLeft"
                needScroll={needScroll}
              >
                <InfoInner flexDirection="column" width="100%">
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
                      {t('at')} {currencySymbol}
                      {openPrice}
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
                      {t('Price closed')}
                    </PrimaryTextSpan>
                    <PrimaryTextSpan color="#fffccc" fontSize="12px">
                      {t('at')} {currencySymbol}
                      {closePrice}
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
                      {moment(openDate).format('DD MMM, HH:mm:ss')}
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
                      {t('Closed')}
                    </PrimaryTextSpan>
                    <PrimaryTextSpan color="#fffccc" fontSize="12px">
                      {moment(closeDate).format('DD MMM, HH:mm:ss')}
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
                    <PrimaryTextSpan color="#fffccc" fontSize="12px">
                      {currencySymbol}
                      {equity.toFixed(2)}
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
                      {t('Overnight fee')}
                    </PrimaryTextSpan>
                    <PrimaryTextSpan color="#fffccc" fontSize="12px">
                      {getNumberSign(swaps)}
                      {currencySymbol}
                      {Math.abs(swaps).toFixed(2)}
                    </PrimaryTextSpan>
                  </FlexContainer>
                  <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                    <PrimaryTextSpan
                      color="rgba(255, 255, 255, 0.4)"
                      fontSize="12px"
                    >
                      {t('Closing Reason')}
                    </PrimaryTextSpan>
                    <PrimaryTextSpan color="#fffccc" fontSize="12px">
                      {t(closingReasonText[closeReason])}
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
                      {id}
                    </PrimaryTextSpan>
                  </FlexContainer>
                </InfoInner>
              </InformationPopup>
            </FlexContainer>
          </FlexContainer>
        </TradingHistoryItemWrapperBorder>
      </TradingHistoryItemWrapper>}
    </Observer>
  );
}

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
