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
} from '../vendor/charting_library/charting_library.min';

import historyProvider from './historyProvider';

import StreamingService from './streamingService';
import { HubConnection } from '@aspnet/signalr';
import { supportedResolutions } from '../constants/supportedTimeScales';
import { IActiveInstrument } from '../types/InstrumentsTypes';

class DataFeedService implements IBasicDataFeed {
  static config = {
    supported_resolutions: Object.values(supportedResolutions),
    supports_search: false,
    supports_group_request: false,
    supports_marks: false,
    supports_timescale_marks: false,
  };

  activeSession: HubConnection;
  stream: StreamingService;
  instruments: IActiveInstrument[];

  constructor(
    activeSession: HubConnection,
    instrumentId: string,
    instruments: IActiveInstrument[]
  ) {
    this.activeSession = activeSession;
    this.stream = new StreamingService(this.activeSession, instrumentId);
    this.instruments = instruments;
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
      pricescale:
        10 **
        (this.instruments.find(item => item.instrumentItem.id === symbolName)
          ?.instrumentItem.digits || 2),
      has_intraday: true,
      intraday_multipliers: [supportedResolutions['1 minute']],
      has_weekly_and_monthly: true,
      has_no_volume: true,
      has_empty_bars: false,
      supported_resolutions: Object.values(supportedResolutions),
      data_status: 'streaming',
      format: 'price',
    };

    setTimeout(function() {
      onResolve(symbol_stub);
      console.log('Resolving that symbol....', symbolName);
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
        rangeStartDate * 1000,
        rangeEndDate * 1000,
        symbolInfo.name
      );
      if (bars.length) {
        historyProvider.history[`${symbolInfo.name}${resolution}`] = {
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
      // case supportedResolutions['5 minutes']:
      //   return {
      //     resolutionBack: 'D' as ResolutionBackValues,
      //     intervalBack: 5,
      //   };

      // case supportedResolutions['1 hour']:
      //   return {
      //     resolutionBack: 'D' as ResolutionBackValues,
      //     intervalBack: 2,
      //   };

      // case supportedResolutions['1 day']:
      //   return {
      //     resolutionBack: 'D' as ResolutionBackValues,
      //     intervalBack: 2,
      //   };

      case supportedResolutions['1 month']:
        return {
          resolutionBack: 'M' as ResolutionBackValues,
          intervalBack: 2,
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
