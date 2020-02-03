import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';

const apiResponseCodeMessages = {
  [OperationApiResponseCodes.DayOff]:
    'The market is closed. Please try again when the market is open.',
  [OperationApiResponseCodes.MinOperationLotViolated]:
    'Your investment amount is too small.',
  [OperationApiResponseCodes.MaxOperationLotViolated]:
    'Your investment amount exceeds the maximum amount',
  [OperationApiResponseCodes.MaxPositionByInstrumentViolated]:
    'Your cumulative investment amount for this instrument exceeds the maximum amount for this instrument.',
  [OperationApiResponseCodes.InsufficientMargin]:
    'Insufficient funds to open a position.',
  [OperationApiResponseCodes.NoLiquidity]:
    'No liquidity for this asset. Please try again later.',
  [OperationApiResponseCodes.PositionNotFound]: 'Position is not found.',
  [OperationApiResponseCodes.TpIsTooClose]:
    'Take profit level is too close to the current price.',
  [OperationApiResponseCodes.SlIsTooClose]:
    'Stop loss level is too close to the current price.',
  [OperationApiResponseCodes.PendingOrderNotFound]: 'Position is not found.',
  [OperationApiResponseCodes.AccountNotFound]: 'Account is not found.',
  [OperationApiResponseCodes.InstrumentNotFound]: 'Asset is not found.',
  [OperationApiResponseCodes.InstrumentCanNotBeUsed]:
    'Asset is not available now.',
  [OperationApiResponseCodes.UserExists]: 'This email is already in use.',
  [OperationApiResponseCodes.InvalidUserNameOrPassword]:
    'Invalid login or password',
  [OperationApiResponseCodes.FileNotFound]: 'File not found',
  [OperationApiResponseCodes.FileWrongExtension]:
    'Only files with the following extensions are allowed: jpg, png, pdf',
};

Object.freeze(apiResponseCodeMessages);

export default apiResponseCodeMessages;
