import { RootStore } from './RootStore';
import { SortByDropdownEnum } from '../enums/SortByDropdown';
import { observable } from 'mobx';
import { SortByMarketsEnum } from '../enums/SortByMarketsEnum';

interface ISortingStore {
  activePositionsSortBy: SortByDropdownEnum;
  pendingOrdersSortBy: SortByDropdownEnum;
  marketsSortBy: SortByMarketsEnum;
}

export class SortingStore implements ISortingStore {
  rootStore: RootStore;
  @observable activePositionsSortBy: SortByDropdownEnum =
    SortByDropdownEnum.NewFirstAsc;
  @observable pendingOrdersSortBy: SortByDropdownEnum =
    SortByDropdownEnum.NewFirstAsc;

  @observable marketsSortBy: SortByMarketsEnum = SortByMarketsEnum.Popularity;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
}
