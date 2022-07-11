import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { KYCstepsEnum } from '../../enums/KYCsteps';
import { observer } from 'mobx-react-lite';
import SvgIcon from '../SvgIcon';
import IconDone from '../../assets/svg/icon-kyc-done.svg';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';

interface Props {
  stepNumber: number;
  stepTitle: string;
  isFilled: boolean;
  currentStep: KYCstepsEnum;
}

const StepIndicator: FC<Props> = observer(props => {
  const { stepNumber, stepTitle, isFilled, currentStep } = props;
  const isMoreThanOrCurrentStep = currentStep >= stepNumber;
  const { t } = useTranslation();

  return (
    <FlexContainer
      flexDirection="column"
      alignItems="center"
      zIndex={`${100 - stepNumber}`}
    >
      <FlexContainer
        borderRadius="50%"
        width="48px"
        minHeight="48px"
        backgroundColor={
          isMoreThanOrCurrentStep ? '#005E5E' : 'rgba(255, 255, 255, 0.06)'
        }
        border={
          isMoreThanOrCurrentStep
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
            backgroundColor={isMoreThanOrCurrentStep ? '#005E5E' : '#3F4343'}
          ></FlexContainer>
        )}
        {isFilled ? (
          <SvgIcon {...IconDone} fillColor="none" />
        ) : (
          <PrimaryTextSpan fontSize="24px" color={Colors.ACCENT}>
            {stepNumber}
          </PrimaryTextSpan>
        )}
      </FlexContainer>
      <PrimaryTextSpan
        fontSize="14px"
        color={Colors.ACCENT}
        marginBottom="4px"
        textTransform="capitalize"
      >
        {stepTitle}
      </PrimaryTextSpan>
      <PrimaryTextSpan
        color={isFilled ? '#008284' : Colors.WHITE_LIGHT}
      >
        {isFilled ? t('Done') : t('Not filled')}
      </PrimaryTextSpan>
    </FlexContainer>
  );
});

export default StepIndicator;
