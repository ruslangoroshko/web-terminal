import { DepositApiResponseCodes } from './../enums/DepositApiResponseCodes';

export interface createDepositParams {
	paymentMethod: string;
	depositSum: number;
	currency: string;
	authToken: string;
}

export interface getCryptoWalletParams {
	authToken: string;
	currency: string;
}

export interface DepositCreateDTO {
	status: DepositApiResponseCodes;
	redirectUrl: string;
}