import { InstrumentModelDTO } from './Instruments';

export interface AccountModelDTO {
  id: string;
  balance: number;
  leverage: number;
  currency: string;
  instruments: InstrumentModelDTO[];
}
