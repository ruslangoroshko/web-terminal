import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import { getNumberSign } from '../../helpers/getNumberSign';
import { useTranslation } from 'react-i18next';

interface Props {
  available: number;
  invest: number;
  profit: number;
  total: number;
  symbol: string;
}

function AccountBalances(props: Props) {
  const { available, total, invest, profit, symbol } = props;
  const { t } = useTranslation();
  return (
    <>
      <AmountWrapper>
        <PrimaryTextSpan
          marginRight="8px"
          color="rgba(255, 255, 255, 0.4)"
          fontSize="12px"
        >
          {t('Available')}:
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
          {t('Invest')}:
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
          {t('Profit')}:
        </PrimaryTextSpan>
        <QuoteText isGrowth={+profit >= 0} fontSize="12px">
          {getNumberSign(profit)}
          {symbol}
          {Math.abs(profit).toFixed(2)}
        </QuoteText>
      </AmountWrapper>
      <AmountWrapper>
        <PrimaryTextSpan
          marginRight="8px"
          color="rgba(255, 255, 255, 0.4)"
          fontSize="12px"
        >
          {t('Total')}:
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
