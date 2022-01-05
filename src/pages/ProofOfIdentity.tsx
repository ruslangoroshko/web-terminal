import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import DragNDropArea from '../components/KYC/DragNDropArea';
import { PrimaryButton } from '../styles/Buttons';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Axios from 'axios';
import API from '../helpers/API';
import { DocumentTypeEnum } from '../enums/DocumentTypeEnum';
import Page from '../constants/Pages';
import { useStores } from '../hooks/useStores';
import { KYCPageStepsEnum, KYCstepsEnum } from '../enums/KYCsteps';
import { useHistory } from 'react-router-dom';
import { observer, Observer } from 'mobx-react-lite';
import BadRequestPopup from '../components/BadRequestPopup';
import { getProcessId } from '../helpers/getProcessId';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';
import LoaderForComponents from '../components/LoaderForComponents';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';

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
  const [actualStep, setActualStep] = useState<KYCPageStepsEnum>(0);

  //
  // const validateSubmit = () => {
  //   let errorsFile = {
  //     address: !customProofOfAddress.file.size,
  //     passport: !customPassportId.file.size,
  //   };
  //   setError(errorsFile);
  //   return !errorsFile.address && !errorsFile.passport;
  // };


  // const postPersonalData = async () => {
  //   try {
  //     // const response = await API.getKeyValue(KeysInApi.PERSONAL_DATA);
  //     // await API.postPersonalData(JSON.parse(response));
  //     // mixpanel.track(mixpanelEvents.KYC_STEP_2);
  //
  //     await API.verifyUser(
  //       { processId: getProcessId() },
  //       mainAppStore.initModel.authUrl
  //     );
  //     mixpanel.track(mixpanelEvents.KYC_STEP_3);
  //
  //     push(Page.DASHBOARD);
  //   } catch (error) {}
  // };

  // const submitFiles = async () => {
  //   const validateFile = validateSubmit();
  //   if (!validateFile) {
  //     return;
  //   }
  //
  //   setSubmit(false);
  //
  //   // TODO: refactor
  //   try {
  //     const response: any = await Axios.all([
  //       API.postDocument(
  //         DocumentTypeEnum.Id,
  //         customPassportId.file,
  //         mainAppStore.initModel.authUrl
  //       ),
  //       API.postDocument(
  //         DocumentTypeEnum.ProofOfAddress,
  //         customProofOfAddress.file,
  //         mainAppStore.initModel.authUrl
  //       ),
  //       API.postDocument(
  //         DocumentTypeEnum.BackCard,
  //         customProofOfAddress.file,
  //         mainAppStore.initModel.authUrl
  //       ),
  //       API.postDocument(
  //         DocumentTypeEnum.FrontCard,
  //         customProofOfAddress.file,
  //         mainAppStore.initModel.authUrl
  //       ),
  //       API.postDocument(
  //         DocumentTypeEnum.DepositLetter,
  //         customProofOfAddress.file,
  //         mainAppStore.initModel.authUrl
  //       ),
  //       API.postDocument(
  //         DocumentTypeEnum.DriverLicenceFront,
  //         customProofOfAddress.file,
  //         mainAppStore.initModel.authUrl
  //       ),
  //       API.postDocument(
  //         DocumentTypeEnum.DriverLicenceBack,
  //         customProofOfAddress.file,
  //         mainAppStore.initModel.authUrl
  //       ),
  //       API.postDocument(
  //         DocumentTypeEnum.BankCardFront,
  //         customProofOfAddress.file,
  //         mainAppStore.initModel.authUrl
  //       ),
  //       API.postDocument(
  //         DocumentTypeEnum.BankCardBack,
  //         customProofOfAddress.file,
  //         mainAppStore.initModel.authUrl
  //       ),
  //       API.postDocument(
  //         DocumentTypeEnum.ProofOfPayment,
  //         customProofOfAddress.file,
  //         mainAppStore.initModel.authUrl
  //       ),
  //       API.postDocument(
  //         DocumentTypeEnum.ProofOfWireTransfer,
  //         customProofOfAddress.file,
  //         mainAppStore.initModel.authUrl
  //       ),
  //       API.postDocument(
  //         DocumentTypeEnum.CardAuthorizationForm,
  //         customProofOfAddress.file,
  //         mainAppStore.initModel.authUrl
  //       ),
  //     ]);
  //
  //     const fileWrongExtension = response.some(
  //       (res: any) =>
  //         res.result === OperationApiResponseCodes.FileWrongExtension
  //     );
  //
  //     if (fileWrongExtension) {
  //       notificationStore.setNotification(
  //         t(
  //           apiResponseCodeMessages[
  //             OperationApiResponseCodes.FileWrongExtension
  //           ]
  //         )
  //       );
  //       notificationStore.setIsSuccessfull(false);
  //       notificationStore.openNotification();
  //       setSubmit(true);
  //       return;
  //     }
  //
  //     await postPersonalData();
  //   } catch (error) {
  //     setSubmit(true);
  //   }
  // };

  // const attachLater = () => {
  //   push(Page.DASHBOARD);
  // };

  useEffect(() => {

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
          flexDirection="column"
          alignItems="center"
          backgroundColor="#252636"
          padding="40px 32px"
          minHeight="950px"
        >
          <Observer>
            {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
          </Observer>
          <FlexContainer
            width="708px"
            flexDirection="column"
            padding="20px 0 0 0"
          >
            <FlexContainer flexDirection="column">
              <PrimaryTextParagraph
                fontSize="30px"
                fontWeight="bold"
                color="#fffccc"
                marginBottom="8px"
              >
                {t('Account verification')}
              </PrimaryTextParagraph>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      )}
    </FlexContainer>
  );
});

export default ProofOfIdentity;
