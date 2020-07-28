import React, { useRef, useEffect, FC, useState, useCallback } from 'react';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { getNumberSign } from '../../helpers/getNumberSign';
import { useStores } from '../../hooks/useStores';
import { AskBidEnum } from '../../enums/AskBid';
import { PositionModelWSDTO } from '../../types/Positions';
import { autorun } from 'mobx';

interface Props {
  position: PositionModelWSDTO;
}

const EquityPnL: FC<Props> = ({ position }) => {
  const { quotesStore, mainAppStore } = useStores();
  const isBuy = position.operation === AskBidEnum.Buy;

  const textElementRef = useRef<HTMLSpanElement>(null);
  const [canRenderFlag, setCanRenderFlag] = useState(false);

  const [statePnL, setStatePnL] = useState(
    calculateFloatingProfitAndLoss({
      investment: position.investmentAmount,
      multiplier: position.multiplier,
      costs: position.swap + position.commission,
      side: isBuy ? 1 : -1,
      currentPrice: isBuy
        ? quotesStore.quotes[position.instrument].bid.c
        : quotesStore.quotes[position.instrument].ask.c,
      openPrice: position.openPrice,
    })
  );

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
          workCallback(quotesStore.quotes[position.instrument], canRenderFlag);
        },
        { delay: 2000 }
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
  }, [textElementRef.current]);

  return (
    <PrimaryTextSpan color="#fffccc" fontSize="12px">
      {getNumberSign(statePnL + position.investmentAmount)}
      {mainAppStore.activeAccount?.symbol}
      {Math.abs(statePnL + position.investmentAmount).toFixed(2)}
    </PrimaryTextSpan>
  );
};

export default EquityPnL;
