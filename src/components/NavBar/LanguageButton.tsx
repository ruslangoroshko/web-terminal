import React from 'react';
import IconLangEn from '../../assets/svg/icon-navbar-lang-en.svg';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';

interface Props {}

function LanguageButton(props: Props) {
  const {} = props;

  return (
    <ButtonWithoutStyles>
      <SvgIcon {...IconLangEn} />
    </ButtonWithoutStyles>
  );
}

export default LanguageButton;
