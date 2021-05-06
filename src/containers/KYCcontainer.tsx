import React, { FC, useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import NavBar from '../components/NavBar/NavBar';
import StepsContainter from '../components/KYC/StepsContainter';
import { useStores } from '../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router';
import Page from '../constants/Pages';

const KYCcontainer: FC = observer((props) => {
  const { children } = props;
  const { mainAppStore } = useStores();
  const { push } = useHistory();
  const [showNavBar, setShowNavBar] = useState<boolean>(false);

  useEffect(() => {
    if (mainAppStore.isPromoAccount) {
      push(Page.DASHBOARD);
    }
  }, [mainAppStore.isPromoAccount]);
  useEffect(() => {
    if (mainAppStore.activeAccount) {
      setShowNavBar(true);
    }
  }, [mainAppStore.activeAccount]);

  return (
    <FlexContainer
      height="100vh"
      width="100vw"
      position="relative"
      flexDirection="column"
    >
      {showNavBar && <NavBar></NavBar>}
      <FlexContainer
        min-height="calc(100vh - 48px)"
        height="100%"
        flexDirection="column"
      >
        {/* <StepsContainter></StepsContainter> */}
        {children}
      </FlexContainer>
    </FlexContainer>
  );
});
export default KYCcontainer;
