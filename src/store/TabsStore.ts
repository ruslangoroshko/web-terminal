import { observable, action } from 'mobx';
import { SideBarTabType } from '../enums/SideBarTabType';
import { PortfolioTabEnum } from '../enums/PortfolioTabEnum';

interface ContextProps {
  sideBarTabType: SideBarTabType | null;
  portfolioTab: PortfolioTabEnum | null;
  closeAnyTab: () => void;
  isTabExpanded: boolean;
}

export class TabsStore implements ContextProps {
  @observable sideBarTabType: SideBarTabType | null = null;
  @observable isTabExpanded = false;
  @observable portfolioTab: PortfolioTabEnum = PortfolioTabEnum.Portfolio;

  @action
  closeAnyTab = () => {
    this.isTabExpanded = false;
    this.sideBarTabType = null;
  };
}
