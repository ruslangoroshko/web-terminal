import React, { FC, useRef, useEffect, useState, useCallback } from 'react';
import { PositionModelWSDTO } from '../../types/Positions';
import { useStores } from '../../hooks/useStores';
import { AskBidEnum } from '../../enums/AskBid';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { calculateInPercent } from '../../helpers/calculateInPercent';
import { autorun } from 'mobx';

interface Props {
  position: PositionModelWSDTO;
}

const ActivePositionPnLPercent: FC<Props> = ({ position }) => {
  const { quotesStore } = useStores();
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
  return (
    <PrimaryTextSpan
      fontSize="10px"
      lineHeight="12px"
      color="rgba(255, 255, 255, 0.5)"
      ref={textElementRef}
    >
      {statePnL !== null ? (
        <>
          {statePnL >= 0 ? '+' : ''}
          {calculateInPercent(position.investmentAmount, statePnL)}%
        </>
      ) : null}
    </PrimaryTextSpan>
  );
};

export default ActivePositionPnLPercent;
