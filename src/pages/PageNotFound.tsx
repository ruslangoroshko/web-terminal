import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import NotFoundImage from '../assets/images/404.png';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { PrimaryButton } from '../styles/Buttons';
import Page from '../constants/Pages';
import { useStores } from '../hooks/useStores';
import { SideBarTabType } from '../enums/SideBarTabType';
import { LOCAL_STORAGE_SIDEBAR } from '../constants/global';

function PageNotFound() {
  const {
    tabsStore,
  } = useStores();
  const { t } = useTranslation();
  const location = useLocation();
  const { push } = useHistory();

  const handleGoHome = () => {
    push(Page.DASHBOARD);
  };

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
      backgroundColor="#252636"
      padding="200px"
      margin="0 auto"
    >
      <FlexContainer marginBottom="48px">
        <img width="276px" height="120px" src={NotFoundImage} />
      </FlexContainer>
      <FlexContainer marginBottom="32px">
        <PrimaryTextSpan
          color="#fff"
          fontWeight="bold"
          fontSize="24px"
          lineHeight="150%"
        >
          {t('Oops.. page not found')}
        </PrimaryTextSpan>
      </FlexContainer>
      {
        !(localStorage.getItem(LOCAL_STORAGE_SIDEBAR) === `${SideBarTabType.Education}`) &&
        <PrimaryButton
          onClick={handleGoHome}
          width="270px"
          padding="12px 0"
        >
          <PrimaryTextSpan
            fontWeight="bold"
            fontSize="16px"
            lineHeight="24px"
            color="#1C1F26"
          >
            {t('Go Home')}
          </PrimaryTextSpan>
        </PrimaryButton>
      }
    </FlexContainer>
  );
}

export default PageNotFound;
