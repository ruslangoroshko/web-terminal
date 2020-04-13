import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import NavBar from '../components/NavBar/NavBar';
import StepsContainter from '../components/KYC/StepsContainter';

const KYCcontainer: FC = props => {
  const { children } = props;

  return (
    <FlexContainer
      height="100vh"
      width="100vw"
      position="relative"
      flexDirection="column"
    >
      <NavBar></NavBar>
      <FlexContainer
        min-height="calc(100vh - 48px)"
        height="100%"
        flexDirection="column"
      >
        <StepsContainter></StepsContainter>
        {children}
      </FlexContainer>
    </FlexContainer>
  );
};
export default KYCcontainer;
