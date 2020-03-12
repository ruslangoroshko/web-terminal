import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { keyframes, css } from '@emotion/core';
import styled from '@emotion/styled';
import Modal from './Modal';
import LoaderComponent from './LoaderComponent';

interface Props {
  isLoading: boolean;
}

function LoaderFullscreen(props: Props) {
  const { isLoading } = props;
  return (
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
        >
          <LoaderComponent />
        </FlexContainer>
      </FixedContainerWrapper>
    </Modal>
  );
}

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
