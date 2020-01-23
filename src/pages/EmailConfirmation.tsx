import React from 'react';
import SignFlowLayout from '../components/SignFlowLayout';
import { PrimaryTextParagraph } from '../styles/TextsElements';
import { FlexContainer } from '../styles/FlexContainer';

interface Props {}

function EmailConfirmation(props: Props) {
  const {} = props;

  return (
    <SignFlowLayout>
      <FlexContainer width="100%" flexDirection="column" alignItems="center">
        <PrimaryTextParagraph color="#fffccc" fontSize="24px" fontWeight="bold" marginBottom="20px">
          Thank you!
        </PrimaryTextParagraph>
        <PrimaryTextParagraph color="#fffccc">
          You have successfully verified your email.
        </PrimaryTextParagraph>
      </FlexContainer>
    </SignFlowLayout>
  );
}

export default EmailConfirmation;
