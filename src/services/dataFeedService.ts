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
import { InstrumentModelWSDTO } from '../types/Instruments';
import minimumTime from '../constants/minimumTime';

class DataFeedService implements IBasicDataFeed {
  static config = {
    supported_resolutions: supportedResolutions,
    supports_search: false,
    supports_group_request: false,
    supports_marks: false,
    supports_timescale_marks: false,
  };

  activeSession: HubConnection;
  stream: StreamingService;

  constructor(activeSession: HubConnection, instrument: InstrumentModelWSDTO) {
    this.activeSession = activeSession;
    this.stream = new StreamingService(this.activeSession, instrument.id);
  }

  onReady = (callback: OnReadyCallback) => {
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
    const symbol_stub: LibrarySymbolInfo = {
      full_name: symbolName,
      listed_exchange: '',
      name: symbolName,
      description: '',
      type: 'stock',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      exchange: symbolName,
      minmov: 1,
      pricescale: 100000,
      has_intraday: true,
      has_seconds: true,
      has_daily: true,
      has_weekly_and_monthly: true,
      has_no_volume: true,
      supported_resolutions: supportedResolutions,
      data_status: 'streaming',
      format: 'price',
    };

    setTimeout(function() {
      onResolve(symbol_stub);
      console.log('Resolving that symbol....', symbol_stub);
    }, 0);
  };

  getBars = async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: HistoryCallback,
    onError: ErrorCallback
  ) => {
    try {
      const bars = await historyProvider.getBars(
        resolution,
        rangeStartDate,
        rangeEndDate,
        symbolInfo.name
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
    this.stream.subscribeBars(
      symbolInfo,
      resolution,
      onTick,
      listenerGuid,
      onResetCacheNeededCallback
    );
  };
  unsubscribeBars = (subscriberUID: string) => {
    const uid = subscriberUID.split(' ')[1];

    this.stream.unsubscribeBars(uid);
  };
  calculateHistoryDepth = (
    resolution: ResolutionString,
    resolutionBack: ResolutionBackValues,
    intervalBack: number
  ) => {
    switch (resolution) {
      case '1D':
        return {
          resolutionBack: 'M' as ResolutionBackValues,
          intervalBack: 6,
        };
      case '1M':
        return {
          resolutionBack: 'M' as ResolutionBackValues,
          intervalBack: 6,
        };
    }
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

function periodLengthSeconds(
  resolution: string,
  requiredPeriodsCount: number
): number {
  let daysCount = 0;

  if (resolution === 'D' || resolution === '1D') {
    daysCount = requiredPeriodsCount;
  } else if (resolution === 'M' || resolution === '1M') {
    daysCount = 31 * requiredPeriodsCount;
  } else if (resolution === 'W' || resolution === '1W') {
    daysCount = 7 * requiredPeriodsCount;
  } else {
    daysCount = (requiredPeriodsCount * parseInt(resolution)) / (24 * 60);
  }

  return daysCount * 24 * 60 * 60;
}
