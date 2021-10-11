import { RootStore } from './RootStore';
import { action, makeAutoObservable, observable } from 'mobx';
import { IEducationCourses, IEducationQuestion, IEducationQuestionsList } from '../types/EducationTypes';

interface IEducationStore {
  educationIsLoaded: boolean;
  showPopup: boolean;
  coursesList: IEducationCourses[] | null;
  questionsList: IEducationQuestionsList | null;
  activeCourse: IEducationCourses | null;
  activeQuestion: IEducationQuestion | null;
}

export class EducationStore implements IEducationStore {
  rootStore: RootStore;
  @observable educationIsLoaded: boolean = false;
  @observable coursesList: IEducationCourses[] | null = null;
  @observable questionsList: IEducationQuestionsList | null = null;
  @observable activeCourse: IEducationCourses | null = null;
  @observable activeQuestion: IEducationQuestion | null = null;
  @observable showPopup: boolean = false;


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
}
