import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';

interface OpenPositionModelInit {
  processId: string;
  accountId: string;
  instrumentId: string;
  operation: number;
  multiplier: number;
  tp?: number;
  sl?: number;
  tpRate?: number;
  slRate?: number;
  purchaseAt?: number;
}
export interface OpenPositionModel extends OpenPositionModelInit {
  investmentAmount: number;
}

export interface OpenPositionModelFormik extends OpenPositionModelInit {
  investmentAmount: string;
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
  timeStamp: number;
}

export interface ClosePositionModel {
  accountId: string;
  positionId: number;
  processId: string;
}
