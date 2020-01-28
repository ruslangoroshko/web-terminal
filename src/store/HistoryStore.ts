import { observable } from 'mobx';
import {
  PositionHistoryDTO,
  BalanceHistoryDTO,
} from '../types/HistoryReportTypes';
import moment, { Moment } from 'moment';
import { ShowDatesDropdownEnum } from '../enums/ShowDatesDropdownEnum';

interface ContextProps {
  positionsHistory: PositionHistoryDTO[];
  positionsStartDate: Moment;
  positionsEndDate: Moment;
  positionsDatesRangeType: ShowDatesDropdownEnum;
  balancesDatesRangeType: ShowDatesDropdownEnum;
  balancesHistory: BalanceHistoryDTO[];
}

export class HistoryStore implements ContextProps {
  @observable positionsHistory: PositionHistoryDTO[] = [];
  @observable balancesHistory: BalanceHistoryDTO[] = [];
  @observable positionsStartDate: Moment = moment().subtract(1, 'w');
  @observable positionsEndDate: Moment = moment();
  @observable positionsDatesRangeType: ShowDatesDropdownEnum =
    ShowDatesDropdownEnum.Week;
  @observable balancesDatesRangeType: ShowDatesDropdownEnum =
    ShowDatesDropdownEnum.Week;
}
