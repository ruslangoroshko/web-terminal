import { observable } from 'mobx';
import {
  IChartingLibraryWidget,
  IPositionLineAdapter,
} from '../vendor/charting_library/charting_library';

interface ContextProps {
  tradingWidget?: IChartingLibraryWidget;
  activeOrderLinePosition?: IPositionLineAdapter;
}

export class TradingViewStore implements ContextProps {
  @observable tradingWidget?: IChartingLibraryWidget;
  @observable activeOrderLinePosition?: IPositionLineAdapter;
}
