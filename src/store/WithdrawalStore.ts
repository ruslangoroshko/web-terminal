import { observable, action, makeAutoObservable } from 'mobx';
import { WithdrawalHistoryModel } from './../types/WithdrawalTypes';

export class WithdrawalStore {
  loading: boolean = false;
  history: WithdrawalHistoryModel[] | null = null;
  activeTab: number = 0;
  pendingPopup: boolean = false;
  showBonusPopup: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setPendingPopup = () => {
    this.pendingPopup = true;
  };

  @action
  closePendingPopup = () => {
    this.pendingPopup = false;
  };

  @action
  setBonusPopup = () => {
    this.showBonusPopup = true;
  };
  @action
  closeBonusPopup = () => {
    this.showBonusPopup = false;
  };

  @action
  setLoad = () => {
    this.loading = true;
  };

  @action
  opentTab = (tab: number) => {
    this.activeTab = tab;
  };

  @action
  endLoad = () => {
    this.loading = false;
  };

  @action
  setHistory = (list: WithdrawalHistoryModel[] | null) => {
    this.history = list;
  };
}
