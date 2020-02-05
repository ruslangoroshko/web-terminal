import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { KYCstepsEnum } from '../../enums/KYCsteps';
import { observer } from 'mobx-react-lite';
import SvgIcon from '../SvgIcon';
import IconDone from '../../assets/svg/icon-kyc-done.svg';

interface Props {
  stepNumber: number;
  stepTitle: string;
  isFilled: boolean;
  currentStep: KYCstepsEnum;
}

const StepIndicator: FC<Props> = observer(props => {
  const { stepNumber, stepTitle, isFilled, currentStep } = props;

  return (
    <FlexContainer flexDirection="column" alignItems="center" zIndex="1">
      <FlexContainer
        borderRadius="50%"
        width="48px"
        height="48px"
        backgroundColor={
          currentStep >= stepNumber ? '#005E5E' : 'rgba(255, 255, 255, 0.06)'
        }
        border={
          currentStep >= stepNumber
            ? 'none'
            : '1px solid rgba(255, 255, 255, 0.1)'
        }
        justifyContent="center"
        alignItems="center"
        margin="0 0 10px 0"
        position="relative"
        zIndex="0"
      >
        {stepNumber !== KYCstepsEnum.PersonalData && (
          <FlexContainer
            position="absolute"
            width="188px"
            height="2px"
            zIndex="-1"
            top="50%"
            right="100%"
            backgroundColor={currentStep >= stepNumber ? '#005E5E' : '#3F4343'}
          ></FlexContainer>
        )}
        {isFilled ? (
          <SvgIcon {...IconDone} fillColor="#ffccc" />
        ) : (
          <PrimaryTextSpan fontSize="24px" color="#fffccc">
            {stepNumber}
          </PrimaryTextSpan>
        )}
      </FlexContainer>
      <PrimaryTextSpan
        fontSize="14px"
        color="#fffccc"
        marginBottom="4px"
        textTransform="capitalize"
      >
        {stepTitle}
      </PrimaryTextSpan>
      <PrimaryTextSpan
        color={isFilled ? '#008284' : 'rgba(255, 255, 255, 0.4)'}
      >
        {isFilled ? 'Done' : 'Not filled'}
      </PrimaryTextSpan>
    </FlexContainer>
  );
});

export default StepIndicator;
