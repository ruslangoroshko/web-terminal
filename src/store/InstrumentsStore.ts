import { observable, computed } from 'mobx';
import {
  InstrumentModelWSDTO,
  InstrumentGroupWSDTO,
} from '../types/Instruments';
import Fields from '../constants/fields';
import { RootStore } from './RootStore';
import calculateGrowth from '../helpers/calculateGrowth';

interface ContextProps {
  rootStore: RootStore;
  instruments: InstrumentModelWSDTO[];
  activeInstrumentsIds: string[];
  favouriteInstrumentsIds: string[];
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
}
