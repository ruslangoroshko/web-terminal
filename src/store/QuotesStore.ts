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
  activePositionsSortBy: SortByDropdownEnum;
  pendingOrdersSortBy: SortByDropdownEnum;
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
  @observable activePositionsSortBy: SortByDropdownEnum =
    SortByDropdownEnum.DateOpened;
  @observable available = 0;
  @observable pendingOrders: PendingOrdersWSDTO[] = [];
  @observable pendingOrdersSortBy: SortByDropdownEnum =
    SortByDropdownEnum.DateOpened;

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

    switch (this.activePositionsSortBy) {
      case SortByDropdownEnum.DateOpened:
        filterByFunc = this.sortByDateOpened;
        break;

      case SortByDropdownEnum.AssetName:
        filterByFunc = this.sortByAssetName;
        break;

      case SortByDropdownEnum.DayChange:
        filterByFunc = this.sortByDateOpened;
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

  @computed
  get sortedPendingOrders() {
    let filterByFunc;

    switch (this.pendingOrdersSortBy) {
      case SortByDropdownEnum.DateOpened:
        filterByFunc = this.sortByDateOpenedPendingOrders;
        break;

      case SortByDropdownEnum.AssetName:
        filterByFunc = this.sortByAssetName;
        break;

      case SortByDropdownEnum.DayChange:
        filterByFunc = this.sortByDateOpenedPendingOrders;
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
    return this.pendingOrders.slice().sort(filterByFunc);
  }

  sortByDateOpened = (a: PositionModelWSDTO, b: PositionModelWSDTO) => {
    return a.openDate - b.openDate;
  };

  sortByDateOpenedPendingOrders = (
    a: PendingOrdersWSDTO,
    b: PendingOrdersWSDTO
  ) => {
    return a.created - b.created;
  };

  sortByAssetName = (
    a: PositionModelWSDTO | PendingOrdersWSDTO,
    b: PositionModelWSDTO | PendingOrdersWSDTO
  ) => {
    if (a.instrument < b.instrument) {
      return -1;
    }
    if (a.instrument > b.instrument) {
      return 1;
    }
    return 0;
  };

  sortByInvestment = (
    a: PositionModelWSDTO | PendingOrdersWSDTO,
    b: PositionModelWSDTO | PendingOrdersWSDTO
  ) => {
    return a.investmentAmount - b.investmentAmount;
  };

  sortByPrice = (
    a: PositionModelWSDTO | PendingOrdersWSDTO,
    b: PositionModelWSDTO | PendingOrdersWSDTO
  ) => {
    return a.openPrice - b.openPrice;
  };
}
