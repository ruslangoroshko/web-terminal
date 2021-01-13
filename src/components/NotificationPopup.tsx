import React, { useEffect, FC, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import IconClose from '../assets/svg/icon-close.svg';
import { keyframes } from '@emotion/core';
import { useStores } from '../hooks/useStores';
import { observer } from 'mobx-react-lite';
import testIds from '../constants/testIds';

interface Props {
  show: boolean;
}

const NotificationPopup: FC<Props> = observer(({ show }) => {
  const { notificationStore } = useStores();

  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) {
      setRender(true);
    }
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) {
      setRender(false);
    }
  };

  const closeNotification = () => {
    if (notificationStore.timer) {
      clearTimeout(notificationStore.timer);
    }
    notificationStore.closeNotification();
  };

  useEffect(() => {
    if (notificationStore.isActiveNotification) {
      if (notificationStore.timer) {
        clearTimeout(notificationStore.timer);
      }
      notificationStore.timer = setTimeout(() => {
        notificationStore.closeNotification();
      }, 5000);
    }
    return;
  }, [notificationStore.isActiveNotification]);

  useEffect(() => {
    return () => {
      notificationStore.resetNotification();
    };
  }, []);

  return shouldRender ? (
    <NotificationWrapper
      backgroundColor="#1c2026"
      boxShadow="0px 4px 8px rgba(41, 42, 57, 0.09), 0px 8px 16px rgba(37, 38, 54, 0.24)"
      borderRadius="4px"
      isSuccessfull={notificationStore.isSuccessfull}
      alignItems="center"
      padding="12px 12px 12px 18px"
      justifyContent="space-between"
      position="relative"
      show={show}
      margin={notificationStore.isActiveNotificationGlobal ? '0 0 0 60px' : '0'}
      onAnimationEnd={onAnimationEnd}
    >
      <PrimaryTextSpan
        color={notificationStore.isSuccessfull ? '#00FFDD' : '#ED145B'}
        fontSize="12px"
        marginRight="20px"
        data-testid={testIds.NOTIFICATION_POPUP_MESSAGE}
      >
        {notificationStore.notificationMessage}
      </PrimaryTextSpan>
      <ButtonWithoutStyles onClick={closeNotification}>
        <SvgIcon
          {...IconClose}
          fillColor="rgba(255, 255, 255, 0.6)"
          hoverFillColor="#00FFDD"
        />
      </ButtonWithoutStyles>
    </NotificationWrapper>
  ) : null;
});

export default NotificationPopup;

const translateAnimationIn = keyframes`
    from {
      transform: translateX(-1000px);
    }

    to {
      transform: translateX(0);
    }
`;

const translateAnimationOut = keyframes`
    from {
        transform: translateX(0);
    }

    to {
      transform: translateX(-1000px);
    }
`;

const NotificationWrapper = styled(FlexContainer)<{
  isSuccessfull: boolean;
  show: boolean;
}>`
  border-left: 2px solid
    ${(props) => (props.isSuccessfull ? '#00FFDD' : '#ED145B')};
  min-width: 250px;
  animation: ${(props) =>
      props.show ? translateAnimationIn : translateAnimationOut}
    0.5s ease;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 40px;
    background: ${(props) =>
      props.isSuccessfull
        ? `linear-gradient(90deg, rgba(0, 255, 221, 0.08) 0%, rgba(0, 255, 221, 0) 100%)`
        : `linear-gradient(90deg, rgba(237, 20, 91, 0.08) 0%, rgba(237, 20, 91, 0) 100%)`};
  }
`;
