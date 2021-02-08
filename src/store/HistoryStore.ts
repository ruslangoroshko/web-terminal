import { action, makeAutoObservable, observable } from 'mobx';
import { PositionsHistoryReportDTO } from '../types/HistoryReportTypes';
import { ShowDatesDropdownEnum } from '../enums/ShowDatesDropdownEnum';

interface ContextProps {
  positionsHistoryReport: PositionsHistoryReportDTO;
  positionsDatesRangeType: ShowDatesDropdownEnum;
  balancesDatesRangeType: ShowDatesDropdownEnum;
}

export class HistoryStore implements ContextProps {
  positionsHistoryReport: PositionsHistoryReportDTO = {
    page: 0,
    pageSize: 0,
    positionsHistory: [],
    totalEquity: 0,
    totalInvestment: 0,
    totalItems: 0,
    totalProfit: 0,
    totalProfitPercent: 0,
  };

  constructor() {
    makeAutoObservable(this);
  }

  positionsDatesRangeType: ShowDatesDropdownEnum = ShowDatesDropdownEnum.Week;
  balancesDatesRangeType: ShowDatesDropdownEnum = ShowDatesDropdownEnum.Week;

  @action
  setPositionsHistoryReport = (
    newPositionHistoryReport: PositionsHistoryReportDTO
  ) => {
    this.positionsHistoryReport = newPositionHistoryReport;
  };
}
