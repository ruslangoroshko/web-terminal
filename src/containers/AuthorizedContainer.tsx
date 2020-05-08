import React, { FC } from 'react';
import { FlexContainer, FlexContainerProps } from '../styles/FlexContainer';
import NavBar from '../components/NavBar/NavBar';
import SideBar from '../components/NavBar/SideBar';
import ResizableContainer from '../components/ResizableContainer';
import { observer, Observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import { SideBarTabType } from '../enums/SideBarTabType';
import Portfolio from '../components/SideBarTabs/Portfolio';
import styled from '@emotion/styled';
import PortfolioExpanded from '../components/SideBarTabs/PortfolioExpanded';
import { PortfolioTabEnum } from '../enums/PortfolioTabEnum';
import Orders from '../components/SideBarTabs/Orders';
import { keyframes } from '@emotion/core';
import TradingHistory from '../components/SideBarTabs/TradingHistory';
import { HistoryTabEnum } from '../enums/HistoryTabEnum';
import TradingHistoryExpanded from '../components/SideBarTabs/TradingHistoryExpanded';
import LoaderFullscreen from '../components/LoaderFullscreen';
import OrdersExpanded from '../components/SideBarTabs/OrdersExpanded';
import Markets from '../components/SideBarTabs/Markets';

interface Props {}

const RenderTabByType = observer(() => {
  const { tabsStore } = useStores();
  if (tabsStore.sideBarTabType === null) {
    return null;
  }

  // Careful, typings !11!!!1
  switch (tabsStore.sideBarTabType!) {
    case SideBarTabType.Portfolio:
      return tabsStore.portfolioTab === PortfolioTabEnum.Portfolio ? (
        <ResizableContentAnimationWrapper>
          <Portfolio></Portfolio>
        </ResizableContentAnimationWrapper>
      ) : (
        <ResizableContentAnimationWrapper>
          <Orders></Orders>
        </ResizableContentAnimationWrapper>
      );

    case SideBarTabType.Markets:
      return (
        <ResizableContentAnimationWrapper>
          <Markets></Markets>
        </ResizableContentAnimationWrapper>
      );

    case SideBarTabType.History:
      return tabsStore.historyTab === HistoryTabEnum.TradingHistory ? (
        <ResizableContentAnimationWrapper>
          <TradingHistory></TradingHistory>
        </ResizableContentAnimationWrapper>
      ) : (
        <ResizableContentAnimationWrapper>
          <TradingHistory></TradingHistory>
        </ResizableContentAnimationWrapper>
      );

    default:
      return null;
  }
});

const RenderExpandedTabByType = observer(() => {
  const { tabsStore } = useStores();

  if (tabsStore.sideBarTabType === null) {
    return null;
  }
  // Careful, typings !11!!!1
  switch (tabsStore.sideBarTabType!) {
    case SideBarTabType.Portfolio:
      return tabsStore.portfolioTab === PortfolioTabEnum.Portfolio ? (
        <PortfolioExpanded></PortfolioExpanded>
      ) : (
        <OrdersExpanded></OrdersExpanded>
      );

    case SideBarTabType.Markets:
      return <PortfolioExpanded></PortfolioExpanded>;

    case SideBarTabType.History:
      return <TradingHistoryExpanded></TradingHistoryExpanded>;

    default:
      return null;
  }
});

const AuthorizedContainer: FC<Props> = props => {
  const { children } = props;
  const { tabsStore, mainAppStore } = useStores();

  return (
    <FlexContainer
      height="100vh"
      width="100vw"
      position="relative"
      flexDirection="column"
      minHeight="700px"
    >
      <Observer>
        {() => <>{mainAppStore.isAuthorized && <NavBar></NavBar>}</>}
      </Observer>
      <FlexContainer height="calc(100% - 48px)">
        <SideBar></SideBar>
        <SideBarAndPageContentWrapper width="100%">
          <Observer>
            {() => (
              <>
                <TabsLayoutWrapper
                  position="absolute"
                  top="48px"
                  right="calc(100% - 60px)"
                  bottom="0"
                  width="calc(100vw - 60px)"
                  isExpanded={tabsStore.isTabExpanded}
                  zIndex="103"
                >
                  <RenderExpandedTabByType />
                </TabsLayoutWrapper>
                <ResizableContainer>
                  <RenderTabByType />
                </ResizableContainer>
              </>
            )}
          </Observer>
          <FlexContainer
            position="relative"
            height="100%"
            width="100%"
            zIndex="101"
          >
            {children}
          </FlexContainer>
        </SideBarAndPageContentWrapper>
      </FlexContainer>
    </FlexContainer>
  );
};
export default AuthorizedContainer;

const TabsLayoutWrapper = styled(FlexContainer)<
  FlexContainerProps & { isExpanded: boolean }
>`
  transform: ${props =>
    props.isExpanded ? 'translateX(100%)' : 'translateX(-60px)'};
  backface-visibility: hidden;
  will-change: transform;
  transition: transform 0.7s cubic-bezier(0.77, 0, 0.175, 1);
`;

const SideBarAndPageContentWrapper = styled(FlexContainer)`
  background: radial-gradient(
      92.11% 100% at 0% 0%,
      rgba(255, 252, 204, 0.08) 0%,
      rgba(255, 252, 204, 0) 100%
    ),
    #252636;
  box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.08);
  overflow: hidden;
  border-top-left-radius: 8px;
`;

const fadein = keyframes`
    from { 
      opacity: 0;
      visibility: visible;
     }
    to { 
      opacity: 1;
      visibility: visible;
    }
`;

const ResizableContentAnimationWrapper = styled(FlexContainer)`
  visibility: hidden;
  opacity: 0;
  animation: ${fadein} 0.2s forwards 0.3s;
  flex-direction: column;
  height: 100%;
`;
