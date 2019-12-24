import React, { useState, FC, useContext, useEffect } from 'react';
import { PositionModelWSDTO } from '../types/Positions';
import { QuotesContext } from './QuotesProvider';
import calculateFloatingProfitAndLoss from '../helpers/calculateFloatingProfitAndLoss';
import { AskBidEnum } from '../enums/AskBid';
import { useThrottle } from '../helpers/useThrottle';

interface ContextProps {
  activePositions: PositionModelWSDTO[];
  setActivePositions: (arg0: PositionModelWSDTO[]) => void;
  totalProfil: string;
}

export const UserAccountContext = React.createContext<ContextProps>(
  {} as ContextProps
);

interface Props {}

const UserAccountProvider: FC<Props> = ({ children }) => {
  const [activePositions, setActivePositions] = useState<PositionModelWSDTO[]>(
    []
  );

  const [totalProfil, setTotalProfit] = useState('0');

  const { quotes } = useContext(QuotesContext);

  useThrottle(() => {
    const profit = activePositions
      .reduce(
        (acc, prev) =>
          acc +
          calculateFloatingProfitAndLoss({
            investment: prev.investmentAmount,
            leverage: prev.multiplier,
            costs: prev.swap + prev.commission,
            side: prev.operation === AskBidEnum.Buy ? 1 : -1,
            currentPrice:
              prev.operation === AskBidEnum.Buy
                ? quotes[prev.instrument].bid.c
                : quotes[prev.instrument].ask.c,
            openPrice: prev.openPrice,
          }),
        0
      )
      .toFixed(2);
    setTotalProfit(profit);
  }, 1000);

  return (
    <UserAccountContext.Provider
      value={{ activePositions, setActivePositions, totalProfil }}
    >
      {children}
    </UserAccountContext.Provider>
  );
};

export default UserAccountProvider;
