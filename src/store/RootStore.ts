import { QuotesStore } from './QuotesStore';
import { MainAppStore } from './MainAppStore';
import { SLTPStore } from './SLTPStore';
import { TabsStore } from './TabsStore';
import { TradingViewStore } from './TradingViewStore';
import { InstrumentsStore } from './InstrumentsStore';
import { DateRangeStore } from './DateRangeStore';
import { HistoryStore } from './HistoryStore';
import { KYCstore } from './KYCstore';
import { NotificationStore } from './NotificationStore';
import { SortingStore } from './SortingStore';

export class RootStore {
  quotesStore: QuotesStore;
  mainAppStore: MainAppStore;
  SLTPStore: SLTPStore;
  tabsStore: TabsStore;
  tradingViewStore: TradingViewStore;
  instrumentsStore: InstrumentsStore;
  dateRangeStore: DateRangeStore;
  historyStore: HistoryStore;
  kycStore: KYCstore;
  notificationStore: NotificationStore;
  sortingStore: SortingStore;

  constructor() {
    this.quotesStore = new QuotesStore(this);
    this.mainAppStore = new MainAppStore(this);
    this.SLTPStore = new SLTPStore();
    this.tabsStore = new TabsStore();
    this.tradingViewStore = new TradingViewStore();
    this.instrumentsStore = new InstrumentsStore(this);
    this.dateRangeStore = new DateRangeStore();
    this.historyStore = new HistoryStore();
    this.kycStore = new KYCstore();
    this.notificationStore = new NotificationStore();
    this.sortingStore = new SortingStore(this);
  }
}
