import { observable } from 'mobx';
import { IChartingLibraryWidget } from '../vendor/charting_library/charting_library.min';
import { BASIC_RESOLUTION_KEY } from '../constants/defaultChartValues';
import { SupportedResolutionsType } from '../constants/supportedTimeScales';

interface ContextProps {
  tradingWidget?: IChartingLibraryWidget;
  resolutionKey: SupportedResolutionsType | null;
  interval: string | null;
}

export class TradingViewStore implements ContextProps {
  @observable tradingWidget?: IChartingLibraryWidget;
  @observable
  resolutionKey: SupportedResolutionsType | null = BASIC_RESOLUTION_KEY;
  @observable interval: string | null = null;
}
