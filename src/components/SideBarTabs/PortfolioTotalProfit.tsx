import React, { useEffect, useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { QuoteText } from '../../styles/TextsElements';
import { getNumberSign } from '../../helpers/getNumberSign';
import { autorun, reaction } from 'mobx';

const PortfolioTotalProfit = () => {
  const { quotesStore, mainAppStore } = useStores();
  const [profit, setProfit] = useState(quotesStore.profit);

  useEffect(() => {
    const dispose = reaction(
      () => quotesStore.profit,
      (newProfit) => setProfit(newProfit),
      {
        delay: 2000,
      }
    );
    return dispose;
  }, []);
  return (
    <QuoteText
      isGrowth={profit >= 0}
      fontSize="24px"
      lineHeight="28px"
      fontWeight="bold"
      marginBottom="20px"
    >
      {getNumberSign(profit)}
      {mainAppStore.activeAccount?.symbol}
      {Math.abs(profit).toFixed(2)}
    </QuoteText>
  );
};

export default PortfolioTotalProfit;
