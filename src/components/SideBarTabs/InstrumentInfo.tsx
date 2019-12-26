import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { AskBidEnum } from '../../enums/AskBid';
import SvgIcon from '../SvgIcon';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';

interface Props {
  instrument: string;
  operationType: AskBidEnum;
  multiplier: number;
  investmentAmount: number;
  openPrice: number;
  openDate: number;
  symbol: string;
}

const InstrumentInfo: FC<Props> = observer(props => {
  const {
    instrument,
    investmentAmount,
    multiplier,
    openDate,
    openPrice,
    operationType,
    symbol,
  } = props;
  const isBuy = operationType === AskBidEnum.Buy;

  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const calculateInPercent = (total: number, part: number) => {
    return ((part / total) * 100).toFixed(2);
  };

  return (
    <InstrumentInfoWrapper padding="8px 0">
      <FlexContainer margin="0 8px 0 0" width="32px"></FlexContainer>
      <FlexContainer flexDirection="column">
        <PrimaryTextSpan>{instrument}</PrimaryTextSpan>
        <FlexContainer margin="0 0 12px 0">
          <FlexContainer margin="0 4px 0 0">
            <SvgIcon {...Icon} />
          </FlexContainer>
          <PrimaryTextSpan color={isBuy ? '#00FFDD' : '#ED145B'}>
            {isBuy ? 'Buy' : 'Sell'}
          </PrimaryTextSpan>
        </FlexContainer>
        <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)">
          Open {openDate}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer flexDirection="column">
        <PrimaryTextSpan color="#ffffff" marginBottom="4px">
          {symbol}
          {investmentAmount}
        </PrimaryTextSpan>
        <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)">x{multiplier}</PrimaryTextSpan>
      </FlexContainer>
    </InstrumentInfoWrapper>
  );
});

export default InstrumentInfo;

const InstrumentInfoWrapper = styled(FlexContainer)`
  border-top: 1px solid #1a1e22;
`;
