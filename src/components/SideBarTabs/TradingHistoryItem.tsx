import React, { useRef } from 'react';
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

interface Props {
  tradingHistoryItem: PositionHistoryDTO;
  currencySymbol: string;
}

function TradingHistoryItem(props: Props) {
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
      swaps,
    },
    currencySymbol,
  } = props;

  // TODO: think about rotate 180
  const isBuy = operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const popupWrapperRef = useRef<HTMLDivElement>(null);

  const { instrumentsStore } = useStores();

  const switchInstrument = (e: any) => {
    if (popupWrapperRef.current && popupWrapperRef.current.contains(e.target)) {
      e.preventDefault();
    } else {
      instrumentsStore.swiitchInstrument(instrument);
    }
  };

  return (
    <TradingHistoryItemWrapper
      flexDirection="column"
      padding="0 16px"
      onClick={switchInstrument}
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
              {moment(closeDate).format('hh:mm')}
            </PrimaryTextSpan>
          </FlexContainer>
          <FlexContainer width="32px" height="32px" margin="0 8px 0 0">
            image
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
                {isBuy ? 'Buy' : 'Sell'}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer flexDirection="column" alignItems="flex-end">
          <PrimaryTextSpan color="#fffccc" fontSize="12px" marginBottom="4px">
            {investmentAmount}
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
              {Math.abs(profit)}
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
              direction="left"
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
                    Price opened
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    at {currencySymbol}
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
                    Price closed
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    at {currencySymbol}
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
                    Opened
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    {moment(openDate).format('DD MMM, HH:mm')}
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
                    Closed
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    {moment(closeDate).format('DD MMM, HH:mm')}
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
                    Equity
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    {currencySymbol}
                    {equity}
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
                    Overnight fee
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    {currencySymbol}
                    {swaps
                      .reduce((acc, prev) => acc + prev.amount, 0)
                      .toFixed(2)}
                  </PrimaryTextSpan>
                </FlexContainer>
                <FlexContainer justifyContent="space-between">
                  <PrimaryTextSpan
                    color="rgba(255, 255, 255, 0.4)"
                    fontSize="12px"
                  >
                    Position ID
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    {id}
                  </PrimaryTextSpan>
                </FlexContainer>
              </FlexContainer>
            </InformationPopup>
          </FlexContainer>
        </FlexContainer>
      </TradingHistoryItemWrapperBorder>
    </TradingHistoryItemWrapper>
  );
}

export default TradingHistoryItem;

const TradingHistoryItemWrapperBorder = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

const TradingHistoryItemWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
`;
