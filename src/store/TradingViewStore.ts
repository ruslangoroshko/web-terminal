import { action, observable } from 'mobx';
import { PositionModelWSDTO } from '../types/Positions';
import {
  IChartingLibraryWidget,
  IOrderLineAdapter,
  IPositionLineAdapter,
} from '../vendor/charting_library/charting_library';
import { RootStore } from './RootStore';

interface ContextProps {
  tradingWidget?: IChartingLibraryWidget;
  activeOrderLinePositionPnL?: IOrderLineAdapter;
}

export class TradingViewStore implements ContextProps {
  @observable tradingWidget?: IChartingLibraryWidget;
  @observable activeOrderLinePositionPnL?: IOrderLineAdapter;
  @observable activeOrderLinePosition?: IOrderLineAdapter;
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
    this.activeOrderLinePositionPnL?.remove();
    this.activeOrderLinePositionPnL = undefined;
    this.activeOrderLinePosition?.remove();
    this.activeOrderLinePosition = undefined;

    this.tradingWidget?.applyOverrides({
      'scalesProperties.showSeriesLastValue': true,
      'mainSeriesProperties.showPriceLine': true,
    });
  };
}
