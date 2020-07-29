import { DepositApiResponseCodes } from '../enums/DepositApiResponseCodes';


const depositResponseMessages = {
  [DepositApiResponseCodes.Success]: 'Success',
  [DepositApiResponseCodes.ClientNotFound]: 'Client not found',
  [DepositApiResponseCodes.CurrencyNotFound]: 'Currency not found',
  [DepositApiResponseCodes.Unauthorized]: 'Unauthorized',
  [DepositApiResponseCodes.Error]: 'Technical Error',
}

Object.freeze(depositResponseMessages);
export default depositResponseMessages;