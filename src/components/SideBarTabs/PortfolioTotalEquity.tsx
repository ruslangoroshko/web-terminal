import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { autorun } from 'mobx';

const PortfolioTotalEquity = () => {
  const { quotesStore, mainAppStore } = useStores();
  const [totalEquity, setTotalEquity] = useState(quotesStore.totalEquity);

  useEffect(() => {
    const dispose = autorun(
      () => {
        setTotalEquity(quotesStore.totalEquity);
      },
      {
        delay: 2000,
      }
    );
    return dispose;
  }, []);

  return (
    <PrimaryTextSpan fontSize="14px" lineHeight="16px" fontWeight="bold">
      {mainAppStore.activeAccount?.symbol}
      {Math.abs(totalEquity).toFixed(2)}
    </PrimaryTextSpan>
  );
};

export default PortfolioTotalEquity;
