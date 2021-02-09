import { RootStore } from './RootStore';
import { SortByProfitEnum } from '../enums/SortByProfitEnum';
import { action, makeAutoObservable, observable } from 'mobx';
import { SortByMarketsEnum } from '../enums/SortByMarketsEnum';
import { SortByPendingOrdersEnum } from '../enums/SortByPendingOrdersEnum';

interface ISortingStore {
  activePositionsSortBy: SortByProfitEnum;
  pendingOrdersSortBy: SortByPendingOrdersEnum;
  marketsSortBy: SortByMarketsEnum;
}

export class SortingStore implements ISortingStore {
  rootStore: RootStore;
  activePositionsSortBy: SortByProfitEnum = SortByProfitEnum.NewFirstAsc;
  pendingOrdersSortBy: SortByPendingOrdersEnum =
    SortByPendingOrdersEnum.NewFirstAsc;

  marketsSortBy: SortByMarketsEnum = SortByMarketsEnum.Popularity;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
  }

  @action
  setActivePositionsSortBy = (newValue: SortByProfitEnum) => {
    this.activePositionsSortBy = newValue;
  };

  @action
  setPendingOrdersSortBy = (newValue: SortByPendingOrdersEnum) => {
    this.pendingOrdersSortBy = newValue;
  };

  @action
  setMarketsSortBy = (newValue: SortByMarketsEnum) => {
    this.marketsSortBy = newValue;
  };
}
