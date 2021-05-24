import React, { useEffect, useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { QuoteText } from '../../styles/TextsElements';
import { getNumberSign } from '../../helpers/getNumberSign';
import { autorun, reaction } from 'mobx';
import { moneyFormatPart } from '../../helpers/moneyFormat';

const PortfolioTotalProfit = () => {
  const { quotesStore, mainAppStore } = useStores();
  const [profit, setProfit] = useState(quotesStore.profit);

  useEffect(() => {
    const dispose = reaction(
      () => quotesStore.profit,
      (newProfit) => setProfit(newProfit),
      {
        delay: 1000,
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
      {moneyFormatPart(Math.abs(profit)).int}

      <QuoteText
        isGrowth={profit >= 0}
        fontSize="14px"
        lineHeight="28px"
        fontWeight="bold"
      >
        .{moneyFormatPart(Math.abs(profit)).decimal}
      </QuoteText>
    </QuoteText>
  );
};

export default PortfolioTotalProfit;
