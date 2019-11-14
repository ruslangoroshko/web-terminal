import { BidAskViewModel } from './BidAsk';

export interface InstrumentModelDTO {
  id: string;
  name: string;
  digits: number;
  base: string;
  quote: string;
}

export interface InstrumentViewModel extends InstrumentModelDTO {
  bidAsk?: BidAskViewModel;
}
