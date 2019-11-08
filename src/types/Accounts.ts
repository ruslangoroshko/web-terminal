import { InstrumentModel } from './Instruments';

export interface AccountModel {
  id: string;
  balance: number;
  leverage: number;
  instruments: InstrumentModel[];
}
