import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import ButtonAppleStoreImage from '../assets/images/button-apple-store.png';
import ButtonGoogleStoreImage from '../assets/images/button-google-store.png';
import Logo from './Logo';
import { useStores } from '../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { Observer } from 'mobx-react-lite';
import LanguageButton from './NavBar/LanguageButton';
import { brandingLinksTranslate } from '../constants/brandingLinksTranslate';

interface Props {}

const SignFlowLayout: FC<Props> = (props) => {
  const { children } = props;
  const { mainAppStore } = useStores();
  const { t } = useTranslation();

  return (
    <FlexContainer
      backgroundColor="#252636"
      flexDirection="column"
      alignItems="center"
      padding="60px 48px 12px"
      justifyContent="space-between"
      width="100vw"
      height="100vh"
      position="relative"
    >
      <FlexContainer position="absolute" top="16px" right="16px">
        <LanguageButton></LanguageButton>
      </FlexContainer>
      <FlexContainer>
        <FlexContainer alignItems="center">
          <FlexContainer margin="0 6px 0 0" width="154px">
            <Observer>
              {() => <Logo src={mainAppStore.initModel.logo} />}
            </Observer>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer flexDirection="column">{children}</FlexContainer>
      <FlexContainer flexDirection="column" alignItems="center" width="100%">
        <PrimaryTextParagraph
          fontSize="14px"
          fontWeight="bold"
          color="#fffccc"
          marginBottom="20px"
        >
          {t('Download App')}
        </PrimaryTextParagraph>
        <Observer>
          {() => (
            <FlexContainer margin="0 0 30px 0" padding="0 0 0 14px">
              <ButtonAppleStore
                to={{
                  pathname: mainAppStore.initModel.iosAppLink,
                }}
                target="_blank"
              >
                <ButtonImage src={ButtonAppleStoreImage} />
              </ButtonAppleStore>
              <ButtonGoogleStore
                to={{
                  pathname: mainAppStore.initModel.androidAppLink,
                }}
                target="_blank"
              >
                <ButtonImage src={ButtonGoogleStoreImage} />
              </ButtonGoogleStore>
            </FlexContainer>
          )}
        </Observer>
        <FlexContainer justifyContent="space-between" width="100%">
          <FlexContainer>
            <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.4)">
              ©2017–{new Date().getFullYear()}{' '}
              <Observer>
                {() => (
                  <PrimaryTextSpan
                    textTransform="capitalize"
                    fontSize="10px"
                    color="rgba(255, 255, 255, 0.4)"
                  >
                    {mainAppStore.initModel.brandName}
                  </PrimaryTextSpan>
                )}
              </Observer>
              . {t('All rights reserved')}. v {BUILD_VERSION}
            </PrimaryTextSpan>
          </FlexContainer>

          <Observer>
            {() => (
              <FlexContainer>
                <LinkItem
                  href={mainAppStore.initModel.supportUrl}
                  target="_blank"
                >
                  {t('Support')}
                </LinkItem>
                <LinkItem href={t(`${brandingLinksTranslate[mainAppStore.initModel.brandProperty].faq}`)} target="_blank">
                  {t('FAQ')}
                </LinkItem>
                <LinkItem
                  href={mainAppStore.initModel.aboutUrl}
                  target="_blank"
                >
                  {t('About us')}
                </LinkItem>
              </FlexContainer>
            )}
          </Observer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default SignFlowLayout;

const ButtonAppleStore = styled(Link)`
  width: 120px;
  margin-right: 24px;
`;

const ButtonGoogleStore = styled(Link)`
  width: 134px;
`;

const ButtonImage = styled.img`
  width: 100%;
  overflow: hidden;
  border: 1px solid #a6a6a6;
  border-radius: 10px;
`;

const LinkItem = styled.a`
  margin-right: 24px;
  text-decoration: none;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  :last-of-type {
    margin-right: 0;
  }
  :hover {
    color: #00ffdd;
  }
`;
