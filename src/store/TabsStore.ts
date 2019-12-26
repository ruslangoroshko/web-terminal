import { observable, action } from 'mobx';
import { SideBarTabType } from '../enums/SideBarTabType';

interface ContextProps {
  sideBarTabType: SideBarTabType | null;
  closeAnyTab: () => void;
  isTabExpanded: boolean;
}

export class TabsStore implements ContextProps {
  @observable sideBarTabType: SideBarTabType | null = null;
  @observable isTabExpanded = false;
  @action
  closeAnyTab = () => {
    this.isTabExpanded = false;
    this.sideBarTabType = null;
  };
}
