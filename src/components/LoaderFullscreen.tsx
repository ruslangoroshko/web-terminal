import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { keyframes, css } from '@emotion/core';
import styled from '@emotion/styled';
import Modal from './Modal';
import LoaderComponent from './LoaderComponent';
import SvgIcon from './SvgIcon';
import MonfexLogo from '../assets/svg/icon-logo.svg';
import MonfexLogoText from '../assets/svg/icon-logo-text.svg';

interface Props {
  isLoading: boolean;
}

const LoaderFullscreen: FC<Props> = ({ isLoading }) => (
  <Modal>
    <FixedContainerWrapper isLoading={isLoading}>
      <FlexContainer
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex="1000"
        backgroundColor="#1C2026"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <FlexContainer
          alignItems="center"
          justifyContent="center"
          marginBottom="32px"
        >
          <FlexContainer margin="0 6px 0 0">
            <SvgIcon
              {...MonfexLogo}
              fillColor="#00FFDD"
              width={52}
              height={33}
            />
          </FlexContainer>
          <SvgIcon
            {...MonfexLogoText}
            fillColor="#21B3A4"
            width={162}
            height={33}
          />
        </FlexContainer>
        <FlexContainer alignItems="center">
          <LoaderComponent />
          <TextLoader>Loading</TextLoader>
        </FlexContainer>
      </FlexContainer>
    </FixedContainerWrapper>
  </Modal>
);

export default LoaderFullscreen;

const fadeOut = keyframes`
    0 {
        opacity: 1;
        visibility: visible;
    }

    99% {
        opacity: 0;
        visibility: visible;
    }

    100% {
        opacity: 0;
        visibility: hidden;
    }
`;

const FixedContainerWrapper = styled.div<{ isLoading: boolean }>`
  animation: ${props =>
    !props.isLoading &&
    css`
      ${fadeOut} 0.5s linear forwards
    `};
`;

const TextLoader = styled.span`
  color: rgba(255, 255, 255, 0.4);
  margin-left: 16px;
  font-weight: normal;
  font-size: 12px;
`;
