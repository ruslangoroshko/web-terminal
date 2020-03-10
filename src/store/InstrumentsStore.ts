import { observable, computed, action } from 'mobx';
import {
  InstrumentModelWSDTO,
  InstrumentGroupWSDTO,
  PriceChangeWSDTO,
  IActiveInstrument,
} from '../types/Instruments';
import { RootStore } from './RootStore';
import { SortByMarketsEnum } from '../enums/SortByMarketsEnum';
import { SeriesStyle } from '../vendor/charting_library/charting_library.min';
import {
  SupportedResolutionsType,
  supportedResolutions,
} from '../constants/supportedTimeScales';
import { getIntervalByKey } from '../helpers/getIntervalByKey';
import moment from 'moment';

interface ContextProps {
  rootStore: RootStore;
  instruments: IActiveInstrument[];
  activeInstrumentsIds: string[];
  favouriteInstrumentsIds: string[];
  pricesChange: PriceChangeWSDTO[];
  activeInstrument?: IActiveInstrument;
  instrumentGroups: InstrumentGroupWSDTO[];
  activeInstrumentGroupId?: InstrumentGroupWSDTO['id'];
  sortByField: string | null;
}

export class InstrumentsStore implements ContextProps {
  rootStore: RootStore;
  @observable instruments: IActiveInstrument[] = [];
  @observable activeInstrumentsIds: string[] = [];
  @observable favouriteInstrumentsIds: string[] = [];

  @observable activeInstrument?: IActiveInstrument;
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
      this.activeInstrumentsIds.includes(item.instrumentItem.id)
    );
  }

  @action
  setInstruments = (instruments: InstrumentModelWSDTO[]) => {
    this.instruments = instruments.map(
      item =>
        <IActiveInstrument>{
          chartType: SeriesStyle.Area,
          instrumentItem: item,
          interval: '1D',
          resolution: '1 minute',
        }
    );
  };

  @action
  setActiveInstrument = (activeInstrumentId: string) => {
    this.activeInstrument = this.instruments.find(
      item => item.instrumentItem.id === activeInstrumentId
    );
  };

  @action
  editActiveInstrument = (activeInstrument: IActiveInstrument) => {
    this.instruments = this.instruments.map(item =>
      item.instrumentItem.id === activeInstrument.instrumentItem.id
        ? activeInstrument
        : item
    );
  };

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
        return this.instruments.map(item => item.instrumentItem);
    }
    return this.instruments
      .filter(
        item => item.instrumentItem.groupId === this.activeInstrumentGroupId
      )
      .sort(filterByFunc)
      .map(item => item.instrumentItem);
  }


  // TODO: refactor, too heavy
  @action
  swiitchInstrument = (instrumentId: string) => {
    const newActiveInstrument = this.instruments.find(
      item => item.instrumentItem.id === instrumentId
    );
    this.activeInstrument = newActiveInstrument;
    if (newActiveInstrument) {
      const tvWidget = this.rootStore.tradingViewStore.tradingWidget?.chart();
      if (tvWidget) {
        tvWidget.setSymbol(instrumentId, () => {
          tvWidget.setResolution(
            supportedResolutions[newActiveInstrument.resolution],
            () => {
              if (newActiveInstrument.interval) {
                const fromTo = {
                  from: getIntervalByKey(newActiveInstrument.interval),
                  to: moment().valueOf(),
                };
                tvWidget.setVisibleRange(fromTo);
              }
            }
          );
          tvWidget.setChartType(newActiveInstrument.chartType);
        });
      }
    }
  };

  @action
  setPricesChanges = (prices: PriceChangeWSDTO[]) => {
    this.pricesChange = prices;
  };

  sortByName = (ascending: boolean) => (
    a: IActiveInstrument,
    b: IActiveInstrument
  ) => {
    if (a.instrumentItem.name < b.instrumentItem.name) {
      return ascending ? -1 : 1;
    }
    if (a.instrumentItem.name > b.instrumentItem.name) {
      return ascending ? 1 : -1;
    }
    return 0;
  };

  sortByPopularity = (a: IActiveInstrument, b: IActiveInstrument) =>
    a.instrumentItem.weight - b.instrumentItem.weight;

  sortByPriceChange = (ascending: boolean) => (
    a: IActiveInstrument,
    b: IActiveInstrument
  ) => {
    const aPriceChange = this.pricesChange.find(
      item => item.id === a.instrumentItem.id
    );
    const bPriceChange = this.pricesChange.find(
      item => item.id === b.instrumentItem.id
    );

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
