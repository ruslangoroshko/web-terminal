import React from 'react';
import IconNotifications from '../../assets/svg/icon-navbar-notifications.svg';
import SvgIcon from '../SvgIcon';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';

interface Props {}

function NotificationsButton(props: Props) {
  const {} = props;
  const handleClick = () => {};
  return (
    <ButtonWithoutStyles onClick={handleClick}>
      <SvgIcon {...IconNotifications} fill="#FFFFFF" />
    </ButtonWithoutStyles>
  );
}

export default NotificationsButton;
