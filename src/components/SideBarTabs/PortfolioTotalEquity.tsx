import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { autorun } from 'mobx';
import { moneyFormatPart } from '../../helpers/moneyFormat';

const PortfolioTotalEquity = () => {
  const { quotesStore, mainAppStore } = useStores();
  const [totalEquity, setTotalEquity] = useState(quotesStore.totalEquity);

  useEffect(() => {
    const dispose = autorun(
      () => {
        setTotalEquity(quotesStore.totalEquity);
      },
      {
        delay: 1000,
      }
    );
    return dispose;
  }, []);

  return (
    <PrimaryTextSpan fontSize="14px" lineHeight="16px" fontWeight="bold">
      {totalEquity < 0 && '-'}
      {mainAppStore.activeAccount?.symbol}
      {moneyFormatPart(Math.abs(totalEquity)).int}
      <PrimaryTextSpan fontSize="10px" lineHeight="16px" fontWeight="bold">
        .{moneyFormatPart(Math.abs(totalEquity)).decimal}
      </PrimaryTextSpan>
    </PrimaryTextSpan>
  );
};

export default PortfolioTotalEquity;
