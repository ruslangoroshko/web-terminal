import {
  ResolutionString,
  Bar,
} from '../vendor/charting_library/charting_library.min';
import API from '../helpers/API';
import { CandleTypeEnum } from '../enums/CandleType';
import { HistoryCandlesType } from '../types/HistoryTypes';
import { AskBidEnum } from '../enums/AskBid';

interface HistoryObj {
  [key: string]: any;
}

const history: HistoryObj = {};

export default {
  history,
  getBars: async function(
    resolution: ResolutionString,
    rangeStartDate: number,
    rangeEndDate: number,
    instrumentId: string
  ): Promise<Bar[]> {
    let resolutionEnum = CandleTypeEnum.Min;

    switch (resolution) {
      case '1':
        resolutionEnum = CandleTypeEnum.Min;
        break;

      case '60':
        resolutionEnum = CandleTypeEnum.Hour;
        break;

      case 'D':
        resolutionEnum = CandleTypeEnum.Day;
        break;

      case 'M':
        resolutionEnum = CandleTypeEnum.Month;
        break;

      default:
        break;
    }

    const params: HistoryCandlesType = {
      candleType: resolutionEnum,
      // TODO: FIXME: hardcode
      bidOrAsk: AskBidEnum.Buy,
      fromDate: rangeStartDate,
      toDate: rangeEndDate,
      instrumentId,
    };

    return API.getPriceHistory(params);
  },
};
