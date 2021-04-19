import React, { useState, useCallback, useEffect, FC } from 'react';
import { useStores } from '../../hooks/useStores';
import { AskBidEnum } from '../../enums/AskBid';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import { autorun } from 'mobx';
import { QuoteText } from '../../styles/TextsElements';
import { PositionModelWSDTO } from '../../types/Positions';
import { getNumberSign } from '../../helpers/getNumberSign';
import { logger } from '../../helpers/ConsoleLoggerTool';

interface Props {
  position: PositionModelWSDTO;
}

const ActivePositionEquity: FC<Props> = ({ position }) => {
  const { quotesStore, mainAppStore } = useStores();
  const isBuy = position.operation === AskBidEnum.Buy;

  const [statePnL, setStatePnL] = useState<number | null>(null);

  const workCallback = useCallback(
    (quote) => {
      setStatePnL(
        calculateFloatingProfitAndLoss({
          investment: position.investmentAmount,
          multiplier: position.multiplier,
          costs: position.swap + position.commission,
          side: isBuy ? 1 : -1,
          currentPrice: isBuy ? quote.bid.c : quote.ask.c,
          openPrice: position.openPrice,
        })
      );
    },
    [position]
  );

  useEffect(() => {
    const disposer = autorun(
      () => {
        if (quotesStore.quotes[position.instrument]) {
          workCallback(quotesStore.quotes[position.instrument]);
        }
      },
      { delay: 1000 }
    );
    return () => {
      disposer();
    };
  }, []);

  return statePnL !== null ? (
    <QuoteText
      isGrowth={statePnL + position.investmentAmount > 0}
      fontSize="14px"
    >
      {getNumberSign(+(statePnL + position.investmentAmount + position.reservedFundsForToppingUp).toFixed(2))}
      {mainAppStore.activeAccount?.symbol}
      {Math.abs(statePnL + position.investmentAmount + position.reservedFundsForToppingUp).toFixed(2)}
    </QuoteText>
  ) : null;
};

export default ActivePositionEquity;
