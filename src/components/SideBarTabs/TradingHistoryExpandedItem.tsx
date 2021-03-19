import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import SvgIcon from '../SvgIcon';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import { AskBidEnum } from '../../enums/AskBid';
import moment from 'moment';
import { getNumberSign } from '../../helpers/getNumberSign';
import { Observer } from 'mobx-react-lite';
import InformationPopup from '../InformationPopup';
import { calculateInPercent } from '../../helpers/calculateInPercent';
import { PositionHistoryDTO } from '../../types/HistoryReportTypes';
import { DisplayContents, Td } from '../../styles/TableElements';
import ImageContainer from '../ImageContainer';
import { useTranslation } from 'react-i18next';
import useInstrumentPrecision from '../../hooks/useInstrumentPrecision';

interface Props {
  tradingHistoryItem: PositionHistoryDTO;
  currencySymbol: string;
}

const TradingHistoryExpandedItem: FC<Props> = (props) => {
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
      swap: swaps,
      reservedFundsForToppingUp
    },
    currencySymbol,
  } = props;
  const isBuy = operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;
  const { t } = useTranslation();

  const { precision } = useInstrumentPrecision(instrument);

  return (
    <DisplayContents>
      <Td>
        <FlexContainer width="32px" height="32px" marginRight="8px">
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
              {isBuy ? t('Buy') : t('Sell')}
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
            {investmentAmount.toFixed(2)}
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
                  {Math.abs(profit).toFixed(2)}
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
            width="250px"
            direction="left"
          >
            <FlexContainer flexDirection="column" width="100%">
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  {t('Price opened')}
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  {t('at')} {openPrice.toFixed(+precision)}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  {t('Price closed')}
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
                  {t('Opened')}
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  {moment(openDate).format('DD MMM, HH:mm:ss')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
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
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
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
                        {'$'}
                        {Math.abs(reservedFundsForToppingUp).toFixed(2)}
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
            </FlexContainer>
          </InformationPopup>
        </FlexContainer>
      </Td>
    </DisplayContents>
  );
};

export default TradingHistoryExpandedItem;
