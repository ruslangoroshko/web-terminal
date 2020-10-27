import { autorun, observable } from 'mobx';
import { AskBidEnum } from '../enums/AskBid';
import calculateFloatingProfitAndLoss from '../helpers/calculateFloatingProfitAndLoss';
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
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    autorun(
      () => {
        if (
          this.rootStore.tradingViewStore.activeOrderLinePosition &&
          this.rootStore.instrumentsStore.activeInstrument &&
          this.selectedPosition
        ) {
          const isBuy = this.selectedPosition.operation === AskBidEnum.Buy;
          const PnL = calculateFloatingProfitAndLoss({
            investment: this.selectedPosition.investmentAmount,
            multiplier: this.selectedPosition.multiplier,
            costs:
              this.selectedPosition.swap + this.selectedPosition.commission,
            side: isBuy ? 1 : -1,
            currentPrice: isBuy
              ? this.rootStore.quotesStore.quotes[
                  this.selectedPosition.instrument
                ].bid.c
              : this.rootStore.quotesStore.quotes[
                  this.selectedPosition.instrument
                ].ask.c,
            openPrice: this.selectedPosition.openPrice,
          });
          this.rootStore.tradingViewStore.activeOrderLinePosition
            .setPrice(
              this.rootStore.quotesStore.quotes[
                this.rootStore.instrumentsStore.activeInstrument.instrumentItem
                  .id
              ].bid.c
            )
            .setText(`$${PnL}`)
            .setBodyTextColor(PnL > 0 ? '#3BFF8A' : '#FF557E');
        }
      },
      { delay: 1000 }
    );
  }
}
