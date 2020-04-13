import React, { FC, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import ButtonAppleStoreImage from '../assets/images/button-apple-store.png';
import ButtonGoogleStoreImage from '../assets/images/button-google-store.png';
import SvgIcon from './SvgIcon';
import MonfexLogo from '../assets/svg/icon-logo.svg';
import MonfexLogoText from '../assets/svg/icon-logo-text.svg';

import Pages from "../constants/Pages"

interface Props {}

const SignFlowLayout: FC<Props> = props => {
  const { children } = props;

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
      <FlexContainer>
        <FlexContainer alignItems="center">
          <FlexContainer margin="0 6px 0 0">
            <SvgIcon
              {...MonfexLogo}
              fillColor="#00FFDD"
              width={36}
              height={22}
            />
          </FlexContainer>
          <SvgIcon
            {...MonfexLogoText}
            fillColor="#21B3A4"
            width={112}
            height={22}
          />
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
          Download App
        </PrimaryTextParagraph>
        <FlexContainer margin="0 0 30px 0" padding="0 0 0 14px">
          <ButtonAppleStore>
            <ButtonImage src={ButtonAppleStoreImage} />
          </ButtonAppleStore>
          <ButtonGoogleStore>
            <ButtonImage src={ButtonGoogleStoreImage} />
          </ButtonGoogleStore>
        </FlexContainer>
        <FlexContainer justifyContent="space-between" width="100%">
          <FlexContainer>
            <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.4)">
              ©2017–{new Date().getFullYear()} Monfex. All rights reserved.
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer>
            <LinkItem to={Pages.SUPPORT} target={"_blank"}>
              Support
            </LinkItem>
            <LinkItem to={Pages.FAQ} target={"_blank"}>
              FAQ
            </LinkItem>
            <LinkItem to={Pages.ABOUT_US} target={"_blank"}>
              About us
            </LinkItem>
          </FlexContainer>

        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default SignFlowLayout;

const ButtonAppleStore = styled(ButtonWithoutStyles)`
  width: 120px;
  margin-right: 24px;
`;

const ButtonGoogleStore = styled(ButtonWithoutStyles)`
  width: 134px;
`;

const ButtonImage = styled.img`
  width: 100%;
  overflow: hidden;
  border: 1px solid #a6a6a6;
  border-radius: 10px;
`;

const LinkItem = styled(Link)`
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
