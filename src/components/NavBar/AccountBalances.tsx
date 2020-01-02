import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import ColorsPallete from '../../styles/colorPallete';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';

interface Props {
  available: number;
  invest: number;
  profit: number;
  total: number;
  symbol: string;
}

function AccountBalances(props: Props) {
  const { available, total, invest, profit, symbol } = props;

  return (
    <>
      <AmountWrapper>
        <PrimaryTextSpan
          marginRight="8px"
          color="rgba(255, 255, 255, 0.4)"
          fontSize="12px"
        >
          Available:
        </PrimaryTextSpan>
        <PrimaryTextSpan fontSize="12px">
          {symbol}
          {available.toFixed(2)}
        </PrimaryTextSpan>
      </AmountWrapper>
      <AmountWrapper>
        <PrimaryTextSpan
          marginRight="8px"
          color="rgba(255, 255, 255, 0.4)"
          fontSize="12px"
        >
          Invest:
        </PrimaryTextSpan>
        <PrimaryTextSpan fontSize="12px">
          {symbol}
          {invest.toFixed(2)}
        </PrimaryTextSpan>
      </AmountWrapper>
      <AmountWrapper>
        <PrimaryTextSpan
          marginRight="8px"
          color="rgba(255, 255, 255, 0.4)"
          fontSize="12px"
        >
          Profit:
        </PrimaryTextSpan>
        <QuoteText isGrowth={+profit >= 0} fontSize="12px">
          {symbol}
          {profit.toFixed(2)}
        </QuoteText>
      </AmountWrapper>
      <AmountWrapper>
        <PrimaryTextSpan
          marginRight="8px"
          color="rgba(255, 255, 255, 0.4)"
          fontSize="12px"
        >
          Total:
        </PrimaryTextSpan>
        <PrimaryTextSpan fontSize="12px">
          {symbol}
          {total.toFixed(2)}
        </PrimaryTextSpan>
      </AmountWrapper>
    </>
  );
}

export default AccountBalances;

const AmountWrapper = styled(FlexContainer)`
  margin-right: 24px;
  &:last-of-type {
    margin-right: 0;
  }
`;
