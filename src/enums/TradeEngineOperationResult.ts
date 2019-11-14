export enum TradeEngineOperationResult {
  Ok,
  DayOff,
  MinOperationLotViolated,
  MaxOperationLotViolated,
  MaxPositionByInstrumentViolated,
  InsufficientMargin,
  NoLiquidity,
  Unknown = 9999999,
}
