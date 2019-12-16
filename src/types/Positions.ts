import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';

export interface OpenPositionModel {
  processId: string;
  accountId: string;
  instrumentId: string;
  operation: number;
  investmentAmount: number;
  multiplier: number;
  tp?: number;
  sl?: number;
  tpRate?: number;
  slRate?: number;
}

export interface OpenPositionResponseDTO {
  result: OperationApiResponseCodes;
  position: PositionModelWSDTO;
}

export interface PositionModelWSDTO {
  id: number;
  investmentAmount: number;
  openPrice: number;
  openDate: number;
  instrument: string;
  multiplier: number;
  operation: number;
  swap: number;
  commission: number;
  takeProfitInCurrency?: number;
  stopLossInCurrency?: number;
  takeProfitRate?: number;
  stopLossRate?: number;
}

export interface ClosePositionModel {
  accountId: string;
  positionId: number;
}
