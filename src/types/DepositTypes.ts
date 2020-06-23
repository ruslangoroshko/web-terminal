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