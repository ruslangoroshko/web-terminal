import { observable, computed } from 'mobx';
import { InstrumentModelWSDTO } from '../types/Instruments';

interface ContextProps {
  instruments: InstrumentModelWSDTO[];
  activeInstrumentsIds: string[];
  activeInstrument?: InstrumentModelWSDTO;
}

export class InstrumentsStore implements ContextProps {
  @observable instruments: InstrumentModelWSDTO[] = [];
  @observable activeInstrumentsIds: string[] = [];
  @observable activeInstrument?: InstrumentModelWSDTO;
  @observable filteredInstrumentsSearch: InstrumentModelWSDTO[] = [];

  @computed get activeInstruments() {
    return this.instruments.filter(item =>
      this.activeInstrumentsIds.includes(item.id)
    );
  }
}
