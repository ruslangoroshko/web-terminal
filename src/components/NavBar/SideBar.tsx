import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import MarketsIcon from '../../assets/svg/icon-bottom-bar-markets.svg';
import PortfolioIcon from '../../assets/svg/icon-bottom-bar-portfolio.svg';
import IconHistory from '../../assets/svg/icon-sidebar-history.svg';
import SideBarButton from './SideBarButton';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { SideBarTabType } from '../../enums/SideBarTabType';
import { observer } from 'mobx-react-lite';

const SideBar = observer(() => {
  const { tabsStore, dateRangeStore } = useStores();
  const setSideBarActive = (tabType: SideBarTabType) => () => {
    tabsStore.isTabExpanded = false;
    
    if (tabsStore.sideBarTabType === tabType) {
      tabsStore.sideBarTabType = null;
      dateRangeStore.resetDatepicker();
    } else {
      tabsStore.sideBarTabType = tabType;
    }

    if (tabsStore.sideBarTabType !== SideBarTabType.History) {
      dateRangeStore.resetDatepicker();
    }
  };
  return (
    <BottonNavBarWrapper
      flexDirection="column"
      height="100%"
      width="60px"
      zIndex="104"
      position="relative"
    >
      <SideBarButton
        iconProps={MarketsIcon}
        title="Markets"
        isActive={tabsStore.sideBarTabType === SideBarTabType.Markets}
        setSideBarActive={setSideBarActive(SideBarTabType.Markets)}
      />
      <SideBarButton
        iconProps={PortfolioIcon}
        title="Portfolio"
        isActive={tabsStore.sideBarTabType === SideBarTabType.Portfolio}
        setSideBarActive={setSideBarActive(SideBarTabType.Portfolio)}
      />
      <SideBarButton
        iconProps={IconHistory}
        title="History"
        isActive={tabsStore.sideBarTabType === SideBarTabType.History}
        setSideBarActive={setSideBarActive(SideBarTabType.History)}
      />
    </BottonNavBarWrapper>
  );
});

export default SideBar;

const BottonNavBarWrapper = styled(FlexContainer)`
  min-width: 60px;
`;
