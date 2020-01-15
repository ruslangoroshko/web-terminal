import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import { AskBidEnum } from '../../enums/AskBid';
import SvgIcon from '../SvgIcon';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import test from '../../assets/images/test2.png';
import { useStores } from '../../hooks/useStores';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import API from '../../helpers/API';
import { PositionModelWSDTO } from '../../types/Positions';
import { getProcessId } from '../../helpers/getProcessId';
import moment from 'moment';
import NotificationTooltip from '../NotificationTooltip';

interface Props {
  position: PositionModelWSDTO;
}

const ActivePositionsPortfolioTab: FC<Props> = observer(props => {
  const {
    position: {
      instrument,
      investmentAmount,
      multiplier,
      openDate,
      openPrice,
      operation,
      commission,
      swap,
      id,
    },
  } = props;

  const isBuy = operation === AskBidEnum.Buy;

  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const calculateInPercent = (total: number, part: number) => {
    return ((part / total) * 100).toFixed(2);
  };

  const { quotesStore, mainAppStore } = useStores();

  const PnL = calculateFloatingProfitAndLoss({
    investment: investmentAmount,
    leverage: multiplier,
    costs: swap + commission,
    side: isBuy ? 1 : -1,
    currentPrice: isBuy
      ? quotesStore.quotes[instrument].bid.c
      : quotesStore.quotes[instrument].ask.c,
    openPrice: openPrice,
  });

  const closePosition = () => {
    API.closePosition({
      accountId: mainAppStore.account!.id,
      positionId: id,
      processId: getProcessId(),
    });
  };

  return (
    <InstrumentInfoWrapper padding="8px 0" justifyContent="space-between">
      <FlexContainer width="32px" alignItems="flex-start">
        <img src={test} style={{ display: 'block', objectFit: 'contain' }} />
      </FlexContainer>
      <FlexContainer flexDirection="column" margin="0 6px 0 0">
        <PrimaryTextSpan fontSize="12px" lineHeight="14px" marginBottom="2px">
          {instrument}
        </PrimaryTextSpan>
        <FlexContainer margin="0 0 12px 0" alignItems="center">
          <FlexContainer margin="0 4px 0 0">
            <SvgIcon {...Icon} fillColor={isBuy ? '#00FFDD' : '#ED145B'} />
          </FlexContainer>
          <PrimaryTextSpan
            fontSize="10px"
            color={isBuy ? '#00FFDD' : '#ED145B'}
            textTransform="uppercase"
            fontWeight="bold"
          >
            {isBuy ? 'Buy' : 'Sell'}
          </PrimaryTextSpan>
        </FlexContainer>
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.5)"
          fontSize="10px"
          lineHeight="12px"
        >
          {moment(openDate).format('DD MMM, HH:mm')}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer flexDirection="column" alignItems="flex-end">
        <PrimaryTextSpan marginBottom="4px" fontSize="12px" lineHeight="14px">
          {mainAppStore.account?.symbol}
          {investmentAmount}
        </PrimaryTextSpan>
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.5)"
          fontSize="10px"
          lineHeight="12px"
          marginBottom="12px"
        >
          &times;{multiplier}
        </PrimaryTextSpan>

        <NotificationTooltip
          classNameTooltip={`position_${id}`}
          bgColor="#000"
          width="200px"
          isRightDirection
        >
          <FlexContainer flexDirection="column" width="100%">
            <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
              <PrimaryTextSpan color="rgba(255, 255, 255, 0.4)" fontSize="12px">
                Price opened
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#fffccc" fontSize="12px">
                at {openPrice}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
              <PrimaryTextSpan color="rgba(255, 255, 255, 0.4)" fontSize="12px">
                Opened
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#fffccc" fontSize="12px">
                {moment(openDate).format('DD MMM, HH:mm')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
              <PrimaryTextSpan color="rgba(255, 255, 255, 0.4)" fontSize="12px">
                Equity
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#fffccc" fontSize="12px">
                {mainAppStore.account?.symbol}
                {PnL + investmentAmount}
              </PrimaryTextSpan>
            </FlexContainer>
            {/* <FlexContainer justifyContent="space-between" margin="0 8px 0 0">
              <PrimaryTextSpan color="rgba(255, 255, 255, 0.4)" fontSize="12px">
               Overnight fee
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#fffccc" fontSize="12px">
                at {openPrice}
              </PrimaryTextSpan>
            </FlexContainer> */}
            <FlexContainer justifyContent="space-between">
              <PrimaryTextSpan color="rgba(255, 255, 255, 0.4)" fontSize="12px">
                Position ID
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#fffccc" fontSize="12px">
                {id}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>
        </NotificationTooltip>
      </FlexContainer>
      <FlexContainer flexDirection="column">
        <FlexContainer justifyContent="flex-end" margin="0 0 8px 0">
          <FlexContainer
            flexDirection="column"
            alignItems="flex-end"
            margin="0 8px 0 0"
          >
            <QuoteText
              isGrowth={PnL >= 0}
              marginBottom="4px"
              fontSize="12px"
              lineHeight="14px"
            >
              {PnL >= 0 ? '+' : '-'}
              {mainAppStore.account?.symbol}
              {Math.abs(PnL)}
            </QuoteText>
            <PrimaryTextSpan
              fontSize="10px"
              lineHeight="12px"
              color="rgba(255, 255, 255, 0.5)"
            >
              {PnL >= 0 ? '+' : ''}
              {calculateInPercent(investmentAmount, PnL)}%
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer>
          <SetSLTPButton>
            <PrimaryTextSpan
              fontSize="12px"
              lineHeight="14px"
              color="rgba(255, 255, 255, 0.6)"
            >
              TP SL
            </PrimaryTextSpan>
          </SetSLTPButton>
          <CloseButton onClick={closePosition}>
            <PrimaryTextSpan fontSize="12px" lineHeight="14px">
              Close
            </PrimaryTextSpan>
          </CloseButton>
        </FlexContainer>
      </FlexContainer>
    </InstrumentInfoWrapper>
  );
});

export default ActivePositionsPortfolioTab;

const InstrumentInfoWrapper = styled(FlexContainer)``;

const CloseButton = styled(ButtonWithoutStyles)`
  border-radius: 3px;
  padding: 4px 8px;
  position: relative;
  overflow: hidden;
  transition: background-color 0.2s ease;
  background-color: rgba(255, 255, 255, 0.12);

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }
`;

const SetSLTPButton = styled(ButtonWithoutStyles)`
  padding: 4px 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 3px;
  transition: background-color 0.2s ease;
  margin-right: 8px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }
`;
