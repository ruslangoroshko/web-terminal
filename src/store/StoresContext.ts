import { QuotesStore } from './QuotesStore';
import { MainAppStore } from './MainAppStore';
import { createContext } from 'react';
import { BuySellStore } from './BuySellStore';

export const StoresContext = createContext({
  quotesStore: new QuotesStore(),
  mainAppStore: new MainAppStore(),
  buySellStore: new BuySellStore(),
});

export type StoresContextType = typeof StoresContext;
