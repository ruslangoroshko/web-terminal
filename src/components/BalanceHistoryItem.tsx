import React, { FC } from 'react';

import { BalanceHistoryDTO } from '../types/HistoryReportTypes';
import { DisplayContents, Td } from '../styles/TableElements';
import { PrimaryTextSpan, QuoteText } from '../styles/TextsElements';
import moment from 'moment';
import { useStores } from '../hooks/useStores';
import { getNumberSign } from '../helpers/getNumberSign';
import { FlexContainer } from '../styles/FlexContainer';

interface Props {
  balanceHistoryItem: BalanceHistoryDTO;
}

const BalanceHistoryItem: FC<Props> = props => {
  const {
    balanceHistoryItem: { amount, balance, createdAt, description },
  } = props;

  const { mainAppStore } = useStores();
  return (
    <DisplayContents>
      <Td alignItems="center">
        <FlexContainer padding="0 0 0 12px">
          <PrimaryTextSpan fontSize="12px" color="#fffccc">
            {moment(createdAt).format('DD MMM YYYY, HH:mm:ss')}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td alignItems="center">
        <QuoteText fontSize="12px" isGrowth={amount >= 0}>
          {getNumberSign(amount)}
          {mainAppStore.activeAccount?.symbol}
          {Math.abs(amount).toFixed(2)}
        </QuoteText>
      </Td>
      <Td alignItems="center">
        <PrimaryTextSpan fontSize="12px" color="#fffccc">
          {mainAppStore.activeAccount?.symbol}
          {balance.toFixed(2)}
        </PrimaryTextSpan>
      </Td>
      <Td alignItems="center">
        <FlexContainer padding="0 30px 0 0">
          <PrimaryTextSpan fontSize="12px" color="rgba(255, 255, 255, 0.6)">
            {description}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
    </DisplayContents>
  );
};

export default BalanceHistoryItem;
