import { InstrumentModelWSDTO } from './Instruments';

export interface AccountModelDTO {
  id: string;
  balance: number;
  leverage: number;
  currency: string;
  instruments: InstrumentModelWSDTO[];
}

export interface AccountModelWebSocketDTO {
  id: string;
  balance: number;
  currency: string;
  digits: number;
}
