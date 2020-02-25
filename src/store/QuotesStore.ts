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
    SortByDropdownEnum.NewFirstAsc;
  @observable available = 0;
  @observable pendingOrders: PendingOrdersWSDTO[] = [];
  @observable pendingOrdersSortBy: SortByDropdownEnum =
    SortByDropdownEnum.NewFirstAsc;

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
      case SortByDropdownEnum.NewFirstAsc:
        filterByFunc = this.sortByDateOpened(true);
        break;

      case SortByDropdownEnum.NewFirstDesc:
        filterByFunc = this.sortByDateOpened(false);
        break;

      case SortByDropdownEnum.ProfitAsc:
        filterByFunc = this.sortByPnLPositions(true);
        break;

      case SortByDropdownEnum.ProfitDesc:
        filterByFunc = this.sortByPnLPositions(false);
        break;

      case SortByDropdownEnum.InvestmentAsc:
        filterByFunc = this.sortByInvestment(true);
        break;

      case SortByDropdownEnum.InvestmentDesc:
        filterByFunc = this.sortByInvestment(false);
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
      case SortByDropdownEnum.NewFirstAsc:
        filterByFunc = this.sortByDateOpenedPendingOrders(true);
        break;

      case SortByDropdownEnum.NewFirstDesc:
        filterByFunc = this.sortByDateOpenedPendingOrders(false);
        break;

      case SortByDropdownEnum.InvestmentAsc:
        filterByFunc = this.sortByInvestment(true);
        break;

      case SortByDropdownEnum.InvestmentDesc:
        filterByFunc = this.sortByInvestment(false);
        break;

      default:
        break;
    }
    return this.pendingOrders.slice().sort(filterByFunc);
  }

  sortByDateOpened = (ascending: boolean) => (
    a: PositionModelWSDTO,
    b: PositionModelWSDTO
  ) => (ascending ? b.openDate - a.openDate : a.openDate - b.openDate);

  sortByDateOpenedPendingOrders = (ascending: boolean) => (
    a: PendingOrdersWSDTO,
    b: PendingOrdersWSDTO
  ) => (ascending ? b.created - a.created : a.created - b.created);

  sortByInvestment = (ascending: boolean) => (
    a: PositionModelWSDTO | PendingOrdersWSDTO,
    b: PositionModelWSDTO | PendingOrdersWSDTO
  ) =>
    ascending
      ? b.investmentAmount - a.investmentAmount
      : a.investmentAmount - b.investmentAmount;

  // TODO: think how to reduce calculations
  sortByPnLPositions = (ascending: boolean) => (
    a: PositionModelWSDTO,
    b: PositionModelWSDTO
  ) => {
    const aProfitNLoss = calculateFloatingProfitAndLoss({
      investment: b.investmentAmount,
      leverage: b.multiplier,
      costs: b.swap + b.commission,
      side: b.operation === AskBidEnum.Buy ? 1 : -1,
      currentPrice:
        b.operation === AskBidEnum.Buy
          ? this.quotes[b.instrument].bid.c
          : this.quotes[b.instrument].ask.c,
      openPrice: b.openPrice,
    });

    const bProfitNLoss = calculateFloatingProfitAndLoss({
      investment: a.investmentAmount,
      leverage: a.multiplier,
      costs: a.swap + a.commission,
      side: a.operation === AskBidEnum.Buy ? 1 : -1,
      currentPrice:
        a.operation === AskBidEnum.Buy
          ? this.quotes[a.instrument].bid.c
          : this.quotes[a.instrument].ask.c,
      openPrice: a.openPrice,
    });
    return ascending
      ? bProfitNLoss - aProfitNLoss
      : aProfitNLoss - bProfitNLoss;
  };
}
