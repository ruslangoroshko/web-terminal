import { RootStore } from './RootStore';
import { action, makeAutoObservable, observable } from 'mobx';
import { IWelcomeBonus, IWelcomeBonusExpirations } from '../types/UserInfo';
import moment from 'moment';

interface IBonusStore {
  bonusIsLoaded: boolean;
  showBonusPopup: boolean;
  showBonusDeposit: boolean;
  bonusData: IWelcomeBonus | null;
  bonusPercent: number | undefined;
  bonusExpirationDate: number | undefined;
  onboardingFromDropdown: boolean;
}

export class BonusStore implements IBonusStore {
  rootStore: RootStore;
  @observable bonusIsLoaded: boolean = false;
  @observable bonusData: IWelcomeBonus | null = null;
  @observable bonusPercent: number | undefined = 0;
  @observable bonusExpirationDate: number | undefined = 0;
  @observable showBonusPopup: boolean = false;
  @observable showBonusDeposit: boolean = false;
  @observable onboardingFromDropdown: boolean = false;


  constructor(rootStore: RootStore) {
    makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
  }

  @action
  setBonusIsLoaded = (newValue: boolean) => {
    this.bonusIsLoaded = newValue;
  };

  @action
  setShowBonusPopup = (newValue: boolean) => {
    this.showBonusPopup = newValue;
  };

  @action
  setShowBonusDeposit = (newValue: boolean) => {
    this.showBonusDeposit = newValue;
  };

  @action
  setOnboardingFromDropdown = (newValue: boolean) => {
    this.onboardingFromDropdown = newValue;
  };

  @action
  setBonusData = (newValue: IWelcomeBonus | null) => {
    this.bonusData = newValue;
  };

  @action
  getUserBonus = () => {
    const currentDate = moment().unix();
    const bonusInfo: IWelcomeBonusExpirations | null =
      this.bonusData?.welcomeBonusExpirations
        .sort(
          (a: IWelcomeBonusExpirations, b: IWelcomeBonusExpirations) =>
            a.expirationDateUtc - b.expirationDateUtc
        )
        .find(
          (data: IWelcomeBonusExpirations) =>
            data.expirationDateUtc > currentDate
        ) || null;

    if (bonusInfo !== null) {
      this.bonusPercent = bonusInfo?.bonusPercentageFromFtd;
      this.bonusExpirationDate = bonusInfo?.expirationDateUtc;
    } else {
      this.bonusData = null;
    }
  }

  @action
  showBonus = () => {
    return this.bonusIsLoaded &&
      this.bonusData !== null &&
      this.bonusData?.welcomeBonusExpirations !== null
  }
}
