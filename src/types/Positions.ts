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

export interface OpenPositionResponseModel {
  result: number;
  position: PositionModel;
}

export interface PositionModel {
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
