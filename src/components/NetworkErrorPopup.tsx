import React, { useEffect, useState, useCallback } from 'react';
import Modal from './Modal';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import { useStores } from '../hooks/useStores';
import { Observer } from 'mobx-react-lite';

const NetworkErrorPopup = () => {
  const { badRequestPopupStore } = useStores();
  const [show, setShow] = useState(false);
  const [shouldRender, setRender] = useState(false);

  const handleLostConnection = () => {
    badRequestPopupStore.setNetwork(true);
    badRequestPopupStore.initConectionReload();
    setShow(true);
  };

  const handleSetConnection = useCallback(
    () => {
      badRequestPopupStore.setNetwork(false);
      setShow(false);
      badRequestPopupStore.isReload && window.location.reload();
    }, [badRequestPopupStore.isReload]
  );

  useEffect(() => {
    setTimeout(() => {
      setRender(show);
    }, 500);
  }, [show]);

  useEffect(() => {
    window.addEventListener('offline', handleLostConnection);
    window.addEventListener('online', handleSetConnection);

    return () => {
      window.removeEventListener('offline', handleLostConnection);
      window.removeEventListener('online', handleSetConnection);
    }
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <Modal>
      <ModalWrap show={show}>
        <PrimaryTextParagraph color="#ffffff" textAlign="center">
          There is no Internet connection.
        </PrimaryTextParagraph>
        <PrimaryTextParagraph
          fontSize="12px"
          textAlign="center"
          color="rgba(255, 255, 255, 0.4)"
        >
          Please make sure you are connected to the Internet.
        </PrimaryTextParagraph>

        <Observer>
          {() => (
            <>
              {badRequestPopupStore.isRecconect && (
                <PrimaryTextParagraph
                  fontSize="12px"
                  textAlign="center"
                  color="rgba(255, 255, 255, 0.4)"
                >
                  <br/>Reconnecting...
                </PrimaryTextParagraph>
              )}
            </>
          )}
        </Observer>
      </ModalWrap>
    </Modal>
  );
};

export default NetworkErrorPopup;

const translateAnimationIn = keyframes`
    from {
      transform: translateY(1000px);
    }
    to {
      transform: translateY(0);
    }
`;
const translateAnimationOut = keyframes`
    from {
        transform: translateY(0);
    }
    to {
      transform: translateY(1000px);
    }
`;

const ModalWrap = styled(FlexContainer)<{ show: boolean }>`
  position: absolute;
  left: 100px;
  bottom: 40px;
  z-index: 9999;
  background-color: #fff;
  min-height: 150px;
  width: 400px;
  color: #fff;
  padding: 30px;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(12px);
  }
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  animation: ${props =>
      props.show ? translateAnimationIn : translateAnimationOut}
    0.5s ease;
`;
