import React, { FC, useEffect, useRef } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { PrimaryButton } from '../styles/Buttons';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import IconClose from '../assets/svg/icon-close.svg';
import { useTranslation } from 'react-i18next';

const Hints = () => {
  const { t } = useTranslation();

  return (
    <FlexContainer
      width="100vw"
      height="100vh"
      position="fixed"
    >
      <FlexContainer
        position="absolute"
        padding="24px 16px 16px"
      >

      </FlexContainer>
    </FlexContainer>
  );
};

export default Hints;
