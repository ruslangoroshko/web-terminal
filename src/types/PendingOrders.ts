import { AskBidEnum } from '../enums/AskBid';

export interface PendingOrdersWSDTO {
  id: number;
  investmentAmount: number;
  openPrice: number;
  created: number;
  instrument: string;
  multiplier: number;
  operation: AskBidEnum;
  takeProfitInCurrency?: number;
  stopLossInCurrency?: number;
  takeProfitRate?: number;
  stopLossRate?: number;
  timeStamp: number;
}
