import { QuotesStore } from './QuotesStore';
import { MainAppStore } from './MainAppStore';
import { createContext } from 'react';

export const StoresContext = createContext({
  quotesStore: new QuotesStore(),
  mainAppStore: new MainAppStore(),
});

export type StoresContextType = typeof StoresContext;