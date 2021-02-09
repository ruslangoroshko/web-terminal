import { observable, action, makeAutoObservable } from 'mobx';
import { SideBarTabType } from '../enums/SideBarTabType';
import { PortfolioTabEnum } from '../enums/PortfolioTabEnum';
import { HistoryTabEnum } from '../enums/HistoryTabEnum';
import {
  LOCAL_STORAGE_SIDEBAR,
  LOCAL_POSITION,
  LOCAL_PENDING_POSITION,
  LOCAL_HISTORY_POSITION,
  LOCAL_HISTORY_TIME,
  LOCAL_HISTORY_DATERANGE,
  LOCAL_HISTORY_PAGE,
  LOCAL_POSITION_SORT,
  LOCAL_PENDING_POSITION_SORT,
} from '../constants/global';

interface ContextProps {
  sideBarTabType: SideBarTabType | null;
  portfolioTab: PortfolioTabEnum;
  historyTab: HistoryTabEnum;
  closeAnyTab: () => void;
  isTabExpanded: boolean;
}

export class TabsStore implements ContextProps {
  sideBarTabType: SideBarTabType | null = null;
  isTabExpanded = false;
  portfolioTab: PortfolioTabEnum = PortfolioTabEnum.Portfolio;
  historyTab: HistoryTabEnum = HistoryTabEnum.TradingHistory;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  closeAnyTab = () => {
    this.isTabExpanded = false;
    this.sideBarTabType = null;
    localStorage.removeItem(LOCAL_STORAGE_SIDEBAR);
    localStorage.removeItem(LOCAL_POSITION);
    localStorage.removeItem(LOCAL_POSITION_SORT);
    localStorage.removeItem(LOCAL_PENDING_POSITION);
    localStorage.removeItem(LOCAL_PENDING_POSITION_SORT);
    localStorage.removeItem(LOCAL_HISTORY_POSITION);
    localStorage.removeItem(LOCAL_HISTORY_TIME);
    localStorage.removeItem(LOCAL_HISTORY_DATERANGE);
    localStorage.removeItem(LOCAL_HISTORY_PAGE);
  };

  @action
  setSideBarType = (sideBarTabType: SideBarTabType | null) => {
    this.sideBarTabType = sideBarTabType;
  };

  @action
  setTabExpanded = (isTabExpanded: boolean) => {
    this.isTabExpanded = isTabExpanded;
  };

  @action
  setPortfolioTab = (newTab: PortfolioTabEnum) => {
    this.portfolioTab = newTab;
  };
}
