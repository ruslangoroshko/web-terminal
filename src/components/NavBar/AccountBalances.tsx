import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import ColorsPallete from '../../styles/colorPallete';

interface Props {
  available: number;
  invest: number;
  profit: number;
  total: number;
  currency: string;
}

function AccountBalances(props: Props) {
  const { available, total, invest, profit, currency } = props;

  return (
    <>
      <AmountWrapper>
        <LabelText>Available:</LabelText>
        <LabelValue>
          {available} {currency}
        </LabelValue>
      </AmountWrapper>
      <AmountWrapper>
        <LabelText>Invest:</LabelText>
        <LabelValue>
          {invest} {currency}
        </LabelValue>
      </AmountWrapper>
      <AmountWrapper>
        <LabelText>Profit:</LabelText>
        <ProfitValue isGrowth={profit >= 0}>
          {profit} {currency}
        </ProfitValue>
      </AmountWrapper>
      <AmountWrapper>
        <LabelText>Total:</LabelText>
        <LabelValue>
          {total} {currency}
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
