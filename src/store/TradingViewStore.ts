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
  @observable activeOrderLinePositionTP?: IOrderLineAdapter;
  @observable activeOrderLinePositionSL?: IOrderLineAdapter;
  @observable selectedPosition?: PositionModelWSDTO;
  @observable activePositionPopup: boolean = false;
  @observable applyHandler: any;
  @observable confirmText: string = '';
  @observable activePopup: boolean = false;
  @observable tradingWidgetReady: boolean = false;

  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  setTradingWidget = (tradingWidget: IChartingLibraryWidget | undefined) => {
    this.tradingWidget = tradingWidget;
    this.tradingWidgetReady = !!tradingWidget;
  }

  @action
  toggleActivePositionPopup = (flag: boolean) => {
    this.activePositionPopup = flag;
  };

  @action
  toggleMovedPositionPopup = (flag: boolean) => {
    this.activePopup = flag;
  };

  @action
  setApplyHandler = (applyHandler: () => Promise<void>, clear?: boolean) => {
    this.applyHandler = () =>
      applyHandler().then(() => {
        if (clear) {
          this.clearActivePositionLine();
        }
      });
  };

  @action
  clearActivePositionLine = () => {
    this.selectedPosition = undefined;
    this.activeOrderLinePositionPnL?.remove();
    this.activeOrderLinePositionPnL = undefined;
    this.activeOrderLinePosition?.remove();
    this.activeOrderLinePosition = undefined;
    this.activeOrderLinePositionSL?.remove();
    this.activeOrderLinePositionSL = undefined;
    this.activeOrderLinePositionTP?.remove();
    this.activeOrderLinePositionTP = undefined;

    this.tradingWidget?.applyOverrides({
      'scalesProperties.showSeriesLastValue': true,
      'mainSeriesProperties.showPriceLine': true,
    });
  };
}
