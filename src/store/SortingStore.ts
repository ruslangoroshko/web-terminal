import { RootStore } from './RootStore';
import { SortByProfitEnum } from '../enums/SortByProfitEnum';
import { action, makeAutoObservable, observable } from 'mobx';
import { SortByMarketsEnum } from '../enums/SortByMarketsEnum';
import { SortByPendingOrdersEnum } from '../enums/SortByPendingOrdersEnum';
import { LOCAL_MARKET_SORT, LOCAL_POSITION_SORT } from '../constants/global';

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
    localStorage.setItem(LOCAL_POSITION_SORT, `${newValue}`);
    this.activePositionsSortBy = newValue;
  };

  @action
  setPendingOrdersSortBy = (newValue: SortByPendingOrdersEnum) => {
    this.pendingOrdersSortBy = newValue;
  };

  @action
  setMarketsSortBy = (newValue: SortByMarketsEnum) => {
    localStorage.setItem(LOCAL_MARKET_SORT, `${newValue}`);
    this.marketsSortBy = newValue;
  };
}
