import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import NavBar from '../components/NavBar/NavBar';
import BottomNavBar from '../components/NavBar/BottomNavBar';

interface Props {}

const AuthorizedContainer: FC<Props> = props => {
  const { children } = props;

  return (
    <FlexContainer height="100vh" width="100%" position="relative" flexDirection="column">
      <NavBar></NavBar>
      <FlexContainer height="100%">
        <BottomNavBar></BottomNavBar>
        <FlexContainer height="100%" width="100%">{children}</FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default AuthorizedContainer;
