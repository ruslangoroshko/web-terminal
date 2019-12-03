import {
  OnReadyCallback,
  SearchSymbolsCallback,
  ResolveCallback,
  ErrorCallback,
  LibrarySymbolInfo,
  ResolutionString,
  HistoryCallback,
  SubscribeBarsCallback,
  ResolutionBackValues,
  GetMarksCallback,
  Mark,
  TimescaleMark,
  ServerTimeCallback,
  IBasicDataFeed,
  HistoryDepth,
} from '../vendor/charting_library/charting_library.min';

import historyProvider from './historyProvider';

import StreamingService from './streamingService';
import { supportedResolutions } from '../constants/supportedResolutionsTimeScale';
import { HubConnection } from '@aspnet/signalr';

class DataFeedService implements IBasicDataFeed {
  static config = {
    supported_resolutions: supportedResolutions,
  };

  activeSession: HubConnection;
  stream: StreamingService;
  instrumentId: string;

  constructor(activeSession: HubConnection, instrumentId: string) {
    this.activeSession = activeSession;
    this.instrumentId = instrumentId;
    this.stream = new StreamingService(this.activeSession, this.instrumentId);
  }

  onReady = (callback: OnReadyCallback) => {
    console.log('=====onReady running');
    setTimeout(() => callback(DataFeedService.config), 0);
  };
  searchSymbols = (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback
  ) => {
    console.log('====Search Symbols running');
  };
  resolveSymbol = (
    symbolName: string,
    onResolve: ResolveCallback,
    onError: ErrorCallback
  ) => {
    console.log('======resolveSymbol running');
    const symbol_stub: LibrarySymbolInfo = {
      full_name: this.instrumentId,
      listed_exchange: '',
      name: this.instrumentId,
      description: '',
      type: 'stock',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: this.instrumentId,
      exchange: this.instrumentId,
      minmov: 1,
      pricescale: 100000,
      has_intraday: true,
      has_seconds: true,
      intraday_multipliers: ['1S', '1', '60'],
      supported_resolutions: supportedResolutions,
      data_status: 'streaming',
    };

    setTimeout(function() {
      onResolve(symbol_stub);
      console.log('Resolving that symbol....', symbol_stub);
    }, 0);

    // onResolveErrorCallback('Not feeling it today')
  };
  getBars = async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: HistoryCallback,
    onError: ErrorCallback
  ) => {
    console.log('=====getBars running');

    try {
      const bars = await historyProvider.getBars(
        resolution,
        rangeStartDate,
        rangeEndDate,
        this.instrumentId
      );
      if (bars.length) {
        historyProvider.history[symbolInfo.name] = {
          lastBar: bars[bars.length - 1],
        };
        onResult(bars, { noData: false });
      } else {
        onResult(bars, { noData: true });
      }
    } catch (err) {
      console.log(err);
      onError(err);
    }
  };
  subscribeBars = (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ) => {
    console.log('=====subscribeBars runnning');
    this.stream.subscribeBars(
      symbolInfo,
      resolution,
      onTick,
      listenerGuid,
      onResetCacheNeededCallback
    );
  };
  unsubscribeBars = (subscriberUID: string) => {
    console.log('=====unsubscribeBars running');

    this.stream.unsubscribeBars(subscriberUID);
  };
  calculateHistoryDepth = (
    resolution: ResolutionString,
    resolutionBack: ResolutionBackValues,
    intervalBack: number
  ) => {
    //optional
    console.log('=====calculateHistoryDepth running');
    // while optional, this makes sure we request 24 hours of minute data at a time
    // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
    const historyDepth: HistoryDepth = { resolutionBack: 'D', intervalBack: 1 };

    return +resolution < 60 ? historyDepth : undefined;
  };
  getMarks = (
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<Mark>,
    resolution: ResolutionString
  ) => {
    //optional
    console.log('=====getMarks running');
  };
  getTimeScaleMarks = (
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<TimescaleMark>,
    resolution: ResolutionString
  ) => {
    //optional
    console.log('=====getTimeScaleMarks running');
  };
  getServerTime = (callback: ServerTimeCallback) => {
    console.log('=====getServerTime running');
  };
}

export default DataFeedService;
