export enum TradeEngineOperationResult {
  Ok,
  DayOff,
  MinOperationVolumeViolated,
  MaxOperationVolumeViolated,
  MaxVolumePositionByInstrumentViolated,
  InsufficientBalance,
  NoLiquidity,
  Unknown = 9999999,
}
