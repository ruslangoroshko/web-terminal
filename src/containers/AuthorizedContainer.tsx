import React, { FC, useEffect } from 'react';
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
import OrdersExpanded from '../components/SideBarTabs/OrdersExpanded';
import Markets from '../components/SideBarTabs/Markets';
import DepositPopupWrapper from '../components/DepositPopup/DepositPopupWrapper';
import DepositPaymentResultPopup from '../components/DepositPopup/DepositPaymentResultPopup/DepositPaymentResultPopup';
import {
  LOCAL_PORTFOLIO_TABS,
  LOCAL_STORAGE_SIDEBAR,
} from '../constants/global';
import NotificationPopup from '../components/NotificationPopup';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Page from '../constants/Pages';

interface Props {}

const RenderTabByType: FC = observer(() => {
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

const AuthorizedContainer: FC<Props> = observer((props) => {
  const { children } = props;

  const { tabsStore, mainAppStore, notificationStore } = useStores();
  const { push } = useHistory();

  const hiddenSideNavBar = useRouteMatch([Page.ONBOARDING]);
  const isHiddenSideNavBar = hiddenSideNavBar?.isExact;

  const hidenPromoPageList = useRouteMatch([
    Page.ACCOUNT_WITHDRAW,
    Page.DEPOSIT_POPUP,
    Page.ACCOUNT_DEPOSIT,
    Page.ACCOUNT_BALANCE_HISTORY,
    Page.PROOF_OF_IDENTITY,
    Page.ONBOARDING,
  ]);

  const isHiddenPromoPage = hidenPromoPageList?.isExact;

  useEffect(() => {
    if (mainAppStore.isPromoAccount && isHiddenPromoPage) {
      push(Page.DASHBOARD);
    }
  }, [mainAppStore.isPromoAccount]);

  useEffect(() => {
    const wasOpen = localStorage.getItem(LOCAL_STORAGE_SIDEBAR);
    if (wasOpen) {
      tabsStore.setSideBarType(parseInt(wasOpen));
    }
  }, []);

  useEffect(() => {
    // TODO Think about realization
    if (mainAppStore.paramsDeposit) {
      push(Page.DEPOSIT_POPUP);
    }
    if (mainAppStore.paramsPortfolioTab) {
      switch (mainAppStore.paramsPortfolioTab) {
        case 'active':
          tabsStore.setSideBarType(SideBarTabType.Portfolio);
          tabsStore.setPortfolioTab(PortfolioTabEnum.Portfolio);
          break;
        case 'pending':
          tabsStore.setSideBarType(SideBarTabType.Portfolio);
          tabsStore.setPortfolioTab(PortfolioTabEnum.Orders);
          break;
        case 'closed':
          tabsStore.setSideBarType(SideBarTabType.History);
          break;
        default:
          return;
      }
    }
    if (mainAppStore.paramsPortfolioActive) {
      tabsStore.setSideBarType(SideBarTabType.Portfolio);
      tabsStore.setPortfolioTab(PortfolioTabEnum.Portfolio);
      localStorage.removeItem(LOCAL_PORTFOLIO_TABS);
    }
    if (mainAppStore.paramsPortfolioOrder) {
      tabsStore.setSideBarType(SideBarTabType.Portfolio);
      tabsStore.setPortfolioTab(PortfolioTabEnum.Orders);
      localStorage.removeItem(LOCAL_PORTFOLIO_TABS);
    }
    if (mainAppStore.paramsPortfolioHistory) {
      tabsStore.setSideBarType(SideBarTabType.History);
    }
    if (mainAppStore.paramsMarkets) {
      tabsStore.setSideBarType(SideBarTabType.Markets);
    }
  }, [
    mainAppStore.activeAccount,
    mainAppStore.paramsMarkets,
    mainAppStore.paramsPortfolioTab,
    mainAppStore.paramsDeposit,
    mainAppStore.paramsPortfolioActive,
    mainAppStore.paramsPortfolioHistory,
    mainAppStore.paramsPortfolioOrder,
  ]);

  useEffect(() => {
    if (
      mainAppStore.isOnboarding &&
      !mainAppStore.isPromoAccount &&
      !mainAppStore.isDemoRealPopup
    ) {
      push(Page.ONBOARDING);
    }
  }, [
    mainAppStore.isOnboarding,
    mainAppStore.isPromoAccount,
    mainAppStore.isDemoRealPopup,
  ]);

  return (
    <FlexContainer
      height="100vh"
      width="100vw"
      position="relative"
      flexDirection="column"
      minHeight="700px"
      maxHeight="100vh"
      overflow="hidden"
    >
      <HiddenAnchor id="hidden-anchor" target="_blank" />
      <FlexContainer
        position="absolute"
        bottom="100px"
        left="14px"
        zIndex="1005"
      >
        <Observer>
          {() => (
            <NotificationPopup
              show={notificationStore.isActiveNotificationGlobal}
              global={true}
            ></NotificationPopup>
          )}
        </Observer>
      </FlexContainer>
      <Observer>
        {() => (
          <>
            {mainAppStore.isAuthorized && !isHiddenSideNavBar && (
              <NavBar></NavBar>
            )}
          </>
        )}
      </Observer>
      <Observer>
        {() => (
          <>
            {!mainAppStore.isPromoAccount && mainAppStore.activeAccount && (
              <>
                <DepositPaymentResultPopup />
                <DepositPopupWrapper />
              </>
            )}
          </>
        )}
      </Observer>

      <FlexContainer height="calc(100% - 48px)">
        <Observer>
          {() => (
            <>
              {mainAppStore.isAuthorized && !isHiddenSideNavBar && (
                <SideBar></SideBar>
              )}
            </>
          )}
        </Observer>
        <SideBarAndPageContentWrapper width="100%">
          <Observer>
            {() => (
              <>
                {!isHiddenSideNavBar && (
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
});
export default AuthorizedContainer;

const TabsLayoutWrapper = styled(FlexContainer)<
  FlexContainerProps & { isExpanded: boolean }
>`
  transform: ${(props) =>
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

const HiddenAnchor = styled.a`
  visibility: hidden;
`;
