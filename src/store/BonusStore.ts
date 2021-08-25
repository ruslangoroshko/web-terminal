import { RootStore } from './RootStore';
import { action, makeAutoObservable, observable } from 'mobx';
import { IWelcomeBonus } from '../types/UserInfo';

interface IBonusStore {
  bonusIsLoaded: boolean;
  bonusData: IWelcomeBonus | null;
}

export class BonusStore implements IBonusStore {
  rootStore: RootStore;
  bonusIsLoaded: boolean = false;
  bonusData: IWelcomeBonus | null = null;


  constructor(rootStore: RootStore) {
    makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
  }

  @action
  setBonusIsLoaded = (newValue: boolean) => {
    this.bonusIsLoaded = newValue;
  };

  @action
  setBonusData = (newValue: IWelcomeBonus | null) => {
    this.bonusData = newValue;
  };
}
