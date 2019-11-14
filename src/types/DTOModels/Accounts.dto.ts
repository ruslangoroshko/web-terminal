import { InstrumentModel } from './Instruments.dto';

export interface AccountModel {
  id: string;
  balance: number;
  leverage: number;
  currency: string;
  instruments: InstrumentModel[];
}
