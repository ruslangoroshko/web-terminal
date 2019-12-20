import React from 'react';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconSwitchTheme from '../../assets/svg/icon-navbar-switch-theme.svg';

interface Props {}

function SwitchThemeButton(props: Props) {
  const {} = props;
  const handleClick = () => {};
  return (
    <ButtonWithoutStyles onClick={handleClick}>
      <SvgIcon {...IconSwitchTheme} fill="#FFFFFF" />
    </ButtonWithoutStyles>
  );
}

export default SwitchThemeButton;
