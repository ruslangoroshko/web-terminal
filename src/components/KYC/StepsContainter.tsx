import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import StepIndicator from './StepIndicator';
import { useStores } from '../../hooks/useStores';
import { KYCstepsEnum } from '../../enums/KYCsteps';

interface Props {}

function StepsContainter(props: Props) {
  const {} = props;
  const { kycStore } = useStores();

  return (
    <FlexContainer
      padding="30px 30px 40px"
      backgroundColor="#212130"
      justifyContent="center"
    >
      <FlexContainer width="560px" justifyContent="space-between">
        <StepIndicator
          currentStep={kycStore.currentStep}
          isFilled={true}
          stepNumber={KYCstepsEnum.PersonalData}
          stepTitle="Personal data"
        ></StepIndicator>
        <StepIndicator
          currentStep={kycStore.currentStep}
          isFilled={false}
          stepNumber={KYCstepsEnum.PhoneVerification}
          stepTitle="Phone verification"
        ></StepIndicator>
        <StepIndicator
          currentStep={kycStore.currentStep}
          isFilled={false}
          stepNumber={KYCstepsEnum.ProofOfIdentity}
          stepTitle="Proof of indentity"
        ></StepIndicator>
      </FlexContainer>
    </FlexContainer>
  );
}

export default StepsContainter;
