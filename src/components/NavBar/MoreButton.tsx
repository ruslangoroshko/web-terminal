import React from 'react';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconMore from '../../assets/svg/icon-navbar-more.svg';

interface Props {}

function MoreButton(props: Props) {
  const {} = props;

  return (
    <ButtonWithoutStyles>
      <SvgIcon {...IconMore} fill="#C4C4C4"></SvgIcon>
    </ButtonWithoutStyles>
  );
}

export default MoreButton;
