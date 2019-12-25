import { QuotesStore } from './QuotesStore';
import { MainAppStore } from './MainAppStore';
import { createContext } from 'react';
import { BuySellStore } from './BuySellStore';
import { TabsStore } from './TabsStore';

export const StoresContext = createContext({
  quotesStore: new QuotesStore(),
  mainAppStore: new MainAppStore(),
  buySellStore: new BuySellStore(),
  tabsStore: new TabsStore(),
});

export type StoresContextType = typeof StoresContext;
