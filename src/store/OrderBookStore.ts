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

    const sortedByValueList = list.slice().sort(
      (a: OrderBookItemType, b: OrderBookItemType) => b[1] - a[1]
    );

    const index = sortedByValueList.findIndex((a) => a[0] === price);

    if (index === 0) {
      return 100;
    }

    return (sortedByValueList[index][1] * 100) / sortedByValueList[0][1];
  }

  setBids(bids: OrderBookItemType[]) {
    this.bids = bids.sort(
      (a: OrderBookItemType, b: OrderBookItemType) => b[0] - a[0]
    );
  }
  setAsks(asks: OrderBookItemType[]) {
    this.asks = asks.sort(
      (a: OrderBookItemType, b: OrderBookItemType) => b[0] - a[0]
    );
  }
  setMarket(market: string) {
    this.market = market;
  }
}
