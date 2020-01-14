import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import { AskBidEnum } from '../../enums/AskBid';
import SvgIcon from '../SvgIcon';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import IconSettings from '../../assets/svg/icon-settings.svg';
import test from '../../assets/images/test2.png';
import { useStores } from '../../hooks/useStores';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import API from '../../helpers/API';
import { PositionModelWSDTO } from '../../types/Positions';
import { getProcessId } from '../../helpers/getProcessId';
import moment from 'moment';

interface Props {
  position: PositionModelWSDTO;
}

const InstrumentInfoPortfolioTab: FC<Props> = observer(props => {
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
            <SvgIcon {...Icon} fill={isBuy ? '#00FFDD' : '#ED145B'} />
          </FlexContainer>
          <PrimaryTextSpan
            fontSize="10px"
            color={isBuy ? '#00FFDD' : '#ED145B'}
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
        >
          &times;{multiplier}
        </PrimaryTextSpan>
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
              marginBottom="6px"
              fontSize="10px"
              lineHeight="12px"
              color="rgba(255, 255, 255, 0.5)"
            >
              {calculateInPercent(investmentAmount, PnL)}
            </PrimaryTextSpan>
          </FlexContainer>
          <FlexContainer alignItems="flex-start">
            <ButtonWithoutStyles>
              <InfoIcon
                width="14px"
                justifyContent="center"
                alignItems="center"
              >
                i
              </InfoIcon>
            </ButtonWithoutStyles>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer>
          <FlexContainer margin="0 8px 0 0">
            <ButtonWithoutStyles>
              <SvgIcon {...IconSettings} fill="rgba(255, 255, 255, 0.6)" />
            </ButtonWithoutStyles>
          </FlexContainer>
          <SetSLTPButton onClick={closePosition}>
            <PrimaryTextSpan fontSize="12px" lineHeight="14px">
              Close
            </PrimaryTextSpan>
          </SetSLTPButton>
        </FlexContainer>
      </FlexContainer>
    </InstrumentInfoWrapper>
  );
});

export default InstrumentInfoPortfolioTab;

const InstrumentInfoWrapper = styled(FlexContainer)``;

const SetSLTPButton = styled(ButtonWithoutStyles)`
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

const InfoIcon = styled(FlexContainer)`
  font-size: 11px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fffccc;
  font-style: italic;
`;
