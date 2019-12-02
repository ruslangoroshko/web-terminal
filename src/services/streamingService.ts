import {
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
  Bar,
} from '../vendor/charting_library/charting_library.min';
import historyProvider from './historyProvider';
import { HubConnection } from '@aspnet/signalr';
import Topics from '../constants/websocketTopics';
import { BidAskModelWSDTO } from '../types/BidAsk';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';

// keep track of subscriptions

interface Subscription {
  symbolInfo: LibrarySymbolInfo;
  resolution: ResolutionString;
  onTick: SubscribeBarsCallback;
  lastBar: Bar;
  listenerGuid: string;
}

interface SubscriptionBar extends Bar {
  id: string;
}

class StreamingService {
  activeConnection: HubConnection;
  subscriptions: Subscription[] = [];
  currentBarGuid?: string;

  constructor(activeConnection: HubConnection) {
    this.activeConnection = activeConnection;
    this.activeConnection.on(
      Topics.BID_ASK,
      (response: ResponseFromWebsocket<BidAskModelWSDTO[]>) => {
        const tickData = response.data[0];

        const bar: Bar = {
          // close: tickData,
        } as Bar;
        const sub = this.subscriptions.find(
          e => e.listenerGuid === this.currentBarGuid
        );

        if (sub) {
          // disregard the initial catchup snapshot of trades for already closed candles
          if (bar.time < sub.lastBar.time / 1000) {
            return;
          }

          const _lastBar = updateBar(bar, sub);

          // send the most recent bar back to TV's realtimeUpdate callback
          sub.onTick(_lastBar);
          // update our own record of lastBar
          sub.lastBar = _lastBar;
        }
      }
    );
  }
  subscribeBars = (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ) => {
    this.currentBarGuid = listenerGuid;
    const currentSubscriptionBar = {
      symbolInfo,
      resolution,
      onTick,
      lastBar: historyProvider.history[symbolInfo.name].lastBar,
      listenerGuid,
    };

    this.subscriptions.push(currentSubscriptionBar);
  };

  unsubscribeBars = (uid: string) => {
    const subIndex = this.subscriptions.findIndex(e => e.listenerGuid === uid);
    if (subIndex === -1) {
      //console.log("No subscription found for ",uid)
      return;
    }
    this.subscriptions.splice(subIndex, 1);
  };
}

export default StreamingService;

// Take a single trade, and subscription record, return updated bar
function updateBar({ ts, volume, price }: any, { lastBar, resolution }: any) {
  if (resolution.includes('D')) {
    // 1 day in minutes === 1440
    resolution = 1440;
  } else if (resolution.includes('W')) {
    // 1 week in minutes === 10080
    resolution = 10080;
  }
  const coeff = resolution * 60;
  const rounded = Math.floor(ts / coeff) * coeff;
  const lastBarSec = lastBar.time / 1000;
  let _lastBar;

  if (rounded > lastBarSec) {
    // create a new candle, use last close as open **PERSONAL CHOICE**
    _lastBar = {
      time: rounded * 1000,
      open: lastBar.close,
      high: lastBar.close,
      low: lastBar.close,
      close: price,
      volume: volume,
    };
  } else {
    // update lastBar candle!
    if (price < lastBar.low) {
      lastBar.low = price;
    } else if (price > lastBar.high) {
      lastBar.high = price;
    }

    lastBar.volume += volume;
    lastBar.close = price;
    _lastBar = lastBar;
  }
  return _lastBar;
}
