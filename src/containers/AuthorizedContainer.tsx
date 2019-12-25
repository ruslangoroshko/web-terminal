import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import NavBar from '../components/NavBar/NavBar';
import BottomNavBar from '../components/NavBar/BottomNavBar';
import ResizableContainer from '../components/NavBarTabs/ResizableContainer';
import { observer } from 'mobx-react-lite';

interface Props {}

const AuthorizedContainer: FC<Props> = observer(props => {
  const { children } = props;

  return (
    <FlexContainer
      height="100vh"
      width="100%"
      position="relative"
      flexDirection="column"
    >
      <NavBar></NavBar>
      <FlexContainer height="100%">
        <BottomNavBar></BottomNavBar>
        <ResizableContainer></ResizableContainer>
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
