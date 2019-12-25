import { observable, action, computed } from 'mobx';
import { BidAskKeyValueList, BidAskModelWSDTO } from '../types/BidAsk';
import { PositionModelWSDTO } from '../types/Positions';
import calculateFloatingProfitAndLoss from '../helpers/calculateFloatingProfitAndLoss';
import { AskBidEnum } from '../enums/AskBid';

interface IQuotesStore {
  quotes: BidAskKeyValueList;
  activePositions: PositionModelWSDTO[];
  totalProfit: number;
}

export class QuotesStore implements IQuotesStore {
  @observable quotes: BidAskKeyValueList = {};
  @observable activePositions: PositionModelWSDTO[] = [];
  @observable totalProfit = 0;

  @action
  setQuote = (quote: BidAskModelWSDTO) => {
    this.quotes = { ...this.quotes, [quote.id]: quote };
  };

  @computed
  get profit() {
    return this.activePositions
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
                ? this.quotes[prev.instrument].bid.c
                : this.quotes[prev.instrument].ask.c,
            openPrice: prev.openPrice,
          }),
        0
      )
      .toFixed(2);
  }
}
