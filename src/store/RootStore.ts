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

  constructor() {
    this.quotesStore = new QuotesStore();
    this.mainAppStore = new MainAppStore();
    this.SLTPStore = new SLTPStore();
    this.tabsStore = new TabsStore();
    this.tradingViewStore = new TradingViewStore();
    this.instrumentsStore = new InstrumentsStore(this);
    this.dateRangeStore = new DateRangeStore();
    this.historyStore = new HistoryStore();
    this.kycStore = new KYCstore();
    this.notificationStore = new NotificationStore();
  }
}
