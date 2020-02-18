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
    // if (this.sortByField === null) {
    return this.instruments
      .filter(item => item.groupId === this.activeInstrumentGroupId)
      .map(item => ({
        ...item,
        bid: this.rootStore.quotesStore.quotes[item.id].bid.c,
        ask: this.rootStore.quotesStore.quotes[item.id].ask.c,
      }));
    // }

    // switch (this.sortByField) {

    //   case Fields.
    // }
  }

  @action
  setActiveInstrument = (activeInstrument: InstrumentModelWSDTO) => {
    this.activeInstrument = activeInstrument;
    console.log(
      'TCL: InstrumentsStore -> setActiveInstrument -> activeInstrument',
      activeInstrument
    );
  };
}
