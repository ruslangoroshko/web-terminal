import { computed, action, makeAutoObservable, observable } from 'mobx';
import {
  InstrumentModelWSDTO,
  InstrumentGroupWSDTO,
  PriceChangeWSDTO,
  IActiveInstrument,
} from '../types/InstrumentsTypes';
import { RootStore } from './RootStore';
import { SortByMarketsEnum } from '../enums/SortByMarketsEnum';
import {
  ResolutionString,
  SeriesStyle,
} from '../vendor/charting_library/charting_library';
import { supportedResolutions } from '../constants/supportedTimeScales';
import { LOCAL_CHART_TYPE, LOCAL_INSTRUMENT_ACTIVE } from '../constants/global';
import { getChartTypeByLabel } from '../constants/chartValues';
import { getIntervalByKey } from '../helpers/getIntervalByKey';
import moment from 'moment';
import { AccountTypeEnum } from '../enums/AccountTypeEnum';
import API from '../helpers/API';
import KeysInApi from '../constants/keysInApi';
import { SortRuleListType } from '../types/SortRuleList';
interface IPriceChange {
  [key: string]: number;
}

interface ContextProps {
  rootStore: RootStore;
  instruments: IActiveInstrument[];
  activeInstrumentsIds: string[];
  favouriteInstrumentsIds: string[];
  pricesChange: IPriceChange;
  // activeInstrument?: IActiveInstrument;
  instrumentGroups: InstrumentGroupWSDTO[];
  activeInstrumentGroupId?: InstrumentGroupWSDTO['id'];
  sortByField: string | null;
  calcActiveInstrument: InstrumentGroupWSDTO | null;
}

type ActiveInstrumentsSortRulesType = {
  [key: string]: SortRuleListType[];
};

export class InstrumentsStore implements ContextProps {
  rootStore: RootStore;
  instruments: IActiveInstrument[] = [];
  activeInstrumentsIds: string[] = [];
  favouriteInstrumentsIds: string[] = [];
  // activeInstrument?: IActiveInstrument;
  activeInstrumentId: string = '';
  filteredInstrumentsSearch: InstrumentModelWSDTO[] = [];
  instrumentGroups: InstrumentGroupWSDTO[] = [];
  activeInstrumentGroupId?: InstrumentGroupWSDTO['id'];
  sortByField: string | null = null;
  hiddenChart: boolean = false;
  pricesChange: IPriceChange = {};

  calcActiveInstrument: InstrumentModelWSDTO | null = null;

