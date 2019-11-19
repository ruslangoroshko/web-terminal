import { TradeEngineOperationResult } from '../enums/TradeEngineOperationResult';

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
  accountId: string;
  instrument: string;
  volume: number;
  openPrice: number;
  openDate: string;
  operation: number;
  tp?: number;
  sl?: number;
  tpRate?: number;
  slRate?: number;
}

export interface ClosePositionModel {
  accountId: string;
  positionId: number;
}

export interface ActivePositionModelWSDTO {
  accountId: string;
  positions: PositionModelDTO[];
}