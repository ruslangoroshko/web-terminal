import { RootStore } from './RootStore';
import { action, makeAutoObservable, observable } from 'mobx';
import { IWelcomeBonus, IWelcomeBonusExpirations } from '../types/UserInfo';
import moment from 'moment';

interface IBonusStore {
  bonusIsLoaded: boolean;
  bonusData: IWelcomeBonus | null;
  bonusPercent: number | undefined;
  bonusExpirationDate: number | undefined;
}

export class BonusStore implements IBonusStore {
  rootStore: RootStore;
  @observable bonusIsLoaded: boolean = false;
  @observable bonusData: IWelcomeBonus | null = null;
  @observable bonusPercent: number | undefined = 0;
  @observable bonusExpirationDate: number | undefined = 0;


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

  @action
  getUserBonus = () => {
    const currentDate = moment().unix();
    console.log(this.bonusData)
    const bonusInfo =
      this.bonusData?.welcomeBonusExpirations
        .sort(
          (a: IWelcomeBonusExpirations, b: IWelcomeBonusExpirations) =>
            a.expirationDateUtc - b.expirationDateUtc
        )
        .find(
          (data: IWelcomeBonusExpirations) =>
            data.expirationDateUtc > currentDate
        ) || this.bonusData?.welcomeBonusExpirations[0];

    this.bonusPercent = bonusInfo?.bonusPercentageFromFtd;
    this.bonusExpirationDate = bonusInfo?.expirationDateUtc;
  }
}
