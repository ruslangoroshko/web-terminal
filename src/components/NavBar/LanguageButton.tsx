import React from 'react';
import IconLangEn from '../../assets/images/lang-en.png';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';

interface Props {}

function LanguageButton(props: Props) {
  const {} = props;

  return (
    <ButtonWithoutStyles>
      <Img src={IconLangEn} />
    </ButtonWithoutStyles>
  );
}

export default LanguageButton;

const Img = styled.img`
  border-radius: 50%;
`;
