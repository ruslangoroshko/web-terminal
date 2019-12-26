import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import MarketsIcon from '../../assets/svg/icon-bottom-bar-markets.svg';
import PortfolioIcon from '../../assets/svg/icon-bottom-bar-portfolio.svg';
import NewsIcon from '../../assets/svg/icon-bottom-bar-news.svg';

import SideBarButton from './SideBarButton';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { SideBarTabType } from '../../enums/SideBarTabType';
import { observer } from 'mobx-react-lite';

const SideBar = observer(() => {
  const { tabsStore } = useStores();
  const setSideBarActive = (tabType: SideBarTabType) => () => {
    if (tabsStore.sideBarTabType === tabType) {
      tabsStore.sideBarTabType = null;
    } else {
      tabsStore.sideBarTabType = tabType;
    }
  };
  return (
    <BottonNavBarWrapper
      flexDirection="column"
      height="100%"
      width="60px"
      backgroundColor="#232830"
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
        iconProps={NewsIcon}
        title="News"
        isActive={tabsStore.sideBarTabType === SideBarTabType.History}
        setSideBarActive={setSideBarActive(SideBarTabType.History)}
      />
    </BottonNavBarWrapper>
  );
});

export default SideBar;

const BottonNavBarWrapper = styled(FlexContainer)`
  box-shadow: 2px 0px 0px #1a1e22;
  border-right: 2px solid #1a1e22;
  min-width: 60px;
`;