  activeInstrumentsSortRule: ActiveInstrumentsSortRulesType | null = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
    });
    this.rootStore = rootStore;
  }

  get activeInstruments() {
    const filteredActiveInstruments = [...this.instruments]
      .filter((item) =>
        this.activeInstrumentsIds.includes(item.instrumentItem.id)
      )
      .sort(
        (a, b) =>
          this.activeInstrumentsIds.indexOf(a.instrumentItem.id) -
          this.activeInstrumentsIds.indexOf(b.instrumentItem.id)
      );

    return filteredActiveInstruments;
  }

  setCalcActiveInstrument = (instrument: InstrumentModelWSDTO) => {
    this.calcActiveInstrument = instrument;
  };

  getCustomMarketSortList = async () => {
    try {
      const response = await API.getKeyValue(KeysInApi.MARKET_SORT_LIST);
      const sortList = JSON.parse(response || '');
      console.table(sortList);
      if (sortList) {
        this.setActiveInstrumentsSortRule(sortList);
      }
    } catch (error) {}
  };

  setActiveInstrumentsSortRule = (list: ActiveInstrumentsSortRulesType) => {
    this.activeInstrumentsSortRule = list;
  };

  @action
  setFilteredInstrumentsSearch = (
    newFilteredInstrumentsSearch: InstrumentModelWSDTO[]
  ) => {
    this.filteredInstrumentsSearch = newFilteredInstrumentsSearch;
  };

  @action
  setInstruments = (instruments: InstrumentModelWSDTO[]) => {
    const localType = localStorage.getItem(LOCAL_CHART_TYPE);
    const currentType = localType
      ? getChartTypeByLabel(localType)
      : SeriesStyle.Area;
    this.instruments = instruments.map(
      (item) =>
        <IActiveInstrument>{
          chartType: currentType,
          instrumentItem: item,
          interval: '1D',
          resolution: '1 minute',
        }
    );
  };

  @action
  setInstrumentGroups = (newInstrumentGroups: InstrumentGroupWSDTO[]) => {
    this.instrumentGroups = newInstrumentGroups.sort(
      (a: InstrumentGroupWSDTO, b: InstrumentGroupWSDTO) => a.weight - b.weight
    );
  };

  @action
  changeInstrumentChartType = (type: SeriesStyle) => {
    if (this.activeInstrument) {
      const instrumentIndex = this.instruments.findIndex(
        (item) =>
          item.instrumentItem.id === this.activeInstrument?.instrumentItem.id
      );
      this.instruments[instrumentIndex].chartType = type;
      this.instruments = this.instruments.map((item) => {
        item.chartType = type;
        return item;
      });
    }
  };

  setActiveInstrument(id: string) {
    if (this.activeInstrumentId) {
      this.rootStore.mainAppStore.deleteOrderBookInstrument(
        this.activeInstrumentId
      );
    }
    this.rootStore.mainAppStore.setOrderBookInstrument(id);
    this.activeInstrumentId = id;
  }

  @action
  editActiveInstrument = (activeInstrument: IActiveInstrument) => {
    this.setActiveInstrument(activeInstrument.instrumentItem.id);
    const instrumentIndex = this.instruments.findIndex(
      (item) => item.instrumentItem.id === this.activeInstrumentId
    );
    if (instrumentIndex !== -1) {
      this.instruments[instrumentIndex] = activeInstrument;
    }
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
    API.postFavoriteInstrumets({
      accountId: this.rootStore.mainAppStore.activeAccount!.id,
      type: this.rootStore.mainAppStore.activeAccount!.isLive
        ? AccountTypeEnum.Live
        : AccountTypeEnum.Demo,
      instruments: this.activeInstrumentsIds,
    });
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

      case SortByMarketsEnum.Custom:
        const instrumentList = this.instruments
          .filter(
            (item) =>
              item.instrumentItem.groupId === this.activeInstrumentGroupId
          )
          .map((item) => item.instrumentItem);

        const sortedList: InstrumentModelWSDTO[] = [];
        // TODO: Add to end of list new instruments
        if (
          this.activeInstrumentGroupId &&
          this.activeInstrumentsSortRule &&
          this.activeInstrumentsSortRule[this.activeInstrumentGroupId]
        ) {
          this.activeInstrumentsSortRule[this.activeInstrumentGroupId].map(
            (market) => {
              const marketItem = instrumentList.find(
                (item) => item.id === market.id
              );
              if (marketItem) {
                sortedList.push(marketItem);
              }
            }
          );
        }

        return sortedList.length ? sortedList : instrumentList;

      default:
        return this.instruments.map((item) => item.instrumentItem);
    }
    return this.instruments
      .filter(
        (item) => item.instrumentItem.groupId === this.activeInstrumentGroupId
      )
      .sort(filterByFunc)
      .map((item) => item.instrumentItem);
  }

  get activeInstrument() {
    return this.instruments.find(
      (item) => item.instrumentItem.id === this.activeInstrumentId
    );
  }

  // TODO: refactor, too heavy
  @action
  switchInstrument = async (
    instrumentId: string,
    addToFavorites: boolean = true,
    addToLastViewed: boolean = true
  ) => {
    if (this.activeInstrument?.instrumentItem.id === instrumentId) {
      this.rootStore.markersOnChartStore.renderActivePositionsMarkersOnChart();
      return;
    }
    const newActiveInstrument = this.instruments.find(
      (item) => item.instrumentItem.id === instrumentId
    );

    if (newActiveInstrument) {
      if (addToLastViewed) {
        localStorage.setItem(LOCAL_INSTRUMENT_ACTIVE, instrumentId);
      }
      if (addToFavorites) {
        this.addActiveInstrumentId(instrumentId);
      }
      this.setActiveInstrument(instrumentId);

      const tvWidget = this.rootStore.tradingViewStore.tradingWidget;
      if (tvWidget) {
        if (this.rootStore.tradingViewStore.activeOrderLinePositionPnL) {
          this.rootStore.tradingViewStore.clearActivePositionLine();
        }
        this.setHiddenChart(true);
        tvWidget.chart().setSymbol(instrumentId, () => {
          tvWidget
            .chart()
            .setResolution(
              supportedResolutions[
                newActiveInstrument.resolution
              ] as ResolutionString,
              () => {
                if (newActiveInstrument.interval) {
                  const fromTo = {
                    from: getIntervalByKey(newActiveInstrument.interval),
                    to: moment().valueOf(),
                  };
                  tvWidget.chart().setVisibleRange(fromTo);
                }
              }
            );
          this.setHiddenChart(false);
          tvWidget.chart().setChartType(newActiveInstrument.chartType);
        });

        this.rootStore.markersOnChartStore.renderActivePositionsMarkersOnChart();
        tvWidget.applyOverrides({
          'scalesProperties.showSeriesLastValue': true,
          'mainSeriesProperties.showPriceLine': true,
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
    const nameToDefA = a.instrumentItem.name.toLowerCase();
    const nameToDefB = b.instrumentItem.name.toLowerCase();
    if (nameToDefA < nameToDefB) {
      return ascending ? -1 : 1;
    }
    if (nameToDefA > nameToDefB) {
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

  @action
  setHiddenChart = (hiddenChart: boolean) => {
    this.hiddenChart = hiddenChart;
  };

  @action
  setActiveInstrumentGroupId = (groupId: string) => {
    this.activeInstrumentGroupId = groupId;
  };
}
