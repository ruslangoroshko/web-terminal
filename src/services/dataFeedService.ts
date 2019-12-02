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
    this.stream = new StreamingService(this.activeSession);
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
    // expects a symbolInfo object in response
    console.log('======resolveSymbol running');
    // console.log('resolveSymbol:',{symbolName})
    const split_data = symbolName.split(/[:/]/);
    // console.log({split_data})
    const symbol_stub: LibrarySymbolInfo = {
      full_name: symbolName,
      listed_exchange: '',
      name: symbolName,
      description: '',
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      exchange: split_data[0],
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ['1', '60'],
      supported_resolutions: supportedResolutions,
      volume_precision: 8,
      data_status: 'streaming',
    };

    if (split_data[2] && split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
      symbol_stub.pricescale = 100;
    }
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
