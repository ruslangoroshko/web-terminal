import React, { FC } from 'react';

import { BalanceHistoryDTO } from '../types/HistoryReportTypes';
import { DisplayContents, Td } from '../styles/TableElements';
import { PrimaryTextSpan, QuoteText } from '../styles/TextsElements';
import moment from 'moment';
import { useStores } from '../hooks/useStores';
import { getNumberSign } from '../helpers/getNumberSign';

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
      <Td alignItems="center" padding="0 0 0 12px">
        <PrimaryTextSpan fontSize="12px" color="#fffccc">
          {moment(createdAt).format('DD MMM yyyy, HH:mm:ss')}
        </PrimaryTextSpan>
      </Td>
      <Td alignItems="center">
        <QuoteText fontSize="12px" isGrowth={amount >= 0}>
          {getNumberSign(amount)}
          {mainAppStore.activeAccount?.symbol}
          {Math.abs(amount)}
        </QuoteText>
      </Td>
      <Td alignItems="center">
        <PrimaryTextSpan fontSize="12px" color="#fffccc">
          {mainAppStore.activeAccount?.symbol}
          {balance}
        </PrimaryTextSpan>
      </Td>
      <Td alignItems="center">
        <PrimaryTextSpan fontSize="12px" color="rgba(255, 255, 255, 0.6)">
          {description}
        </PrimaryTextSpan>
      </Td>
    </DisplayContents>
  );
};

export default BalanceHistoryItem;
