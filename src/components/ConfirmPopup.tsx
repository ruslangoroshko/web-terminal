import React, { FC, useEffect, useRef } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { PrimaryButton } from '../styles/Buttons';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import IconClose from '../assets/svg/icon-close.svg';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/Colors';

interface Props {
  toggle: (arg: boolean) => void;
  applyHandler: () => void;
  confirmText: string;
}

const ConfirmPopup: FC<Props> = ({ toggle, applyHandler, confirmText }) => {
  const handleApply = () => {
    applyHandler();
    toggle(false);
  };
  const { t } = useTranslation();
  const handleClose = () => {
    toggle(false);
  };
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <FlexContainer
      width="300px"
      padding="40px 42px 44px"
      position="relative"
      borderRadius="4px"
      backgroundColor="#1C2026"
      flexDirection="column"
      ref={wrapperRef}
    >
      <FlexContainer position="absolute" right="16px" top="16px">
        <ButtonWithoutStyles onClick={handleClose}>
          <SvgIcon
            {...IconClose}
            fillColor={Colors.WHITE_DARK}
            hoverFillColor={Colors.PRIMARY}
          />
        </ButtonWithoutStyles>
      </FlexContainer>
      <PrimaryTextParagraph
        fontSize="14px"
        color={Colors.ACCENT}
        marginBottom="16px"
        lineHeight="22px"
        textAlign="center"
        width="100%"
      >
        {confirmText}
      </PrimaryTextParagraph>
      <ConfirmButton onClick={handleApply}>
        <PrimaryTextSpan fontWeight="bold" fontSize="14px" color="#003A38">
          {t('Confirm')}
        </PrimaryTextSpan>
      </ConfirmButton>
    </FlexContainer>
  );
};

export default ConfirmPopup;

const ConfirmButton = styled(PrimaryButton)`
  padding: 8px;
  width: 140px;
  margin: auto;
`;
