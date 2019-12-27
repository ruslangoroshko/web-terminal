import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import ColorsPallete from '../../styles/colorPallete';

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
        <LabelText>Available:</LabelText>
        <LabelValue>
          {symbol}
          {available.toFixed(2)}
        </LabelValue>
      </AmountWrapper>
      <AmountWrapper>
        <LabelText>Invest:</LabelText>
        <LabelValue>
          {symbol}
          {invest.toFixed(2)}
        </LabelValue>
      </AmountWrapper>
      <AmountWrapper>
        <LabelText>Profit:</LabelText>
        <ProfitValue isGrowth={+profit >= 0}>
          {symbol}
          {profit.toFixed(2)}
        </ProfitValue>
      </AmountWrapper>
      <AmountWrapper>
        <LabelText>Total:</LabelText>
        <LabelValue>
          {symbol}
          {total.toFixed(2)}
        </LabelValue>
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

const LabelText = styled.span`
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
  opacity: 0.4;
  margin-right: 8px;
`;

const LabelValue = styled.span`
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
`;

const ProfitValue = styled(LabelValue)<{ isGrowth: boolean }>`
  color: ${props =>
    props.isGrowth ? '#3CFF8A' : ColorsPallete.WILD_WATERLEMON};
`;
