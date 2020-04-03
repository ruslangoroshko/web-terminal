import { observable, computed, action } from 'mobx';
import {
  InstrumentModelWSDTO,
  InstrumentGroupWSDTO,
  PriceChangeWSDTO,
  IActiveInstrument,
} from '../types/InstrumentsTypes';
import { RootStore } from './RootStore';
import { SortByMarketsEnum } from '../enums/SortByMarketsEnum';
import { SeriesStyle } from '../vendor/charting_library/charting_library.min';
import { supportedResolutions } from '../constants/supportedTimeScales';
import { getIntervalByKey } from '../helpers/getIntervalByKey';
import moment from 'moment';
interface IPriceChange {
  [key: string]: number;
}

interface ContextProps {
  rootStore: RootStore;
  instruments: IActiveInstrument[];
  activeInstrumentsIds: string[];
  favouriteInstrumentsIds: string[];
  pricesChange: IPriceChange;
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

  @observable pricesChange: IPriceChange = {};

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }


  // TODO: order of newly instruments is broken
  @computed get activeInstruments() {
    const filteredActiveInstruments = this.instruments.filter(item =>
      this.activeInstrumentsIds.includes(item.instrumentItem.id)
    )
    return filteredActiveInstruments;
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
    this.activeInstrument = activeInstrument;
  };

  @action
  setActiveInstrumentsIds = (activeInstrumentsIds: string[]) => {
    this.activeInstrumentsIds = activeInstrumentsIds.slice(0, 7);
  };

  @action
  addActiveInstrumentId = (activeInstrumentId: string) => {
    if (this.activeInstrumentsIds.includes(activeInstrumentId)) {
      return;
    }

    if (this.activeInstrumentsIds.length > 6) {
      this.activeInstrumentsIds[6] = activeInstrumentId;
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
  switchInstrument = (instrumentId: string) => {
    const newActiveInstrument = this.instruments.find(
      item => item.instrumentItem.id === instrumentId
    );
    this.activeInstrument = newActiveInstrument;
    if (newActiveInstrument) {
      this.addActiveInstrumentId(instrumentId);
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
    this.pricesChange = prices.reduce(
      (acc, prev) => ({ ...acc, [prev.id]: prev.chng }),
      <IPriceChange>{}
    );
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
    const aPriceChange = this.pricesChange[a.instrumentItem.id];
    const bPriceChange = this.pricesChange[b.instrumentItem.id];

    if (!aPriceChange || !bPriceChange) {
      return 0;
    }

    if (aPriceChange < bPriceChange) {
      return ascending ? 1 : -1;
    }
    if (aPriceChange > bPriceChange) {
      return ascending ? -1 : 1;
    }
    return 0;
  };
}
