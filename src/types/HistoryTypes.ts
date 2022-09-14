import { AskBidEnum } from '../enums/AskBid';
import { CandleTypeEnum } from '../enums/CandleType';
import { HLOC } from './BidAsk';

export interface HistoryCandlesType {
  instrumentId: string;
  bidOrAsk: AskBidEnum;
  fromDate: number;
  toDate: number;
  candleType: CandleTypeEnum;
}

export interface HistoryCandlesDTOType {
  InstrumentId: string;
  BidOrAsk: AskBidEnum;
  From: number;
  To: number;
  CandleType: CandleTypeEnum;
}

export interface CandleDTO extends HLOC {
  d: number;
}
