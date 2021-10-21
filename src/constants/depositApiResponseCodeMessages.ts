import { DepositApiResponseCodes } from '../enums/DepositApiResponseCodes';

const depositApiResponseCodeMessages = {
  [DepositApiResponseCodes.PaymentDisabled]: 'The possibility of replenishment is temporarily blocked',
};

Object.freeze(depositApiResponseCodeMessages);

export default depositApiResponseCodeMessages;
