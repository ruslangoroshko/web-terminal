import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import { AutoCloseTypesEnum } from '../enums/AutoCloseTypesEnum';

export interface OpenPositionModel {
  processId: string;
  accountId: string;
  investmentAmount: number;
  instrumentId: string;
  operation: number;
  multiplier: number;
  tp?: number;
  sl?: number;
  tpRate?: number;
  slRate?: number;
  purchaseAt?: number;
}

export interface OpenPositionModelFormik {
  processId: string;
  accountId: string;
  investmentAmount: string;
  instrumentId: string;
  operation: number;
  multiplier: number;
  tp: number | null;
  sl: number | null;
  SLTPType: AutoCloseTypesEnum;
  purchaseAt: number | null;
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

export interface RemovePendingOrders {
  processId: string;
  accountId: string;
  orderId: number;
}

export interface UpdateSLTP {
  processId: string;
  accountId: string;
  positionId: number;
  tp?: number;
  sl?: number;
  tpRate?: number;
  slRate?: number;
}
