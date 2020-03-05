import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import SvgIcon from './SvgIcon';
import IconLoader from '../assets/svg/icon-loader-gray.svg';
import { keyframes, css } from '@emotion/core';
import styled from '@emotion/styled';
import Modal from './Modal';

interface Props {
  isLoading: boolean;
}

function Loader(props: Props) {
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
          <LoaderWrapper>
            <SvgIcon {...IconLoader} />
          </LoaderWrapper>
        </FlexContainer>
      </FixedContainerWrapper>
    </Modal>
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

const FixedContainerWrapper = styled.div<{ isLoading: boolean }>`
  animation: ${props =>
    !props.isLoading &&
    css`
      ${fadeOut} 0.5s linear forwards
    `};
`;

const SpinnerWrapper = styled.div`
  display: flex;
  position: relative;

  background: white;
  border-radius: 50%;
  height: 200px;
  width: 200px;
  position: relative;

  animation: ${rotateAnimation} 2s linear infinite;
  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
  }

  &:before {
    border-radius: 50%;
    background: linear-gradient(
          0deg,
          hsla(0, 0%, 100%, 1) 50%,
          hsla(0, 0%, 100%, 0.9) 100%
        )
        0% 0%,
      linear-gradient(
          90deg,
          hsla(0, 0%, 100%, 0.9) 0%,
          hsla(0, 0%, 100%, 0.6) 100%
        )
        100% 0%,
      linear-gradient(
          180deg,
          hsla(0, 0%, 100%, 0.6) 0%,
          hsla(0, 0%, 100%, 0.3) 100%
        )
        100% 100%,
      linear-gradient(
          360deg,
          hsla(0, 0%, 100%, 0.3) 0%,
          hsla(0, 0%, 100%, 0) 100%
        )
        0% 100%;
    background-repeat: no-repeat;
    background-size: 50% 50%;
    top: -1px;
    bottom: -1px;
    left: -1px;
    right: -1px;
  }
  &:after {
    background: #1c2026;
    border-radius: 50%;
    top: 3%;
    bottom: 3%;
    left: 3%;
    right: 3%;
  }
`;
