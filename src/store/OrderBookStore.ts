import { makeAutoObservable } from 'mobx';
import { AskBidEnum } from '../enums/AskBid';
import { OrderBookItemType } from '../types/OrderBookTypes';

interface OrderBookStoreProps {
  market: string;
  bids: OrderBookItemType[];
  asks: OrderBookItemType[]; // price, valueCount
}

export class OrderBookStore implements OrderBookStoreProps {
  market = '';
  bids: OrderBookItemType[] = [];
  asks: OrderBookItemType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getOrderPercent(type: AskBidEnum, price: number) {
    const list: OrderBookItemType[] =
      type === AskBidEnum.Buy ? this.bids : this.asks;
    if (!list.length) {
      return 0;
    }
    const totalVolume = list.slice().reduce((sum, item) => sum + item[1], 0);
    const index = list.findIndex((a) => a[0] === price);
    return (list[index][1] * 100) / totalVolume;
  }

  setBids(bids: OrderBookItemType[]) {
    this.bids = bids.sort(
      (a: OrderBookItemType, b: OrderBookItemType) => b[0] - a[0]
    );
  }
  setAsks(asks: OrderBookItemType[]) {
    this.asks = asks.sort(
      (a: OrderBookItemType, b: OrderBookItemType) => a[0] - b[0]
    );
  }
  setMarket(market: string) {
    this.market = market;
  }
}
