import { RootStore } from './RootStore';
import { action, makeAutoObservable, observable } from 'mobx';
import { IWelcomeBonus, IWelcomeBonusExpirations } from '../types/UserInfo';
import moment from 'moment';
import API from '../helpers/API';
import { WelcomeBonusResponseEnum } from '../enums/WelcomeBonusResponseEnum';

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
  getUserBonus = async () => {
    this.bonusIsLoaded = false;
    this.bonusData = null;
    try {
      const response = await API.getUserBonus(this.rootStore.mainAppStore.initModel.miscUrl);
      if (
        response.responseCode === WelcomeBonusResponseEnum.Ok &&
        response.data.welcomeBonusExpirations !== null
      ) {
        const currentDate = moment().unix();

        const bonusInfo =
          response.data.welcomeBonusExpirations
            .sort(
              (a: IWelcomeBonusExpirations, b: IWelcomeBonusExpirations) =>
                a.expirationDateUtc - b.expirationDateUtc
            )
            .find(
              (data: IWelcomeBonusExpirations) =>
                data.expirationDateUtc > currentDate
            ) || response.data.welcomeBonusExpirations[0];

        this.bonusPercent = bonusInfo.bonusPercentageFromFtd;
        this.bonusExpirationDate = bonusInfo.expirationDateUtc;
        this.bonusData = response.data;
      }

      this.bonusIsLoaded = true;
    } catch (error) {
      this.bonusIsLoaded = true;
    }
  }

  @action
  showBonus = () => {
    return this.bonusIsLoaded &&
      this.bonusData?.welcomeBonusExpirations !== null
  }
}
