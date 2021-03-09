import {
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
  Bar,
} from '../vendor/charting_library/charting_library';
import { HubConnection } from '@aspnet/signalr';
import Topics from '../constants/websocketTopics';
import { BidAskModelWSDTO } from '../types/BidAsk';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import historyProvider from './historyProvider';

// keep track of subscriptions

interface Subscription {
  symbolInfo: LibrarySymbolInfo;
  resolution: ResolutionString;
  onTick: SubscribeBarsCallback;
  lastBar: Bar;
  listenerGuid: string;
}

interface DataSubscriber {
  symbolInfo: LibrarySymbolInfo;
  resolution: string;
  lastBar: Bar;
  listener: SubscribeBarsCallback;
  resetCasheCallback: () => void;
}

interface DataSubscribers {
  [guid: string]: DataSubscriber;
}

class StreamingService {
  activeConnection: HubConnection;
  subscriptions: Subscription[] = [];
  _subscribers: DataSubscribers = {};
  currentBarGuid?: string;
  instrumentId: string;

  constructor(activeConnection: HubConnection, instrumentId: string) {
    this.activeConnection = activeConnection;
    this.instrumentId = instrumentId;
    this.activeConnection.on(
      Topics.BID_ASK,
      (response: ResponseFromWebsocket<BidAskModelWSDTO[]>) => {
        if (!this.currentBarGuid) {
          return;
        }
        const subscriptionRecord = this._subscribers[this.currentBarGuid];
        const tick = response.data.find(
          (item) => item.id === this.instrumentId
        );
        if (!tick || !subscriptionRecord) {
          return;
        }
        const bar: Bar = {
          close: tick.bid.c,
          high: tick.bid.h,
          low: tick.bid.l,
          open: tick.bid.o,
          time: tick.dt,
        };

        if (bar.time < subscriptionRecord.lastBar.time) {
          return;
        }

        const _lastBar = updateBar(bar, subscriptionRecord);
        subscriptionRecord.listener(_lastBar);
        subscriptionRecord.lastBar = _lastBar;
       
      }
    );
  }
  subscribeBars = (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    newDataCallback: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ) => {
    if (this._subscribers.hasOwnProperty(listenerGuid)) {
      console.log(
        `DataPulseProvider: already has subscriber with id=${listenerGuid}`
      );
      return;
    }
    this.currentBarGuid = listenerGuid;
    this.instrumentId = symbolInfo.name;

    this._subscribers[listenerGuid] = {
      resetCasheCallback: onResetCacheNeededCallback,
      lastBar: historyProvider.history[`${symbolInfo.name}${resolution}`].lastBar,
      listener: newDataCallback,
      resolution: resolution,
      symbolInfo: symbolInfo,
    };
  };

  unsubscribeBars = (listenerGuid: string) => {
    delete this._subscribers[listenerGuid];
    console.log(`DataPulseProvider: unsubscribed for #${listenerGuid}`);
  };

  _updateBar = () => {};
}

export default StreamingService;

// Take a single trade, and subscription record, return updated bar
function updateBar(bar: Bar, { lastBar, resolution }: DataSubscriber) {
  let resolutionNumber = +resolution;
  if (resolution.includes('D')) {
    // 1 day in minutes === 1440
    resolutionNumber = 1440;
  } else if (resolution.includes('W')) {
    // 1 week in minutes === 10080
    resolutionNumber = 10080;
  }
  const coeff = resolutionNumber * 60;

  const rounded = bar.time || Math.floor(bar.time / coeff) * coeff;
  let _lastBar = {} as Bar;
  const MINUTE = 60000;
  if (rounded > lastBar.time + MINUTE) {
    // create a new candle, use last close as open **PERSONAL CHOICE**
    _lastBar = { ...bar, time: rounded };
  } else {
    // update lastBar candle!
    if (bar.low < lastBar.low) {
      lastBar.low = bar.low;
    }

    if (bar.high > lastBar.high) {
      lastBar.high = bar.high;
    }

    lastBar.close = bar.close;

    _lastBar = { ...lastBar };
  }
  return _lastBar;
}
