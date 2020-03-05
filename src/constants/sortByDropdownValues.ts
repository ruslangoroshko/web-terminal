import { SortByDropdownEnum } from '../enums/SortByDropdown';
import { SortByMarketsEnum } from '../enums/SortByMarketsEnum';

export const sortByDropdownProfitLabels = {
  [SortByDropdownEnum.NewFirstAsc]: 'New first',
  [SortByDropdownEnum.NewFirstDesc]: 'Old first',
  [SortByDropdownEnum.InvestmentAsc]: 'Investment: Large to Small',
  [SortByDropdownEnum.InvestmentDesc]: 'Investment: Small to Large',
  [SortByDropdownEnum.ProfitAsc]: 'Profit: Small to Large',
  [SortByDropdownEnum.ProfitDesc]: 'Profit: Large to Small',
};

export const sortByMarketsLabels = {
  [SortByMarketsEnum.Popularity]: 'By popularity',
  [SortByMarketsEnum.PriceChangeAsc]: 'By price change 24h High Low',
  [SortByMarketsEnum.PriceChangeDesc]: 'By price change 24h Low High',
  [SortByMarketsEnum.NameAsc]: 'By asset name A-Z',
  [SortByMarketsEnum.NameDesc]: 'By asset name Z-A',
};
