import React, { useState, useEffect } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import DragNDropArea from '../components/KYC/DragNDropArea';
import { PrimaryButton } from '../styles/Buttons';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Axios from 'axios';
import API from '../helpers/API';
import { DocumentTypeEnum } from '../enums/DocumentTypeEnum';
import KeysInApi from '../constants/keysInApi';
import Page from '../constants/Pages';
import { useStores } from '../hooks/useStores';
import { KYCstepsEnum } from '../enums/KYCsteps';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react-lite';
import BadRequestPopup from '../components/BadRequestPopup';
import { getProcessId } from '../helpers/getProcessId';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';

function ProofOfIdentity() {
  const [isSubmiting, setSubmit] = useState(true);
  const { t } = useTranslation();

  const { kycStore, badRequestPopupStore, mainAppStore } = useStores();

  const { push } = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [customPassportId, setCustomPassportId] = useState({
    file: new Blob(),
    fileSrc: '',
  });
  const [customProofOfAddress, setCustomProofOfAddress] = useState({
    file: new Blob(),
    fileSrc: '',
  });

  const [error, setError] = useState({
    passport: false,
    address: false,
  });

  const validateSubmit = () => {
    let errorsFile = {
      address: !customProofOfAddress.file.size,
      passport: !customPassportId.file.size,
    };
    setError(errorsFile);
    return !errorsFile.address && !errorsFile.passport;
  };

  const handleFileReceive = (method: (file: any) => void) => (file: any) => {
    method({
      file,
      fileSrc: URL.createObjectURL(file),
    });
    setError({ address: false, passport: false });
  };

  const postPersonalData = async () => {
    try {
      // const response = await API.getKeyValue(KeysInApi.PERSONAL_DATA);
      // await API.postPersonalData(JSON.parse(response));
      // mixpanel.track(mixpanelEvents.KYC_STEP_2);

      await API.verifyUser(
        { processId: getProcessId() },
        mainAppStore.initModel.authUrl
      );
      mixpanel.track(mixpanelEvents.KYC_STEP_3);

      push(Page.DASHBOARD);
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
    }
  };

  const submitFiles = async () => {
    const validateFile = validateSubmit();
    if (!validateFile) {
      return;
    }

    setSubmit(false);

    // TODO: refactor
    try {
      await Axios.all([
        API.postDocument(
          DocumentTypeEnum.Id,
          customPassportId.file,
          mainAppStore.initModel.authUrl
        ),
        API.postDocument(
          DocumentTypeEnum.ProofOfAddress,
          customProofOfAddress.file,
          mainAppStore.initModel.authUrl
        ),
      ]);
      await postPersonalData();
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
      setSubmit(true);
    }
  };

  const attachLater = () => {
    push(Page.DASHBOARD);
  };

  useEffect(() => {
    kycStore.currentStep = KYCstepsEnum.ProofOfIdentity;
    kycStore.filledStep = KYCstepsEnum.PhoneVerification;
  }, []);

  return (
    <FlexContainer flexDirection="column" height="100%" overflow="auto">
      <FlexContainer
        width="100%"
        flexDirection="column"
        alignItems="center"
        backgroundColor="#252636"
        padding="40px 32px"
        minHeight="900px"
      >
        <Observer>
          {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
        </Observer>
        <FlexContainer
          width="568px"
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
              {t('Proof of indentity')}
            </PrimaryTextParagraph>
            <PrimaryTextSpan
              marginBottom="40px"
              fontSize="14px"
              lineHeight="20px"
              color="rgba(255, 255, 255, 0.4)"
            >
              {t(
                'The documents you sent must be clearly visible. This step is necessary in accordance with the regulatory requirements.'
              )}
            </PrimaryTextSpan>
            <PrimaryTextParagraph
              fontSize="20px"
              fontWeight="bold"
              color="#fffccc"
              marginBottom="6px"
            >
              {t('Passport or ID Card')}
            </PrimaryTextParagraph>
            <PrimaryTextParagraph
              fontSize="14px"
              color="#fffccc"
              marginBottom="16px"
            >
              {t('The document should clearly show')}:
            </PrimaryTextParagraph>
            <PrimaryTextSpan
              marginBottom="32px"
              fontSize="14px"
              lineHeight="20px"
              color="rgba(255, 255, 255, 0.4)"
            >
              {t('Your full name')} / {t('Your photo')} / {t('Date of birth')} /{' '}
              {t('Expiry date')} / {t('Document number')} /{' '}
              {t('Your signature')}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer
            flexDirection="column"
            margin="0 0 64px 0"
            minHeight="120px"
          >
            <DragNDropArea
              hasError={error.passport}
              onFileReceive={handleFileReceive(setCustomPassportId)}
              file={customPassportId.file}
              fileUrl={customPassportId.fileSrc}
            />
          </FlexContainer>

          <FlexContainer flexDirection="column">
            <PrimaryTextParagraph
              fontSize="20px"
              fontWeight="bold"
              color="#fffccc"
              marginBottom="6px"
            >
              {t('Housing and communal services receipt')}
            </PrimaryTextParagraph>
            <PrimaryTextParagraph
              fontSize="14px"
              color="#fffccc"
              marginBottom="16px"
            >
              {t(
                'The Document that should contain the address of your current residence'
              )}
              :
            </PrimaryTextParagraph>
            <PrimaryTextSpan
              marginBottom="32px"
              fontSize="14px"
              lineHeight="20px"
              color="rgba(255, 255, 255, 0.4)"
            >
              {t('Street address')} / {t('City')} / {t('Province')} /{' '}
              {t('State')} / {t('Country')}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer
            flexDirection="column"
            margin="0 0 64px 0"
            minHeight="120px"
          >
            <DragNDropArea
              hasError={error.address}
              onFileReceive={handleFileReceive(setCustomProofOfAddress)}
              file={customProofOfAddress.file}
              fileUrl={customProofOfAddress.fileSrc}
            />
          </FlexContainer>
          <FlexContainer margin="0 0 32px 0" justifyContent="center">
            <PrimaryButton
              onClick={submitFiles}
              padding="8px 32px"
              disabled={!isSubmiting}
            >
              {t('Save and continue')}
            </PrimaryButton>
          </FlexContainer>
          <FlexContainer justifyContent="center">
            <ButtonWithoutStyles onClick={attachLater}>
              <PrimaryTextSpan color="#07FAFF" fontSize="14px">
                {t('Attach documents later')}
              </PrimaryTextSpan>
            </ButtonWithoutStyles>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
}

export default ProofOfIdentity;
