import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import SvgIcon from '../SvgIcon';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import { AskBidEnum } from '../../enums/AskBid';
import moment from 'moment';
import { getNumberSign } from '../../helpers/getNumberSign';
import { Observer, observer } from 'mobx-react-lite';
import InformationPopup from '../InformationPopup';
import { calculateInPercent } from '../../helpers/calculateInPercent';
import { PositionHistoryDTO } from '../../types/HistoryReportTypes';
import { DisplayContents, Td } from '../../styles/TableElements';
import ImageContainer from '../ImageContainer';

interface Props {
  tradingHistoryItem: PositionHistoryDTO;
  currencySymbol: string;
}

const TradingHistoryExpandedItem: FC<Props> = props => {
  const {
    tradingHistoryItem: {
      closeDate,
      closePrice,
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
  const isBuy = operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  return (
    <DisplayContents>
      <Td>
        <FlexContainer width="32px" height="32px">
          <ImageContainer instrumentId={instrument} />
        </FlexContainer>
        <FlexContainer flexDirection="column" width="170px">
          <PrimaryTextSpan fontSize="14px" color="#fffccc" marginBottom="4px">
            {instrument}
          </PrimaryTextSpan>
          <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.4)">
            {instrument}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td>
        <FlexContainer>
          <FlexContainer margin="0 6px 0 0">
            <SvgIcon {...Icon} fillColor={isBuy ? '#00FFDD' : '#ED145B'} />
          </FlexContainer>
          <FlexContainer flexDirection="column">
            <PrimaryTextSpan
              fontSize="14px"
              lineHeight="20px"
              color={isBuy ? '#00FFDD' : '#ED145B'}
              textTransform="uppercase"
              marginBottom="2px"
            >
              {isBuy ? 'Buy' : 'Sell'}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              fontSize="11px"
              color="rgba(255, 255, 255, 0.4)"
              whiteSpace="nowrap"
            >
              {openPrice} &mdash; {closePrice}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
      </Td>
      <Td>
        <FlexContainer alignItems="center">
          <FlexContainer flexDirection="column" margin="0 10px 0 0">
            <PrimaryTextSpan
              color="#fffccc"
              fontSize="14px"
              lineHeight="20px"
              marginBottom="2px"
            >
              {moment(openDate).format('DD MMM')}
            </PrimaryTextSpan>
            <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="11px">
              {moment(openDate).format('HH:mm:ss')}
            </PrimaryTextSpan>
          </FlexContainer>
          <PrimaryTextSpan
            fontSize="12px"
            color="rgba(255, 255, 255, 0.5)"
            marginRight="10px"
          >
            &mdash;
          </PrimaryTextSpan>
          <FlexContainer flexDirection="column">
            <PrimaryTextSpan
              color="#fffccc"
              fontSize="14px"
              lineHeight="20px"
              marginBottom="2px"
            >
              {moment(closeDate).format('DD MMM')}
            </PrimaryTextSpan>
            <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="11px">
              {moment(closeDate).format('HH:mm:ss')}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
      </Td>
      <Td justifyContent="flex-end">
        <FlexContainer flexDirection="column" alignItems="flex-end">
          <PrimaryTextSpan
            color="#fffccc"
            fontSize="14px"
            lineHeight="20px"
            marginBottom="2px"
          >
            {currencySymbol}
            {investmentAmount}
          </PrimaryTextSpan>
          <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="11px">
            &times;{leverage}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td justifyContent="flex-end">
        <FlexContainer flexDirection="column" alignItems="flex-end">
          <Observer>
            {() => (
              <>
                <QuoteText
                  color="#fffccc"
                  fontSize="14px"
                  lineHeight="20px"
                  marginBottom="2px"
                  isGrowth={profit >= 0}
                >
                  {profit >= 0 ? '+' : '-'}
                  {currencySymbol}
                  {Math.abs(profit)}
                </QuoteText>
                <PrimaryTextSpan
                  fontSize="11px"
                  color="rgba(255, 255, 255, 0.4)"
                >
                  {profit >= 0 ? '+' : ''}
                  {calculateInPercent(investmentAmount, profit)}%
                </PrimaryTextSpan>
              </>
            )}
          </Observer>
        </FlexContainer>
      </Td>
      <Td justifyContent="flex-end" alignItems="center">
        <FlexContainer flexDirection="column" alignItems="flex-end">
          <QuoteText isGrowth={profit + investmentAmount > 0} fontSize="14px">
            {currencySymbol}
            {equity.toFixed(2)}
          </QuoteText>
        </FlexContainer>
      </Td>
      <Td justifyContent="center" alignItems="center">
        <FlexContainer flexDirection="column" alignItems="center">
          <InformationPopup
            classNameTooltip={`position_expaned_${id}`}
            bgColor="#000"
            width="200px"
            direction="left"
          >
            <FlexContainer flexDirection="column" width="100%">
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  Price opened
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  at {openPrice}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  Price closed
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  {closePrice}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  Opened
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  {moment(openPrice).format('DD MMM, HH:mm')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  Equity
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  {currencySymbol}
                  {equity.toFixed(2)}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  Overnight fee
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  -{currencySymbol}
                  {Math.abs(
                    swaps.reduce((acc, prev) => acc + prev.amount, 0)
                  ).toFixed(2)}
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
      </Td>
    </DisplayContents>
  );
};

export default TradingHistoryExpandedItem;
