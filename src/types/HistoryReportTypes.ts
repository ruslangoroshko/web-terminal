import { AskBidEnum } from '../enums/AskBid';

export interface PositionsHistoryReportDTO {
  positionsHistory: PositionHistoryDTO[];
  totalInvestment: number;
  totalEquity: number;
  totalProfit: number;
  totalProfitPercent: number;
  page: number;
  pageSize: number;
  totalItems: number;
}

export interface PositionHistoryDTO {
  id: number;
  instrument: string;
  openDate: number;
  closeDate: number;
  profit: number;
  commission: number;
  equity: number;
  investmentAmount: number;
  openPrice: number;
  closePrice: number;
  leverage: number;
  closeReason: number;
  operation: AskBidEnum;
  swaps: [
    {
      dateTime: number;
      long: number;
      short: number;
      amount: number;
    }
  ];
}

export interface BalanceHistoryDTO {
  createdAt: number;
  description: string;
  amount: number;
  balance: number;
}

export interface BalanceHistoryReport {
  page: number;
  pageSize: number;
  totalItems: number;
  balanceHistory: BalanceHistoryDTO[];
}

export interface GetHistoryParams {
  accountId: string;
  startDate: number;
  endDate: number;
}
