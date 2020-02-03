import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import SvgIcon from './SvgIcon';
import IconLoader from '../assets/svg/icon-loader-gray.svg';
import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';

interface Props {
  isLoading: boolean;
}

function Loader(props: Props) {
  const { isLoading } = props;
  return (
    <FixedContainerWrapper
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex="1000"
      backgroundColor="#1C2026"
      justifyContent="center"
      alignItems="center"
      isLoading={isLoading}
    >
      <LoaderWrapper>
        <SvgIcon {...IconLoader} fillColor="none" />
      </LoaderWrapper>
    </FixedContainerWrapper>
  );
}

export default Loader;

const rotateAnimation = keyframes`
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
`;

const fadeIn = keyframes`
    from {
        opacity: 0;
        visibility: visible;
    }

    to {
        opacity: 1;
        visibility: visible;
    }
`;

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

const LoaderWrapper = styled(FlexContainer)`
  animation: ${rotateAnimation} 2s linear infinite;
`;

const FixedContainerWrapper = styled(FlexContainer)<{ isLoading: boolean }>`
  animation: ${props => (props.isLoading ? fadeIn : fadeOut)} 1s forwards;
  visibility: hidden;
`;
