import { observable } from 'mobx';
import { PositionsHistoryReportDTO } from '../types/HistoryReportTypes';
import moment, { Moment } from 'moment';
import { ShowDatesDropdownEnum } from '../enums/ShowDatesDropdownEnum';

interface ContextProps {
  positionsHistoryReport: PositionsHistoryReportDTO;
  positionsStartDate: Moment;
  positionsEndDate: Moment;
  positionsDatesRangeType: ShowDatesDropdownEnum;
  balancesDatesRangeType: ShowDatesDropdownEnum;
}

export class HistoryStore implements ContextProps {
  @observable positionsHistoryReport: PositionsHistoryReportDTO = {
    page: 0,
    pageSize: 0,
    positionsHistory: [],
    totalEquity: 0,
    totalInvestment: 0,
    totalItems: 0,
    totalProfit: 0,
    totalProfitPercent: 0,
  };
  @observable positionsStartDate: Moment = moment().subtract(1, 'w');
  @observable positionsEndDate: Moment = moment();
  @observable positionsDatesRangeType: ShowDatesDropdownEnum =
    ShowDatesDropdownEnum.Week;
  @observable balancesDatesRangeType: ShowDatesDropdownEnum =
    ShowDatesDropdownEnum.Week;
}
