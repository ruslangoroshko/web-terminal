import { ResolutionString } from '../vendor/charting_library/charting_library.min';
// Time interval (x axis ticks)
export const supportedResolutions = {
  //: ResolutionString[] = ['1', '60', '1D', '1M'];
  '1 minute': '1',
  '5 minutes': '5',
  '30 minutes': '30',
  '1 hour': '60',
  '1 day': '1D',
  '1 month': '1M',
};
// From date to date
export const supportedInterval = {
  '1D': '1D',
  '5D': '5D',
  '1M': '1M',
  YTD:
    `${new Date().getMonth() + 1}M` === '1M'
      ? '30D'
      : `${new Date().getMonth() + 1}M`,
  '1Y': '12M',
  '3Y': '36M',
  All: '100M',
};
