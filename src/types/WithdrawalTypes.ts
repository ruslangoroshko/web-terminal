export interface CreateWithdrawalParams {
	authToken: string;
	accountId: string;
	currency: string;
	amount: number;
	withdrawalType: number;
	data: string;
}