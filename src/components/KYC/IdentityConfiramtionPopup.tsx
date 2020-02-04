import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconClose from '../../assets/svg/icon-close.svg';
import IdentityConfirmationImage from '../../assets/image/kyc-identity-confirmation.png';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import { PrimaryButton } from '../../styles/Buttons';

interface Props {}

function IdentityConfiramtionPopup(props: Props) {
  const {} = props;

  const handleClickClose = () => {};

  const handleClickStart = () => {};

  return (
    <FlexContainer
      backgroundColor="rgba(0, 0, 0, 0.4)"
      boxShadow="0px 12px 24px rgba(0, 0, 0, 0.25), 0px 6px 12px rgba(0, 0, 0, 0.25)"
      borderRadius="4px"
      flexDirection="column"
      padding="68px 76px 40px"
      position="relative"
    >
      <FlexContainer position="absolute" top="12px" right="12px">
        <ButtonWithoutStyles onClick={handleClickClose}>
          <SvgIcon {...IconClose} fillColor="rgba(255, 255, 255, 0.6)" />
        </ButtonWithoutStyles>
      </FlexContainer>
      <FlexContainer>
        <img src={IdentityConfirmationImage} />
      </FlexContainer>
      <PrimaryTextParagraph fontSize="20px" marginBottom="10px" color="#fffccc">
        Identity Confirmation
      </PrimaryTextParagraph>
      <PrimaryTextParagraph fontSize="11px" color="#fffccc" marginBottom="18px">
        In accordance with the KYC and AML Policy, you are required to pass the
        <br />
        verification process. This is necessary to ensure the safety of your
        funds, as
        <br />
        well as to speed up withdrawals.
      </PrimaryTextParagraph>
      <PrimaryButton width="200px" padding="12px" onClick={handleClickStart}>
        <PrimaryTextSpan color="#003A38">Start</PrimaryTextSpan>
      </PrimaryButton>
    </FlexContainer>
  );
}

export default IdentityConfiramtionPopup;
