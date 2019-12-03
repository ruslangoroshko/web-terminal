export enum OperationApiResponseCodes {
  Ok,
  DayOff,
  MinOperationLotViolated,
  MaxOperationLotViolated,
  MaxPositionByInstrumentViolated,
  InsufficientMargin,
  NoLiquidity,
  InvalidUserNameOrPassword = -1,
}
