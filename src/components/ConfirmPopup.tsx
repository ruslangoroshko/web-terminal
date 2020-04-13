import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { PrimaryButton } from '../styles/Buttons';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import IconClose from '../assets/svg/icon-close.svg';

interface Props {
  toggle: (arg: boolean) => void;
  applyHandler: () => void;
  confirmText: string;
}

const ConfirmPopup: FC<Props> = ({ toggle, applyHandler,confirmText }) => {
  const handleApply = () => {
    applyHandler();
    toggle(false);
  };

  const handleClose = () => {
    toggle(false);
  };
  return (
    <FlexContainer
      width="300px"
      padding="40px 80px 44px"
      position="relative"
      borderRadius="4px"
      backgroundColor="#1C2026"
      flexDirection="column"
    >
      <FlexContainer position="absolute" right="16px" top="16px">
        <ButtonWithoutStyles onClick={handleClose}>
          <SvgIcon
            {...IconClose}
            fillColor="rgba(255, 255, 255, 0.6)"
            hoverFillColor="#00FFDD"
          />
        </ButtonWithoutStyles>
      </FlexContainer>
      <PrimaryTextParagraph
        fontWeight="bold"
        color="#fffccc"
        marginBottom="16px"
        textAlign="center"
      >
        {confirmText}
      </PrimaryTextParagraph>
      <ConfirmButton onClick={handleApply}>
        <PrimaryTextSpan fontWeight="bold" fontSize="14px" color="#003A38">
          Confirm
        </PrimaryTextSpan>
      </ConfirmButton>
    </FlexContainer>
  );
};

export default ConfirmPopup;

const ConfirmButton = styled(PrimaryButton)`
  padding: 8px;
`;
