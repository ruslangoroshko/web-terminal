import axios from 'axios';
import {
  LibrarySymbolInfo,
  ResolutionString,
} from './charting_library/charting_library.min';

interface HistoryObj {
  [key: string]: any;
}

const api_root = 'https://min-api.cryptocompare.com';
const history: HistoryObj = {};

export default {
  history: history,

  getBars: async function(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    rangeStartDate: number,
    rangeEndDate: number,
    isFirstCall: boolean,
    limit = 2000
  ) {
    const split_symbol = symbolInfo.name.split(/[:/]/);
    const url =
      resolution === 'D'
        ? '/data/histoday'
        : +resolution >= 60
        ? '/data/histohour'
        : '/data/histominute';
    const qs = {
      e: split_symbol[0],
      fsym: split_symbol[1],
      tsym: split_symbol[2],
      toTs: rangeEndDate ? rangeEndDate : '',
      limit: limit,
      // aggregate: 1//resolution
    };

    let response = await axios.get<any>(`${api_root}${url}`, {
      params: qs,
    });
    const { data } = response;
    console.log({ data });
    if (data.Response && data.Response === 'Error') {
      console.log('CryptoCompare API error:', data.Message);
      return [];
    }
    if (data.Data.length) {
      console.log(
        `Actually returned: ${new Date(
          data.TimeFrom * 1000
        ).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`
      );
      const bars = data.Data.map((el: any) => {
        return {
          time: el.time * 1000,
          low: el.low,
          high: el.high,
          open: el.open,
          close: el.close,
          volume: el.volumefrom,
        };
      });
      if (isFirstCall) {
        const lastBar = bars[bars.length - 1];
        history[symbolInfo.name] = { lastBar: lastBar };
      }
      return bars;
    } else {
      return [];
    }
  },
};
