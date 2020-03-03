import { observable, computed, action } from 'mobx';
import {
  InstrumentModelWSDTO,
  InstrumentGroupWSDTO,
  PriceChangeWSDTO,
} from '../types/Instruments';
import { RootStore } from './RootStore';

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

  @computed get sortedInstruments() {
    return this.instruments.filter(
      item => item.groupId === this.activeInstrumentGroupId
    );
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
}
