import { DepositApiResponseCodes } from './../enums/DepositApiResponseCodes';

export interface CreateDepositParams {
	paymentMethod: string;
	depositSum: number;
	currency: string;
	authToken: string;
}

export interface GetCryptoWalletParams {
	authToken: string;
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
	authToken: string;
	cvv: number;
	expirationDate: string;
	fullName: string;
	amount: number;
	postalCode?: string;
	country?: string;
	city?: string;
	address?: string;
	accountId: string;
}

export interface CreateDepositInvoiceDTO {
	walletAddress: string;
	status: DepositApiResponseCodes;
}