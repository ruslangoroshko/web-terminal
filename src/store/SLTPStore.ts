import { observable, action, makeAutoObservable } from 'mobx';
import { AskBidEnum } from '../enums/AskBid';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';
import { RootStore } from './RootStore';

interface ContextProps {
  tpType: TpSlTypeEnum;
  slType: TpSlTypeEnum;
  instrumentId: string;
  closedByChart: boolean;
}

type PricePosStopOut = {
  slPrice: number;
  investmentAmount: number;
  operation: AskBidEnum;
  instrumentId: string;
  multiplier: number;
};

export class SLTPStore implements ContextProps {
  tpType: TpSlTypeEnum = TpSlTypeEnum.Currency;
  slType: TpSlTypeEnum = TpSlTypeEnum.Currency;
  closedByChart: boolean = false;
  instrumentId: string = '';
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
    });
    this.rootStore = rootStore;
  }

  @action
  clearStore = () => {
    this.setTpType(TpSlTypeEnum.Currency);
    this.setSlType(TpSlTypeEnum.Currency);
  };

  @action
  toggleClosedByChart = (value: boolean) => {
    this.closedByChart = value;
  };

  @action
  setTpType = (tpType: TpSlTypeEnum) => {
    this.tpType = tpType;
  };

  @action
  setSlType = (slType: TpSlTypeEnum) => {
    this.slType = slType;
  };

  @action
  setInstrumentId = (instrumentId: string) => {
    this.instrumentId = instrumentId;
  };

  private _getPostitionStopOut = (invest = 0, instrumentId: string) => {
    const instrumentPercentSL =
      (this.rootStore.instrumentsStore.instruments.find(
        (item) => item.instrumentItem.id === instrumentId
      )?.instrumentItem.stopOutPercent || 95) / 100;
    return +(invest * instrumentPercentSL).toFixed(2);
  };

  /**
   *  Stop Out max level
   */
  public get positionStopOut() {
    return this._getPostitionStopOut;
  }

  public set positionStopOut(value) {
    this._getPostitionStopOut = value;
  }

  /**
   *  Stop Out max level by price SL
   */
  positionStopOutByPrice = ({
    slPrice,
    investmentAmount,
    operation,
    instrumentId,
    multiplier,
  }: PricePosStopOut) => {
    let currentPrice, so_level, so_percent, direction, isBuy;
    isBuy = operation === AskBidEnum.Buy;
    currentPrice = isBuy
      ? this.getCurrentPriceAsk(instrumentId)
      : this.getCurrentPriceBid(instrumentId);
    so_level = -1 * this.positionStopOut(investmentAmount, instrumentId);
    so_percent =
      (this.rootStore.instrumentsStore.instruments.find(
        (item) => item.instrumentItem.id === instrumentId
      )?.instrumentItem.stopOutPercent || 0) / 100;
    direction = operation === AskBidEnum.Buy ? 1 : -1;

    const result = Number(
      (slPrice / currentPrice - 1) * investmentAmount * multiplier * direction +
        Math.abs(
          this.getCurrentPriceBid(instrumentId) -
            this.getCurrentPriceAsk(instrumentId)
        ).toFixed(
          this.rootStore.instrumentsStore.instruments.find(
            (item) => item.instrumentItem.id === instrumentId
          )?.instrumentItem.digits || 2
        )
    );
    return +result.toFixed(2);
  };

  getCurrentPriceBid = (instrumentId: string) =>
    this.rootStore.quotesStore.quotes[instrumentId]
      ? this.rootStore.quotesStore.quotes[instrumentId].bid.c
      : 0;

  getCurrentPriceAsk = (instrumentId: string) =>
    this.rootStore.quotesStore.quotes[instrumentId]
      ? this.rootStore.quotesStore.quotes[instrumentId].ask.c
      : 0;
}
