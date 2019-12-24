import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import ColorsPallete from '../../styles/colorPallete';

interface Props {
  available: number;
  invest: number;
  profit: string;
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
          {available}
        </LabelValue>
      </AmountWrapper>
      <AmountWrapper>
        <LabelText>Invest:</LabelText>
        <LabelValue>
          {symbol}
          {invest}
        </LabelValue>
      </AmountWrapper>
      <AmountWrapper>
        <LabelText>Profit:</LabelText>
        <ProfitValue isGrowth={+profit >= 0}>
          {symbol}
          {profit}
        </ProfitValue>
      </AmountWrapper>
      <AmountWrapper>
        <LabelText>Total:</LabelText>
        <LabelValue>
          {symbol}
          {total}
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
    props.isGrowth ? ColorsPallete.MINT : ColorsPallete.RAZZMATAZZ};
`;
