import { InstrumentModelDTO } from './Instruments';

export interface AccountModelDTO {
  id: string;
  balance: number;
  leverage: number;
  currency: string;
  instruments: InstrumentModelDTO[];
}

export interface AccountModelWebSocketDTO {
  id: string;
  balance: number;
  leverage: number;
  currency: string;
  bonus: number;
  group: string;
}
