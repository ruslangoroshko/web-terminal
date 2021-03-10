import { DepositTypeEnum } from '../enums/DepositTypeEnum';

export interface SupportedPaymentSystem {
  metadata: object;
  paymentSystemType: DepositTypeEnum;
}
