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

    const sortedList = list.slice();

    const indexSort = sortedList.findIndex((a) => a[0] === price);
    const totalVolume = list.slice().reduce((sum, item) => sum + item[1], 0);

    let itemTotal = sortedList[indexSort][1];
    if (indexSort !== 0) {
      itemTotal = sortedList
        .slice(0, indexSort)
        .reduce((sum, item) => sum + item[1], 0);
    }
    if (indexSort === sortedList.length) {
      itemTotal = sortedList.reduce((sum, item) => sum + item[1], 0);
    }
    return (itemTotal * 100) / totalVolume;
  }

  setBids(bids: OrderBookItemType[]) {
    this.bids = bids
      .sort((a: OrderBookItemType, b: OrderBookItemType) => b[0] - a[0])
      .slice(0, 10);
  }
  setAsks(asks: OrderBookItemType[]) {
    this.asks = asks
      .sort((a: OrderBookItemType, b: OrderBookItemType) => a[0] - b[0])
      .slice(0, 10);
  }
  setMarket(market: string) {
    this.market = market;
  }
}
