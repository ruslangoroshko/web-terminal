import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import NavBar from '../components/NavBar/NavBar';
import SideBar from '../components/NavBar/SideBar';
import ResizableContainer from '../components/ResizableContainer';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import { SideBarTabType } from '../enums/SideBarTabType';
import Portfolio from '../components/SideBarTabs/Portfolio';

interface Props {}

const AuthorizedContainer: FC<Props> = observer(props => {
  const { children } = props;
  const { tabsStore } = useStores();

  const renderTabByType = () => {
    if (tabsStore.sideBarTabType === null) {
      return null;
    }

    // Careful, typings !11!!!1

    switch (tabsStore.sideBarTabType!) {
      case SideBarTabType.Portfolio:
        return (
          <ResizableContainer>
            <Portfolio></Portfolio>
          </ResizableContainer>
        );

      case SideBarTabType.Markets:
        return (
          <ResizableContainer>
            <Portfolio></Portfolio>
          </ResizableContainer>
        );

      case SideBarTabType.History:
        return (
          <ResizableContainer>
            <Portfolio></Portfolio>
          </ResizableContainer>
        );

      default:
        return null;
    }
  };

  return (
    <FlexContainer
      height="100vh"
      width="100%"
      position="relative"
      flexDirection="column"
    >
      <NavBar></NavBar>
      <FlexContainer height="100%">
        <SideBar></SideBar>
        {renderTabByType()}
        <FlexContainer
          position="relative"
          height="100%"
          width="100%"
          zIndex="101"
        >
          {children}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
});

export default AuthorizedContainer;
