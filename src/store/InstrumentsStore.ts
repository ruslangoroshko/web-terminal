import { observable, computed, action } from 'mobx';
import {
  InstrumentModelWSDTO,
  InstrumentGroupWSDTO,
  PriceChangeWSDTO,
} from '../types/Instruments';
import { RootStore } from './RootStore';
import { SortByMarketsEnum } from '../enums/SortByMarketsEnum';

interface ContextProps {
  rootStore: RootStore;
  instruments: InstrumentModelWSDTO[];
  activeInstrumentsIds: string[];
  favouriteInstrumentsIds: string[];
  pricesChange: PriceChangeWSDTO[];
  activeInstrument?: InstrumentModelWSDTO;
  instrumentGroups: InstrumentGroupWSDTO[];
  activeInstrumentGroupId?: InstrumentGroupWSDTO['id'];
  sortByField: string | null;
}

export class InstrumentsStore implements ContextProps {
  rootStore: RootStore;
  @observable instruments: InstrumentModelWSDTO[] = [];
  @observable activeInstrumentsIds: string[] = [];
  @observable favouriteInstrumentsIds: string[] = [];

  @observable activeInstrument?: InstrumentModelWSDTO;
  @observable filteredInstrumentsSearch: InstrumentModelWSDTO[] = [];
  @observable instrumentGroups: InstrumentGroupWSDTO[] = [];
  @observable activeInstrumentGroupId?: InstrumentGroupWSDTO['id'];

  @observable sortByField: string | null = null;

  @observable pricesChange: PriceChangeWSDTO[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @computed get activeInstruments() {
    return this.instruments.filter(item =>
      this.activeInstrumentsIds.includes(item.id)
    );
  }

  @action
  setActiveInstrumentsIds = (activeInstrumentsIds: string[]) => {
    this.activeInstrumentsIds = activeInstrumentsIds.slice(0, 6);
  };

  @action
  addActiveInstrumentId = (activeInstrumentId: string) => {
    if (this.activeInstrumentsIds.length === 7) {
      this.activeInstrumentsIds = [
        ...this.activeInstrumentsIds.slice(0, 5),
        activeInstrumentId,
      ];
    } else {
      this.activeInstrumentsIds.push(activeInstrumentId);
    }
  };

  @computed
  get sortedInstruments() {
    let filterByFunc;

    switch (this.rootStore.sortingStore.marketsSortBy) {
      case SortByMarketsEnum.NameAsc:
        filterByFunc = this.sortByName(true);
        break;

      case SortByMarketsEnum.NameDesc:
        filterByFunc = this.sortByName(false);
        break;

      case SortByMarketsEnum.Popularity:
        filterByFunc = this.sortByPopularity;
        break;

      case SortByMarketsEnum.PriceChangeAsc:
        filterByFunc = this.sortByPriceChange(true);
        break;

      case SortByMarketsEnum.PriceChangeDesc:
        filterByFunc = this.sortByPriceChange(false);
        break;

      default:
        return this.instruments;
    }
    return this.instruments
      .filter(item => item.groupId === this.activeInstrumentGroupId)
      .sort(filterByFunc);
  }

  @action
  setActiveInstrument = (activeInstrument: InstrumentModelWSDTO) => {
    this.activeInstrument = activeInstrument;
  };

  @action
  swiitchInstrument = (instrumentId: string) => {
    const newActiveInstrument = this.instruments.find(
      item => item.id === instrumentId
    );
    this.activeInstrument = newActiveInstrument;
    this.rootStore.tradingViewStore.tradingWidget
      ?.chart()
      .setSymbol(instrumentId, () => {});
  };

  @action
  setPricesChanges = (prices: PriceChangeWSDTO[]) => {
    this.pricesChange = prices;
  };

  sortByName = (ascending: boolean) => (
    a: InstrumentModelWSDTO,
    b: InstrumentModelWSDTO
  ) => {
    if (a.name < b.name) {
      return ascending ? -1 : 1;
    }
    if (a.name > b.name) {
      return ascending ? 1 : -1;
    }
    return 0;
  };

  sortByPopularity = (a: InstrumentModelWSDTO, b: InstrumentModelWSDTO) =>
    a.weight - b.weight;

  sortByPriceChange = (ascending: boolean) => (
    a: InstrumentModelWSDTO,
    b: InstrumentModelWSDTO
  ) => {
    const aPriceChange = this.pricesChange.find(item => item.id === a.id);
    const bPriceChange = this.pricesChange.find(item => item.id === b.id);

    if (!aPriceChange || !bPriceChange) {
      console.log('InstrumentsStore -> aPriceChange', aPriceChange);
      console.log('InstrumentsStore -> bPriceChange', bPriceChange);

      return 0;
    }

    if (aPriceChange.chng < bPriceChange.chng) {
      return ascending ? 1 : -1;
    }
    if (aPriceChange.chng > bPriceChange.chng) {
      return ascending ? -1 : 1;
    }
    return 0;
  };
}
