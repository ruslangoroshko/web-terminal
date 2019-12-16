import {
  ResolutionString,
  Bar,
} from '../vendor/charting_library/charting_library.min';
import API from '../helpers/API';
import { CandleTypeEnum } from '../enums/CandleType';
import { HistoryCandlesType } from '../types/HistoryTypes';
import { AskBidEnum } from '../enums/AskBid';
import { supportedResolutions } from '../constants/supportedResolutionsTimeScale';
import minimumTime from '../constants/minimumTime';

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
      case supportedResolutions[0]:
        resolutionEnum = CandleTypeEnum.Min;
        break;

      case supportedResolutions[1]:
        resolutionEnum = CandleTypeEnum.Hour;
        break;

      case supportedResolutions[2]:
        resolutionEnum = CandleTypeEnum.Day;
        break;

      case supportedResolutions[3]:
        resolutionEnum = CandleTypeEnum.Month;
        break;

      default:
        break;
    }
    if (rangeStartDate <= minimumTime) {
      rangeStartDate = minimumTime;
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
