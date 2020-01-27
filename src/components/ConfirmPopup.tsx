import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { PrimaryButton } from '../styles/Buttons';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import IconClose from '../assets/svg/icon-close.svg';

interface Props {
  toggle: () => void;
  applyHandler: () => void;
}

const ConfirmPopup: FC<Props> = ({ toggle, applyHandler }) => {
  const handleApply = () => {
    applyHandler();
    toggle();
  };
  return (
    <FlexContainer
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      backgroundColor="rgba(255,255,255,0.5)"
      alignItems="center"
      justifyContent="center"
      zIndex="300"
    >
      <FlexContainer
        width="300px"
        padding="40px 80px 44px"
        position="relative"
        borderRadius="4px"
        backgroundColor="#1C2026"
        flexDirection="column"
      >
        <FlexContainer position="absolute" right="16px" top="16px">
          <ButtonWithoutStyles onClick={toggle}>
            <SvgIcon {...IconClose} fillColor="rgba(255, 255, 255, 0.6)" />
          </ButtonWithoutStyles>
        </FlexContainer>
        <PrimaryTextParagraph
          fontWeight="bold"
          color="#fffccc"
          marginBottom="16px"
          textAlign="center"
        >
          Close Position?
        </PrimaryTextParagraph>
        <ConfirmButton onClick={handleApply}>
          <PrimaryTextSpan fontWeight="bold" fontSize="14px" color="#003A38">
            Confirm
          </PrimaryTextSpan>
        </ConfirmButton>
      </FlexContainer>
    </FlexContainer>
  );
};

export default ConfirmPopup;

const ConfirmButton = styled(PrimaryButton)`
  padding: 8px;
`;
