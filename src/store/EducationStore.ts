import { RootStore } from './RootStore';
import { action, makeAutoObservable, observable } from 'mobx';
import {
  IEducationCourses,
  IEducationQuestion,
  IEducationQuestionsList,
} from '../types/EducationTypes';
import { HintEnum } from '../enums/HintsEnum';
import KeysInApi from '../constants/keysInApi';
import API from '../helpers/API';

interface IEducationStore {
  educationIsLoaded: boolean;
  showPopup: boolean;
  coursesList: IEducationCourses[] | null;
  questionsList: IEducationQuestionsList | null;
  activeCourse: IEducationCourses | null;
  activeQuestion: IEducationQuestion | null;
  educationHint: HintEnum | null;
}

export class EducationStore implements IEducationStore {
  rootStore: RootStore;
  @observable educationIsLoaded: boolean = false;
  @observable coursesList: IEducationCourses[] | null = null;
  @observable questionsList: IEducationQuestionsList | null = null;
  @observable activeCourse: IEducationCourses | null = null;
  @observable activeQuestion: IEducationQuestion | null = null;
  @observable showPopup: boolean = false;
  @observable educationHint: HintEnum | null = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
  }

  @action
  setEducationIsLoaded = (newValue: boolean) => {
    this.educationIsLoaded = newValue;
  };

  @action
  setShowPopup = (newValue: boolean) => {
    this.showPopup = newValue;
  };

  @action
  setCoursesList = (newValue: IEducationCourses[] | null) => {
    this.coursesList = newValue;
  };

  @action
  setQuestionsList = (newValue: IEducationQuestionsList | null) => {
    this.questionsList = newValue;
  };

  @action
  setActiveCourse = (newValue: IEducationCourses | null) => {
    this.activeCourse = newValue;
  };

  @action
  setActiveQuestion = (newValue: IEducationQuestion | null) => {
    this.activeQuestion = newValue;
  };

  @action
  setFTopenHint = async (value: HintEnum) => {
    const userActiveHint = await API.getKeyValue(KeysInApi.SHOW_HINT);
    // hint was closet
    if (userActiveHint === 'false') {
      return;
    }
    // hint dont exist
    if (!Object.keys(HintEnum).includes(userActiveHint.trim())) {
      this.setHint(value);
    }
  };

  @action
  updateHint = async (value: HintEnum) => {
    const userActiveHint = await API.getKeyValue(KeysInApi.SHOW_HINT);
    // hint was closet
    if (userActiveHint === 'false') {
      return Promise.resolve();
    }
    await this.setHint(value);

    return Promise.resolve();
  };

  @action
  setHint = async (value: HintEnum | null, saveKeyValue: boolean = true) => {
    if (this.rootStore.mainAppStore.isAuthorized) {
      try {
        this.educationHint = value;
        saveKeyValue &&
          (await API.setKeyValue({
            key: KeysInApi.SHOW_HINT,
            value: value || false,
          }));
        return Promise.resolve();
      } catch (error) {
        return Promise.resolve();
      }
    }
  };

  @action
  openHint = (value: HintEnum, saveKeyValue: boolean = true) => {
    this.setHint(value, saveKeyValue);
  };

  @action
  closeHint = () => {
    this.setHint(null);
  };
}
