import { QuotesStore } from './QuotesStore';
import { MainAppStore } from './MainAppStore';
import { createContext } from 'react';
import { SLTPStore } from './SLTPStore';
import { TabsStore } from './TabsStore';
import { TradingViewStore } from './TradingViewStore';
import { InstrumentsStore } from './InstrumentsStore';

export const StoresContext = createContext({
  quotesStore: new QuotesStore(),
  mainAppStore: new MainAppStore(),
  SLTPStore: new SLTPStore(),
  tabsStore: new TabsStore(),
  tradingViewStore: new TradingViewStore(),
  instrumentsStore: new InstrumentsStore(),
});

export type StoresContextType = typeof StoresContext;
