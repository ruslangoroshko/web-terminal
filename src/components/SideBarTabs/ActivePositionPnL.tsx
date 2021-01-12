import React, { FC, useEffect, useState, useRef, useCallback } from 'react';
import { PositionModelWSDTO } from '../../types/Positions';
import { useStores } from '../../hooks/useStores';
import { AskBidEnum } from '../../enums/AskBid';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import { QuoteText } from '../../styles/TextsElements';
import { autorun } from 'mobx';

interface Props {
  position: PositionModelWSDTO;
}

const ActivePositionPnL: FC<Props> = ({ position }) => {
  const { quotesStore, mainAppStore } = useStores();
  const isBuy = position.operation === AskBidEnum.Buy;
  const textElementRef = useRef<HTMLSpanElement>(null);
  const [canRenderFlag, setCanRenderFlag] = useState(false);

  const [statePnL, setStatePnL] = useState<number | null>(null);

  const workCallback = useCallback(
    (quote, canRenderFlag) => {
      if (canRenderFlag) {
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
      }
    },
    [position]
  );

  const autorunCallback = useCallback(
    () =>
      autorun(
        () => {
          if (quotesStore.quotes[position.instrument]) {
            workCallback(
              quotesStore.quotes[position.instrument],
              canRenderFlag
            );
          }
        },
        { delay: 1000 }
      ),
    [canRenderFlag]
  );

  useEffect(() => {
    const disposer = autorunCallback();
    if (!canRenderFlag) {
      disposer();
    }
    return () => {
      disposer();
    };
  }, [canRenderFlag]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '5px',
      threshold: 1,
    };

    const callback: IntersectionObserverCallback = function (entries) {
      entries.forEach((item) => {
        setCanRenderFlag(item.intersectionRatio === 1);
      });
    };

    const observer = new IntersectionObserver(callback, options);
    if (textElementRef.current) {
      observer.observe(textElementRef.current);
    }
    return () => {
      if (textElementRef.current) {
        observer.unobserve(textElementRef.current);
      }
    };
  }, []);

  return statePnL !== null ? (
    <QuoteText
      isGrowth={statePnL >= 0}
      marginBottom="4px"
      fontSize="12px"
      lineHeight="14px"
      ref={textElementRef}
    >
      {statePnL >= 0 ? '+' : '-'}
      {mainAppStore.activeAccount?.symbol}
      {Math.abs(statePnL).toFixed(2)}
    </QuoteText>
  ) : null;
};
export default ActivePositionPnL;
