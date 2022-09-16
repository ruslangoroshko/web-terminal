import { DepositRequestStatusEnum } from '../enums/DepositRequestStatusEnum';


const depositResponseMessages = {
  [DepositRequestStatusEnum.Success]: 'Success',
  [DepositRequestStatusEnum.InvalidCardNumber]: 'Invalid card number',
  [DepositRequestStatusEnum.InvalidCredentials]: 'Invalid credentials',
  [DepositRequestStatusEnum.MaxDepositAmountExceeded]: 'Max deposit amount exceeded',
  [DepositRequestStatusEnum.MinDepositAmountExceeded]: 'Min deposit amount exceeded',
  [DepositRequestStatusEnum.PaymentDeclined]: 'Payment failed',
  [DepositRequestStatusEnum.ServerError]: 'Server error',
  [DepositRequestStatusEnum.UnsupportedCardType]: 'Unsupported card type',
  [DepositRequestStatusEnum.PaymentDisabled]: 'The possibility of replenishment is temporarily blocked',
}

Object.freeze(depositResponseMessages);
export default depositResponseMessages;