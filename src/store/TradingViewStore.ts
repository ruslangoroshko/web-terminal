import { action, observable } from 'mobx';
import { PositionModelWSDTO } from '../types/Positions';
import {
  IChartingLibraryWidget,
  IPositionLineAdapter,
} from '../vendor/charting_library/charting_library';
import { RootStore } from './RootStore';

interface ContextProps {
  tradingWidget?: IChartingLibraryWidget;
  activeOrderLinePosition?: IPositionLineAdapter;
}

export class TradingViewStore implements ContextProps {
  @observable tradingWidget?: IChartingLibraryWidget;
  @observable activeOrderLinePosition?: IPositionLineAdapter;
  @observable selectedPosition?: PositionModelWSDTO;
  @observable activePositionPopup: boolean = false;
  @observable applyHandler: any;

  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  toggleActivePositionPopup = (flag: boolean) => {
    this.activePositionPopup = flag;
  };

  @action
  setApplyHandler = (applyHandler: () => Promise<void>) => {
    this.applyHandler = () =>
      applyHandler().then(() => {
        this.clearActivePositionLine();
      });
  };

  @action
  clearActivePositionLine = () => {
    this.activeOrderLinePosition?.remove();
    this.activeOrderLinePosition = undefined;
    this.tradingWidget?.applyOverrides({
      'scalesProperties.showSeriesLastValue': true,
      'mainSeriesProperties.showPriceLine': true,
    });
  };
}
