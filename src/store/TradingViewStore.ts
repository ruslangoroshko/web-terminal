import { observable } from 'mobx';
import {
  IChartingLibraryWidget,
  SeriesStyle,
} from '../vendor/charting_library/charting_library.min';
import { BASIC_RESOLUTION_KEY } from '../constants/chartValues';
import { SupportedResolutionsType } from '../constants/supportedTimeScales';

interface ContextProps {
  tradingWidget?: IChartingLibraryWidget;
  resolutionKey: SupportedResolutionsType | null;
  interval: string | null;
  chartType: SeriesStyle;
}

export class TradingViewStore implements ContextProps {
  @observable tradingWidget?: IChartingLibraryWidget;
  @observable
  resolutionKey: SupportedResolutionsType | null = BASIC_RESOLUTION_KEY;
  @observable interval: string | null = null;
  @observable chartType: SeriesStyle = SeriesStyle.Area;
}
