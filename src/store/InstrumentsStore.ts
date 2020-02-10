import { observable, computed } from 'mobx';
import {
  InstrumentModelWSDTO,
  InstrumentGroupWSDTO,
} from '../types/Instruments';

interface ContextProps {
  instruments: InstrumentModelWSDTO[];
  activeInstrumentsIds: string[];
  favouriteInstrumentsIds: string[];
  activeInstrument?: InstrumentModelWSDTO;
  instrumentGroups: InstrumentGroupWSDTO[];
}

export class InstrumentsStore implements ContextProps {
  @observable instruments: InstrumentModelWSDTO[] = [];
  @observable activeInstrumentsIds: string[] = [];
  @observable favouriteInstrumentsIds: string[] = [];

  @observable activeInstrument?: InstrumentModelWSDTO;
  @observable filteredInstrumentsSearch: InstrumentModelWSDTO[] = [];
  @observable instrumentGroups: InstrumentGroupWSDTO[] = [];

  @computed get activeInstruments() {
    return this.instruments.filter(item =>
      this.activeInstrumentsIds.includes(item.id)
    );
  }
}
