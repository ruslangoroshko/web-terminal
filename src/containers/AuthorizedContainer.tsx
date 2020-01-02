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

interface Props {}

const RenderTabByType = observer(() => {
  const { tabsStore } = useStores();
  if (tabsStore.sideBarTabType === null) {
    return null;
  }

  // Careful, typings !11!!!1
  switch (tabsStore.sideBarTabType!) {
    case SideBarTabType.Portfolio:
      return <Portfolio></Portfolio>;

    case SideBarTabType.Markets:
      return <Portfolio></Portfolio>;

    case SideBarTabType.History:
      return <Portfolio></Portfolio>;

    default:
      return null;
  }
});

const RenderExpandedTabByType = () => {
  const { tabsStore } = useStores();

  if (tabsStore.sideBarTabType === null) {
    return null;
  }
  // Careful, typings !11!!!1
  switch (tabsStore.sideBarTabType!) {
    case SideBarTabType.Portfolio:
      return <PortfolioExpanded></PortfolioExpanded>;

    case SideBarTabType.Markets:
      return <PortfolioExpanded></PortfolioExpanded>;

    case SideBarTabType.History:
      return <PortfolioExpanded></PortfolioExpanded>;

    default:
      return null;
  }
};

const AuthorizedContainer: FC<Props> = props => {
  const { children } = props;
  const { tabsStore } = useStores();

  return (
    <FlexContainer
      height="100vh"
      width="100vw"
      position="relative"
      flexDirection="column"
    >
      <NavBar></NavBar>
      <FlexContainer height="100%">
        <SideBar></SideBar>
        <SideBarAndPageContentWrapper width="100%">
          <Observer>
            {() => (
              <>
                <TabsLayoutWrapper
                  position="absolute"
                  top="0"
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
            zIndex="102"
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
    props.isExpanded ? 'translateX(100%)' : 'translateX(0)'};
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
  border-top-left-radius: 4px;
`;
