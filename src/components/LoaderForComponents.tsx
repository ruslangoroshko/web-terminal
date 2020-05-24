import React, { FC } from 'react';
import { keyframes, css } from '@emotion/core';
import styled from '@emotion/styled';
import LoaderComponent from './LoaderComponent';

interface Props {
  isLoading: boolean;
  withoutBackground?: boolean;
}

const LoaderForComponents: FC<Props> = ({ isLoading, withoutBackground = false }) => (
  <FixedContainerWrapper withoutBackground={withoutBackground} isLoading={isLoading}>
    <LoaderComponent />
  </FixedContainerWrapper>
);

export default LoaderForComponents;

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

const FixedContainerWrapper = styled.div<{ isLoading: boolean, withoutBackground: boolean }>`
  animation: ${props =>
    !props.isLoading &&
    css`
      ${fadeOut} 0.5s linear forwards
    `};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: ${props => props.withoutBackground ? 'rgba(28, 32, 38, 0.8)' : '#1c2026'};
  display: flex;
  justify-content: center;
  align-items: center;
`;
