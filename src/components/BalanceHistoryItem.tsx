import React, { FC } from 'react';

import { BalanceHistoryDTO } from '../types/HistoryReportTypes';
import { DisplayContents, Td } from '../styles/TableElements';
import { PrimaryTextSpan, QuoteText } from '../styles/TextsElements';
import moment from 'moment';
import { useStores } from '../hooks/useStores';

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
      <Td flexDirection="column">
        <PrimaryTextSpan fontSize="12px" color="#fffccc">
          {moment(createdAt).format('DD MMM yyyy, HH:mm:ss')}
        </PrimaryTextSpan>
      </Td>
      <Td flexDirection="column">
        <QuoteText fontSize="12px">
          {mainAppStore.activeAccount?.symbol}
          {amount}
        </QuoteText>
      </Td>
      <Td>
        <PrimaryTextSpan fontSize="12px" color="#fffccc">
          {mainAppStore.activeAccount?.symbol}
          {balance}
        </PrimaryTextSpan>
      </Td>
      <Td justifyContent="flex-end">
        <PrimaryTextSpan fontSize="12px" color="rgba(255, 255, 255, 0.6)">
          {description}
        </PrimaryTextSpan>
      </Td>
    </DisplayContents>
  );
};

export default BalanceHistoryItem;
