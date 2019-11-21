import { BidAskViewModel } from './BidAsk';

export interface InstrumentModelDTO {
  id: string;
  name: string;
  digits: number;
  base: string;
  quote: string;
  dayOff: string[];
  minOperationVolume: number;
  maxOperationVolume: number;
  maxPositionVolume: number;
  bidAsk?: BidAskViewModel;
}

export interface InstrumentModelWSDTO {
  accountId: string;
  instruments: InstrumentModelDTO[];
}
