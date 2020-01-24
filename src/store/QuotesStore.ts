import { observable, action, computed } from 'mobx';
import { BidAskKeyValueList, BidAskModelWSDTO } from '../types/BidAsk';
import { PositionModelWSDTO } from '../types/Positions';
import calculateFloatingProfitAndLoss from '../helpers/calculateFloatingProfitAndLoss';
import { AskBidEnum } from '../enums/AskBid';
import { PendingOrdersWSDTO } from '../types/PendingOrders';
import { SortByDropdownEnum } from '../enums/SortByDropdown';

interface IQuotesStore {
  quotes: BidAskKeyValueList;
  activePositions: PositionModelWSDTO[];
  sortBy: SortByDropdownEnum;
  totalProfit: number;
  available: number;
  invest: number;
  total: number;
  totalEquity: number;
  profit: number;
  pendingOrders: PendingOrdersWSDTO[];
}

export class QuotesStore implements IQuotesStore {
  @observable quotes: BidAskKeyValueList = {};
  @observable activePositions: PositionModelWSDTO[] = [];
  @observable sortBy: SortByDropdownEnum = SortByDropdownEnum.DateOpened;
  @observable totalProfit = 0;
  @observable available = 0;
  @observable pendingOrders: PendingOrdersWSDTO[] = [];

  @action
  setQuote = (quote: BidAskModelWSDTO) => {
    this.quotes[quote.id] = quote;
  };

  @computed
  get profit() {
    return this.activePositions.reduce(
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
    );
  }

  @computed
  get invest() {
    return this.activePositions.reduce(
      (acc, prev) => acc + prev.investmentAmount,
      0
    );
  }

  @computed
  get total() {
    return +this.profit + this.available;
  }

  @computed
  get totalEquity() {
    return +this.profit + this.invest;
  }

  @computed
  get sortedActivePositions() {
    let filterByFunc;
    
    switch (this.sortBy) {
      case SortByDropdownEnum.DateOpened:
        filterByFunc = this.sortByDateOpened;
        break;

      case SortByDropdownEnum.AssetName:
        filterByFunc = this.sortByAssetName;
        break;

      case SortByDropdownEnum.DayChange:
        filterByFunc = this.sortByDayChange;
        break;

      case SortByDropdownEnum.Investment:
        filterByFunc = this.sortByInvestment;
        break;

      case SortByDropdownEnum.Price:
        filterByFunc = this.sortByPrice;
        break;

      default:
        break;
    }
    return this.activePositions.slice().sort(filterByFunc);
  }

  sortByDateOpened = (a: PositionModelWSDTO, b: PositionModelWSDTO) => {
    return a.openDate - b.openDate;
  };

  sortByAssetName = (a: PositionModelWSDTO, b: PositionModelWSDTO) => {
    if (a.instrument < b.instrument) {
      return -1;
    }
    if (a.instrument > b.instrument) {
      return 1;
    }
    return 0;
  };

  sortByDayChange = (a: PositionModelWSDTO, b: PositionModelWSDTO) => {
    return a.openDate - b.openDate;
  };

  sortByInvestment = (a: PositionModelWSDTO, b: PositionModelWSDTO) => {
    return a.investmentAmount - b.investmentAmount;
  };

  sortByPrice = (a: PositionModelWSDTO, b: PositionModelWSDTO) => {
    return a.openPrice - b.openPrice;
  };
}
