import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph } from '../styles/TextsElements';
import Page from '../constants/Pages';
import { useStores } from '../hooks/useStores';
import { KYCPageStepsEnum, KYCstepsEnum } from '../enums/KYCsteps';
import { useHistory } from 'react-router-dom';
import { observer, Observer } from 'mobx-react-lite';
import BadRequestPopup from '../components/BadRequestPopup';
import { useTranslation } from 'react-i18next';
import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';
import LoaderForComponents from '../components/LoaderForComponents';
import KYCMain from '../components/KYC/KYCMain';
import KYCId from '../components/KYC/KYCId';
import KYCBankCard from '../components/KYC/KYCBankCard';
import KYCOther from '../components/KYC/KYCOther';
import KYCAddress from '../components/KYC/KYCAddress';
import Colors from '../constants/Colors';

const ProofOfIdentity = observer(() => {
  const [isSubmiting, setSubmit] = useState(true);
  const { t } = useTranslation();

  const {
    kycStore,
    badRequestPopupStore,
    mainAppStore,
    notificationStore,
  } = useStores();

  const { push } = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  const tabByStep = () => {
    switch (kycStore.actualPageStep) {
      case KYCPageStepsEnum.Main:
        return <KYCMain />;
      case KYCPageStepsEnum.Identity:
        return <KYCId />;
      case KYCPageStepsEnum.Address:
        return <KYCAddress />;
      case KYCPageStepsEnum.BankCard:
        return <KYCBankCard />;
      case KYCPageStepsEnum.Additional:
        return <KYCOther />;
      default:
        return null;
    }
  };

  useEffect(() => {
    kycStore.setCurrentPageStep(KYCPageStepsEnum.Main);
    kycStore.setCurrentStep(KYCstepsEnum.ProofOfIdentity);
    kycStore.setFilledStep(KYCstepsEnum.PhoneVerification);
  }, []);

  useEffect(() => {
    let cleanupFunction = false;
    if (
      mainAppStore.profileStatus !== PersonalDataKYCEnum.NotVerified &&
      mainAppStore.profileStatus !== PersonalDataKYCEnum.Restricted
    ) {
      push(Page.DASHBOARD);
    } else {
      setTimeout(() => {
        if (!cleanupFunction) {
          setIsLoading(false);
        }
      }, 1000);
    }
    return () => {
      cleanupFunction = true;
    };
  }, [mainAppStore.profileStatus]);

  return (
    <FlexContainer flexDirection="column" height="100%" overflow="auto">
      <LoaderForComponents isLoading={isLoading} />
      {!isLoading && (
        <FlexContainer
          width="100%"
          height="100%"
          flexDirection="column"
          alignItems="center"
          backgroundColor={Colors.DARK_BLACK}
          padding="40px 32px"
        >
          <Observer>
            {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
          </Observer>
          <FlexContainer
            width="708px"
            flexDirection="column"
            padding="20px 0 0 0"
            height="100%"
          >
            <FlexContainer flexDirection="column">
              <PrimaryTextParagraph
                fontSize="30px"
                fontWeight="bold"
                color={Colors.ACCENT}
                marginBottom="48px"
              >
                {t('Account verification')}
              </PrimaryTextParagraph>
            </FlexContainer>
            {tabByStep()}
          </FlexContainer>
        </FlexContainer>
      )}
    </FlexContainer>
  );
});

export default ProofOfIdentity;
