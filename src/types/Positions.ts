import { TradeEngineOperationResult } from '../enums/TradeEngineOperationResult';
import { AskBidEnum } from '../enums/AskBid';

export interface OpenPositionModel {
  accountId: string;
  instrumentId: string;
  operation: number;
  volume?: number;
  tp?: number;
  sl?: number;
  tpRate?: number;
  slRate?: number;
}

export interface OpenPositionResponseDTO {
  result: TradeEngineOperationResult;
  position: PositionModelDTO;
}

export interface PositionModelDTO {
  id: number;
  volume: number;
  openPrice: number;
  openDate: string;
  instrument: string;
  type: AskBidEnum;
  swap: number;
  comission: number;
  takeProfitInCurrency?: number;
  stopLossInCurrency?: number;
  takeProfitRate?: number;
  stopLossRate?: number;
}

export interface ClosePositionModel {
  accountId: string;
  positionId: number;
}

export interface ActivePositionModelWSDTO {
  accountId: string;
  positions: PositionModelDTO[];
}
