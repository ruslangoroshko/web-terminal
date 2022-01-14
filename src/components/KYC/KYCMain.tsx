import React, { useMemo, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { KYCTypesMain } from '../../constants/KYCConstants';
import TypeOfDocument from './TypeOfDocument';
import { PrimaryButton } from '../../styles/Buttons';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import { DocumentTypeEnum } from '../../enums/DocumentTypeEnum';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import Page from '../../constants/Pages';
import { useHistory } from 'react-router-dom';
import { PersonalDataKYCEnum } from '../../enums/PersonalDataKYCEnum';
import API from '../../helpers/API';
import { getProcessId } from '../../helpers/getProcessId';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import apiResponseCodeMessages from '../../constants/apiResponseCodeMessages';
import { OperationApiResponseCodes } from '../../enums/OperationApiResponseCodes';
import Axios from 'axios';
import { observer } from 'mobx-react-lite';
import PreloaderButtonMask from './PreloaderButtonMask';

const KYCMain = observer(() => {
  const { t } = useTranslation();
  const {
    kycStore,
    mainAppStore,
    notificationStore,
  } = useStores();
  const { push } = useHistory();

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

      kycStore.setShowPopup(true);
      push(Page.DASHBOARD);
    } catch (error) {}
  };

  const submitFiles = async () => {
    const keysOfEnum = Object.keys(DocumentTypeEnum).splice(0, 13);
    const readyFiles = keysOfEnum.filter((item) => {
      // @ts-ignore
      return kycStore.allFiles[item] !== null
    });
    kycStore.setFileSubmit(true);
    // TODO: refactor
    try {
      const response: any = await Axios.all(readyFiles.map((item) => {
        // @ts-ignore
        return API.postDocument(item, kycStore.allFiles[item].file, mainAppStore.initModel.authUrl);
      }));
      const fileWrongExtension = response.some(
        (res: any) =>
          res.result === OperationApiResponseCodes.FileWrongExtension
      );

      if (fileWrongExtension) {
        notificationStore.setNotification(
          t(
            apiResponseCodeMessages[
              OperationApiResponseCodes.FileWrongExtension
            ]
          )
        );
        notificationStore.setIsSuccessfull(false);
        notificationStore.openNotification();
        kycStore.setFileSubmit(false);
        return;
      }

      await postPersonalData();
    } catch (error) {
      kycStore.setFileSubmit(false);
    }
  };

  const attachLater = () => {
    push(Page.DASHBOARD);
  };

  const checkIsAvailableToSend = useMemo(() => {
    if (mainAppStore.profileStatus === PersonalDataKYCEnum.Restricted) {
      return !(kycStore.allFiles[DocumentTypeEnum.ProofOfAddress] ||
        (
          kycStore.allFiles[DocumentTypeEnum.Id] ||
          (
            kycStore.allFiles[DocumentTypeEnum.FrontCard] &&
            kycStore.allFiles[DocumentTypeEnum.BackCard]
          ) ||
          (
            kycStore.allFiles[DocumentTypeEnum.DriverLicenceFront] &&
            kycStore.allFiles[DocumentTypeEnum.DriverLicenceBack]
          )
        ));
    }
    return !(kycStore.allFiles[DocumentTypeEnum.ProofOfAddress] &&
      (
        kycStore.allFiles[DocumentTypeEnum.Id] ||
        (
          kycStore.allFiles[DocumentTypeEnum.FrontCard] &&
          kycStore.allFiles[DocumentTypeEnum.BackCard]
        ) ||
        (
          kycStore.allFiles[DocumentTypeEnum.DriverLicenceFront] &&
          kycStore.allFiles[DocumentTypeEnum.DriverLicenceBack]
        )
      ));
  }, [kycStore.allFiles]);

  return (
    <FlexContainer flexDirection="column" height="100%" justifyContent="space-between">
      <FlexContainer flexDirection="column">
        {KYCTypesMain.map((item) => (<TypeOfDocument key={item.id} {...item} />))}
      </FlexContainer>
      <FlexContainer width="100%" justifyContent="space-between">
        <KYCButton className="close" onClick={attachLater}>
          <PrimaryTextSpan
            fontWeight={700}
            fontSize="16px"
            lineHeight="24px"
            color="rgba(255, 255, 255, 0.64)"
          >
            {t('Close')}
          </PrimaryTextSpan>
        </KYCButton>
        <KYCButton
          disabled={checkIsAvailableToSend || kycStore.isFilesSubmit}
          onClick={submitFiles}
        >
          <PreloaderButtonMask loading={kycStore.isFilesSubmit} />
          <PrimaryTextSpan
            fontWeight={700}
            fontSize="16px"
            lineHeight="24px"
            color="#1C1F26"
          >
            {t('Send to Verification')}
          </PrimaryTextSpan>
        </KYCButton>
      </FlexContainer>
    </FlexContainer>
  );
});

export default KYCMain;


const KYCButton = styled(PrimaryButton)`
  width: 324px;
  padding: 20px 0;
  transition: 0.4s;
  position: relative;
  overflow: hidden;
  &.close {
    background: rgba(255, 255, 255, 0.12);
    &:hover {
      background: rgba(255, 255, 255, 0.22);
    };
  }
  &:disabled {
    background: #7D8289;
    span {
      color: #1C1F26;
    }
  }
`;