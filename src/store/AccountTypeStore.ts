import { observable, action, makeAutoObservable } from 'mobx';
import { IAccountType, MTCreateAccountDTO } from '../types/AccountsTypes';
import { RootStore } from './RootStore';
import API from '../helpers/API';
import KeysInApi from '../constants/keysInApi';

interface ContextProps {
  actualType: IAccountType | null;
  nextType: IAccountType | null;
  showCongratulationsPopup: boolean;
  allTypes: IAccountType[] | null;
  currentAccountTypeProgressPercentage: number | null;
  amountToNextAccountType: number | null;
}

export class AccountTypeStore implements ContextProps {
  @observable actualType: IAccountType | null = null;
  @observable nextType: IAccountType | null = null;
  @observable allTypes: IAccountType[] | null = null;
  @observable showCongratulationsPopup: boolean = false;
  @observable showMTPopup: boolean = false;
  @observable showMTErrorPopup: boolean = false;
  @observable currentAccountTypeProgressPercentage: number | null = null;
  @observable amountToNextAccountType: number | null = null;
  @observable newMTAccountInfo: MTCreateAccountDTO | null = null;
  @observable isMTAvailable: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
  }

  @action
  setActualType = (newActualType: IAccountType | null) => {
    this.actualType = newActualType;
  };

  @action
  setNextType = (newNextType: IAccountType | null) => {
    this.nextType = newNextType;
  };

  @action
  setAllTypes = (newActualType: IAccountType[] | null) => {
    this.allTypes = newActualType;
  };

  @action
  setMTAvailable = (newValue: boolean) => {
    this.isMTAvailable = newValue;
  };

  @action
  setShowPopup = (newValue: boolean) => {
    this.showCongratulationsPopup = newValue;
  };

  @action
  setShowMTPopup = (newValue: boolean) => {
    this.showMTPopup = newValue;
  };

  @action
  setShowMTErrorPopup = (newValue: boolean) => {
    this.showMTErrorPopup = newValue;
  };

  @action
  setNewMTAccountInfo = (newValue: MTCreateAccountDTO | null) => {
    this.newMTAccountInfo = newValue;
  };

  @action
  setAmount = (newValue: number | null) => {
    this.amountToNextAccountType = newValue;
  };

  @action
  setPercentage = (newValue: number | null) => {
    this.currentAccountTypeProgressPercentage = newValue;
  };

  @action
  checkActiveAccount = async (currentAccountTypeId: string) => {
    try {
      const activeStatusId = await API.getKeyValue(
        KeysInApi.ACTIVE_ACCOUNT_STATUS
      );

      if (activeStatusId && activeStatusId !== currentAccountTypeId) {
        this.showCongratulationsPopup = true;
      }
    } catch (error) {}
  };

  @action
  setKVActiveStatus = async (
    currentAccountTypeId: string,
    init: boolean = false
  ) => {
    try {
      if (init) {
        // on new user init KV Status
        const activeStatusId = await API.getKeyValue(
          KeysInApi.ACTIVE_ACCOUNT_STATUS
        );

        if (!activeStatusId) {
          await API.setKeyValue(
            {
              key: KeysInApi.ACTIVE_ACCOUNT_STATUS,
              value: currentAccountTypeId,
            }
          );
        }
      } else {
        // custom save KV
        if (currentAccountTypeId) {
          await API.setKeyValue(
            {
              key: KeysInApi.ACTIVE_ACCOUNT_STATUS,
              value: currentAccountTypeId,
            }
          );
        }
      }
    } catch (error) {}
  };

  @action
  resetAccountType = () => {
    this.actualType = null;
    this.nextType = null;
    this.allTypes = null;
    this.showCongratulationsPopup = false;
    this.amountToNextAccountType = null;
    this.currentAccountTypeProgressPercentage = null;
    this.newMTAccountInfo = null;
    this.showMTErrorPopup = false;
    this.showMTPopup = false;
    this.isMTAvailable = false;
  };
}
