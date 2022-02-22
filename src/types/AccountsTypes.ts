import { InstrumentModelWSDTO } from './InstrumentsTypes';
import { AccountStatusEnum } from '../enums/AccountStatusEnum';

export interface AccountModelDTO {
  id: string;
  balance: number;
  leverage: number;
  currency: string;
  instruments: InstrumentModelWSDTO[];
}

export interface AccountModelWebSocketDTO {
  id: string;
  balance: number;
  bonus: number;
  currency: string;
  digits: number;
  symbol: string;
  isLive: boolean;
  timestamp: number;
  achievementStatus: string;
  freeToWithdrawal: number;
  investAmount: [
    {
      amount: number;
    }
  ];
}

export interface IAccountType {
  id: string;
  type: AccountStatusEnum;
  order: number;
  name: string;
  depositsSumFrom: number;
  depositsSumTo: number;
}

export interface AccountUpdateTypeModelWebSocketDTO {
  accountTypeModels: IAccountType[],
  currentAccountTypeId: string,
  currentAccountTypeProgressPercentage: number,
  amountToNextAccountType: number,
}

export interface MTAccountDTO {
  balance: number,
  margin: number,
  accountId: string,
  tradeUrl: string,
  login: number,
  serverName: string,
}

export interface MTCreateAccountDTO {
  traderId: string,
  login: number,
  serverName: string,
  password: string,
  investorPassword: string,
  accountId: string,
}
