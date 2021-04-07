import { DepositApiResponseCodes } from '../enums/DepositApiResponseCodes';
import { DepositRequestStatusEnum } from '../enums/DepositRequestStatusEnum';
import { GetSupportedPaymentSystemsStatuses } from '../enums/GetSupportedPaymentSystemsStatuses';
import { SupportedPaymentSystem } from './SupportedPaymentSystem';

export interface CreateDepositParams {
  paymentMethod: string;
  depositSum: number;
  currency: string;
}

export interface GetCryptoWalletParams {
  currency: string;
  accountId: string;
}

export interface DepositCreateDTO {
  status: DepositApiResponseCodes;
  redirectUrl: string;
}

export interface GetCryptoWalletDTO {
  status: DepositApiResponseCodes;
  walletAddress: string;
}

export interface CreateDepositInvoiceParams {
  cardNumber: string;
  cvv: string;
  expirationDate: number;
  fullName: string;
  amount: number;
  postalCode?: string;
  country?: string;
  city?: string;
  address?: string;
  accountId: string;
}

export interface CreateDepositInvoiceDTO {
  secureLink: string;
  status: DepositRequestStatusEnum;
}

export interface CreateElectronicFundsInvoiceParams {
  amount: number;
  accountId: string;
  processId: string;
}

export interface CreateDirectaInvoiceParams {
  amount: number;
  accountId: string;
  processId: string;
}

export interface CreatePayRetailersInvoiceParams {
  amount: number;
  accountId: string;
  processId: string;
}

export interface CreateElectronicFundsInvoiceDTO {
  data: {
    redirectLink: string
  };
  status: DepositRequestStatusEnum;
}

export interface CreateDirectaInvoiceDTO {
  data: {
    redirectLink: string
  };
  status: DepositRequestStatusEnum;
}

export interface CreatePayRetailersInvoiceDTO {
  data: {
    redirectLink: string
  };
  status: DepositRequestStatusEnum;
}

export interface CreateVoltInvoiceParams {
  amount: number;
  accountId: string;
  processId: string;
}
export interface CreateVoltInvoiceDTO {
  data: {
    redirectLink: string
  };
  status: DepositRequestStatusEnum;
}

export interface GetSupportedPaymentSystems {
  status: GetSupportedPaymentSystemsStatuses;
  data: {
    supportedPaymentSystems: SupportedPaymentSystem[]
  };
}