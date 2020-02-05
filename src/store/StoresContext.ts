import { QuotesStore } from './QuotesStore';
import { MainAppStore } from './MainAppStore';
import { createContext } from 'react';
import { SLTPStore } from './SLTPStore';
import { TabsStore } from './TabsStore';
import { TradingViewStore } from './TradingViewStore';
import { InstrumentsStore } from './InstrumentsStore';
import { DateRangeStore } from './DateRangeStore';
import { HistoryStore } from './HistoryStore';
import { KYCstore } from './KYCstore';

export const StoresContext = createContext({
  quotesStore: new QuotesStore(),
  mainAppStore: new MainAppStore(),
  SLTPStore: new SLTPStore(),
  tabsStore: new TabsStore(),
  tradingViewStore: new TradingViewStore(),
  instrumentsStore: new InstrumentsStore(),
  dateRangeStore: new DateRangeStore(),
  historyStore: new HistoryStore(),
  kycStore: new KYCstore(),
});

export type StoresContextType = typeof StoresContext;
