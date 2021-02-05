import { action, makeAutoObservable, observable } from 'mobx';
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
  tradingWidget?: IChartingLibraryWidget;
  activeOrderLinePositionPnL?: IOrderLineAdapter;
  activeOrderLinePosition?: IOrderLineAdapter;
  activeOrderLinePositionTP?: IOrderLineAdapter;
  activeOrderLinePositionSL?: IOrderLineAdapter;
  selectedPosition?: PositionModelWSDTO;
  selectedPendingPosition?: number;
  selectedHistory?: string;
  activePositionPopup: boolean = false;
  applyHandler: any;
  confirmText: string = '';
  activePopup: boolean = false;
  tradingWidgetReady: boolean = false;

  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
  }

  @action
  setTradingWidget = (tradingWidget: IChartingLibraryWidget | undefined) => {
    this.tradingWidget = tradingWidget;
    this.tradingWidgetReady = !!tradingWidget;
  };

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
