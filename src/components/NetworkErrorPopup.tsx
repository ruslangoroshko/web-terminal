import React, { useEffect, useState, useCallback } from 'react';
import Modal from './Modal';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import { useStores } from '../hooks/useStores';
import { observer, Observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

const NetworkErrorPopup = observer(() => {
  const { badRequestPopupStore, mainAppStore } = useStores();
  const [show, setShow] = useState(false);
  const [shouldRender, setRender] = useState(false);

  const { t } = useTranslation();

  const handleLostConnection = () => {
    badRequestPopupStore.setRecconect();
    badRequestPopupStore.setNetwork(true);
    badRequestPopupStore.initConectionReload();
    setShow(true);
  };

  const handleSetConnection = () => {
    // TODO: Find out how to make reload using React-Router
    badRequestPopupStore.stopRecconect();
    window.location.reload();
  };

  const handleVisibilityChange = () => {
    if (!document.hidden && mainAppStore.socketError) {
      window.location.reload();
    }
  };

  useEffect(() => {
    setShow(badRequestPopupStore.isRecconect);
    setTimeout(() => {
      setRender(badRequestPopupStore.isRecconect);
    }, 500);
  }, [badRequestPopupStore.isRecconect]);

  useEffect(() => {
    window.addEventListener('offline', handleLostConnection);
    window.addEventListener('online', handleSetConnection);
    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
      false
    );

    return () => {
      window.removeEventListener('offline', handleLostConnection);
      window.removeEventListener('online', handleSetConnection);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <Modal>
      <ModalWrap show={show}>
        <PrimaryTextParagraph color="#ffffff" textAlign="center">
          {badRequestPopupStore.isRecconect && badRequestPopupStore.isNetwork
            ? t('There is no Internet connection.')
            : t('Oooopsss')}
        </PrimaryTextParagraph>
        <PrimaryTextParagraph
          fontSize="12px"
          textAlign="center"
          color="rgba(255, 255, 255, 0.4)"
        >
          {badRequestPopupStore.isRecconect && badRequestPopupStore.isNetwork
            ? t('Please make sure you are connected to the Internet.')
            : t('We are trying to connect to the server')}
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
                  <br />
                  {t('Reconnecting...')}
                </PrimaryTextParagraph>
              )}
            </>
          )}
        </Observer>
      </ModalWrap>
    </Modal>
  );
});

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
  animation: ${(props) =>
      props.show ? translateAnimationIn : translateAnimationOut}
    0.5s ease;
`;
