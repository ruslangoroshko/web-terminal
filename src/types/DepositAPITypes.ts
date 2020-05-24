import { CreatePaymentInvoiceStatuses } from '../enums/CreatePaymentInvoiceStatuses';
import { GetCryptoWalletStatuses } from '../enums/GetCryptoWalletStatuses';

export interface DepositCreateRequest {
  paymentMethod: string;
  depositSum: number;
  currency: string;
  authToken: string;
}

export interface DepositCreateResponse {
  status: CreatePaymentInvoiceStatuses;
  redirectUrl: string;
}

export interface GetCryptoWalletRequest {
  authToken: string;
  currency: string;
}

export interface GetCryptoWalletResponse {
  status: GetCryptoWalletStatuses;
  walletAddress: string;
}
