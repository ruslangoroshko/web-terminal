import React, { useCallback, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { PrimaryButton } from '../../styles/Buttons';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import { KYCPageStepsEnum } from '../../enums/KYCsteps';
import { KYCTypeOfIdConst } from '../../constants/KYCConstants';
import KYCTypeOfId from './KYCTypeOfId';
import { observer, Observer } from 'mobx-react-lite';
import { DocumentTypeEnum } from '../../enums/DocumentTypeEnum';

import Pass1 from '../../assets/images/kyc/photo.png';
import Pass2 from '../../assets/images/kyc/photo-1.png';
import Pass3 from '../../assets/images/kyc/photo-2.png';
import Pass4 from '../../assets/images/kyc/photo-3.png';
import Drive1 from '../../assets/images/kyc/1photo.png';
import Drive2 from '../../assets/images/kyc/1photo-1.png';
import Drive3 from '../../assets/images/kyc/1photo-2.png';
import Drive4 from '../../assets/images/kyc/1photo-3.png';
import Id1 from '../../assets/images/kyc/2photo.png';
import Id2 from '../../assets/images/kyc/2photo-1.png';
import Id3 from '../../assets/images/kyc/2photo-2.png';
import Id4 from '../../assets/images/kyc/2photo-3.png';

import IconCheck from '../../assets/images/kyc/check.png';
import IconCross from '../../assets/images/kyc/cross.png';

import DragNDropArea from './DragNDropArea';

const KYCId = observer(() => {
  const { t } = useTranslation();
  const {
    kycStore,
  } = useStores();

  const [errorPassport, setErrorPassport] = useState(false);
  const [errorIdFront, setErrorIdFront] = useState(false);
  const [errorIdBack, setErrorIdBack] = useState(false);
  const [errorDriveFront, setErrorDriveFront] = useState(false);
  const [errorDriveBack, setErrorDriveBack] = useState(false);

  const [passportImage, setPassportImage] = useState({
    file: new Blob(),
    fileSrc: '',
  });
  const [idFrontImage, setIdFrontImage] = useState({
    file: new Blob(),
    fileSrc: '',
  });
  const [idBackImage, setIdBackImage] = useState({
    file: new Blob(),
    fileSrc: '',
  });
  const [driveFrontImage, setDriveFrontImage] = useState({
    file: new Blob(),
    fileSrc: '',
  });
  const [driveBackImage, setDriveBackImage] = useState({
    file: new Blob(),
    fileSrc: '',
  });

  const handleFileReceive = (method: (file: any) => void, errorMethod: (file: any) => void,) => (file: any) => {
    method({
      file,
      fileSrc: file.size ? URL.createObjectURL(file) : '',
    });
    errorMethod(false);
  };

  const handleCloseTab = () => {
    kycStore.setCurrentPageStep(KYCPageStepsEnum.Main);
  };

  const checkDisabled = useCallback(() => {
    switch (kycStore.typeOfIdActual) {
      case DocumentTypeEnum.DriverLicenceFront:
        return !(!!driveBackImage.fileSrc.length && !!driveFrontImage.fileSrc.length);
      case DocumentTypeEnum.Id:
        return !passportImage.fileSrc.length;
      case DocumentTypeEnum.FrontCard:
        return !(!!idFrontImage.fileSrc.length && !!idBackImage.fileSrc.length);
    }
  }, [
    kycStore.typeOfIdActual,
    driveBackImage,
    driveFrontImage,
    passportImage,
    idFrontImage,
    idBackImage,
  ]);

  const handleContinue = () => {
    switch (kycStore.typeOfIdActual) {
      case DocumentTypeEnum.DriverLicenceFront:
        kycStore.setFile(driveFrontImage, DocumentTypeEnum.DriverLicenceFront);
        kycStore.setFile(driveBackImage, DocumentTypeEnum.DriverLicenceBack);
        break;
      case DocumentTypeEnum.Id:
        kycStore.setFile(passportImage, DocumentTypeEnum.Id);
        break;
      case DocumentTypeEnum.FrontCard:
        kycStore.setFile(idFrontImage, DocumentTypeEnum.FrontCard);
        kycStore.setFile(idBackImage, DocumentTypeEnum.BackCard);
        break;
    }
    kycStore.setCurrentPageStep(KYCPageStepsEnum.Main);
  };

  const uploadAreaByType = () => {
    switch (kycStore.typeOfIdActual) {
      case DocumentTypeEnum.DriverLicenceFront:
        return <FlexContainer flexDirection="column">
          <FlexContainer
            flexDirection="column"
            margin="0 0 64px 0"
            minHeight="120px"
          >
            <DragNDropArea
              key={'drive1'}
              hasError={errorDriveFront}
              onFileReceive={handleFileReceive(setDriveFrontImage, setErrorDriveFront)}
              file={driveFrontImage.file}
              fileUrl={driveFrontImage.fileSrc}
              typeOfFile={'Front Side'}
              typeForEnum={DocumentTypeEnum.DriverLicenceFront}
            />
            <DragNDropArea
              key={'drive2'}
              hasError={errorDriveBack}
              onFileReceive={handleFileReceive(setDriveBackImage, setErrorDriveBack)}
              file={driveBackImage.file}
              fileUrl={driveBackImage.fileSrc}
              typeOfFile={'Back Side'}
              typeForEnum={DocumentTypeEnum.DriverLicenceBack}
            />
            <PrimaryTextSpan
              fontWeight={700}
              fontSize="17px"
              lineHeight="22px"
              color="#fff"
              marginBottom="16px"
            >
              {t('Image Requirements')}
            </PrimaryTextSpan>
            <FlexContainer>
              <FlexContainer
                position="relative"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginRight="12px"
              >
                <FlexContainer
                  marginBottom="12px"
                >
                  <img alt={'example'} height="57px" width="auto" src={Drive1} />
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="52px"
                >
                  <img alt={'example'} src={IconCheck} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="12px"
                  lineHeight="18px"
                  color="#fff"
                  marginBottom="16px"
                >
                  {t('Good')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                position="relative"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginRight="12px"
              >
                <FlexContainer
                  marginBottom="12px"
                >
                  <img alt={'example'} height="57px" width="auto" src={Drive2} />
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="52px"
                >
                  <img alt={'example'} src={IconCross} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="12px"
                  lineHeight="18px"
                  color="#fff"
                  marginBottom="16px"
                >
                  {t('Not cut')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                position="relative"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginRight="12px"
              >
                <FlexContainer
                  marginBottom="12px"
                >
                  <img alt={'example'} height="57px" width="auto" src={Drive3} />
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="52px"
                >
                  <img alt={'example'} src={IconCross} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="12px"
                  lineHeight="18px"
                  color="#fff"
                  marginBottom="16px"
                >
                  {t('Not blurry')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                position="relative"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginRight="12px"
              >
                <FlexContainer
                  marginBottom="12px"
                >
                  <img alt={'example'} height="57px" width="auto" src={Drive4} />
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="52px"
                >
                  <img alt={'example'} src={IconCross} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="12px"
                  lineHeight="18px"
                  color="#fff"
                  marginBottom="16px"
                >
                  {t('Not reflective')}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer width="100%">
              <FlexContainer
                width="50%"
                flexDirection="column"
                marginRight="22px"
              >
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="13px"
                  lineHeight="18px"
                  color="rgba(255, 255, 255, 0.64)"
                  marginBottom="8px"
                >
                  + {t('Original full-size, unedited documents')}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="13px"
                  lineHeight="18px"
                  color="rgba(255, 255, 255, 0.64)"
                  marginBottom="8px"
                >
                  + {t('Readable, well-lit, colored images')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                width="50%"
                flexDirection="column"
              >
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="13px"
                  lineHeight="18px"
                  color="rgba(255, 255, 255, 0.64)"
                  marginBottom="8px"
                >
                  - {t('No black and white images')}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="13px"
                  lineHeight="18px"
                  color="rgba(255, 255, 255, 0.64)"
                  marginBottom="8px"
                >
                  - {t('No edited or expired documents')}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      case DocumentTypeEnum.Id:
        return <FlexContainer flexDirection="column">
          <FlexContainer
            flexDirection="column"
            margin="0 0 64px 0"
            minHeight="120px"
          >
            <DragNDropArea
              key={'pass'}
              hasError={errorPassport}
              onFileReceive={handleFileReceive(setPassportImage, setErrorPassport)}
              file={passportImage.file}
              fileUrl={passportImage.fileSrc}
              typeOfFile={'Passport'}
              typeForEnum={DocumentTypeEnum.Id}
            />
            <PrimaryTextSpan
              fontWeight={700}
              fontSize="17px"
              lineHeight="22px"
              color="#fff"
              marginBottom="16px"
            >
              {t('Image Requirements')}
            </PrimaryTextSpan>
            <FlexContainer>
              <FlexContainer
                position="relative"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginRight="12px"
              >
                <FlexContainer
                  marginBottom="12px"
                >
                  <img alt={'example'} height="57px" width="auto" src={Pass1} />
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="52px"
                >
                  <img alt={'example'} src={IconCheck} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="12px"
                  lineHeight="18px"
                  color="#fff"
                  marginBottom="16px"
                >
                  {t('Good')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                position="relative"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginRight="12px"
              >
                <FlexContainer
                  marginBottom="12px"
                >
                  <img alt={'example'} height="57px" width="auto" src={Pass2} />
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="52px"
                >
                  <img alt={'example'} src={IconCross} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="12px"
                  lineHeight="18px"
                  color="#fff"
                  marginBottom="16px"
                >
                  {t('Not cut')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                position="relative"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginRight="12px"
              >
                <FlexContainer
                  marginBottom="12px"
                >
                  <img alt={'example'} height="57px" width="auto" src={Pass3} />
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="52px"
                >
                  <img alt={'example'} src={IconCross} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="12px"
                  lineHeight="18px"
                  color="#fff"
                  marginBottom="16px"
                >
                  {t('Not blurry')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                position="relative"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginRight="12px"
              >
                <FlexContainer
                  marginBottom="12px"
                >
                  <img alt={'example'} height="57px" width="auto" src={Pass4} />
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="52px"
                >
                  <img alt={'example'} src={IconCross} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="12px"
                  lineHeight="18px"
                  color="#fff"
                  marginBottom="16px"
                >
                  {t('Not reflective')}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer width="100%">
              <FlexContainer
                width="50%"
                flexDirection="column"
                marginRight="22px"
              >
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="13px"
                  lineHeight="18px"
                  color="rgba(255, 255, 255, 0.64)"
                  marginBottom="8px"
                >
                  + {t('Original full-size, unedited documents')}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="13px"
                  lineHeight="18px"
                  color="rgba(255, 255, 255, 0.64)"
                  marginBottom="8px"
                >
                  + {t('Readable, well-lit, colored images')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                width="50%"
                flexDirection="column"
              >
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="13px"
                  lineHeight="18px"
                  color="rgba(255, 255, 255, 0.64)"
                  marginBottom="8px"
                >
                  - {t('No black and white images')}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="13px"
                  lineHeight="18px"
                  color="rgba(255, 255, 255, 0.64)"
                  marginBottom="8px"
                >
                  - {t('No edited or expired documents')}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      case DocumentTypeEnum.FrontCard:
        return <FlexContainer flexDirection="column">
          <FlexContainer
            flexDirection="column"
            margin="0 0 64px 0"
            minHeight="120px"
          >
            <DragNDropArea
              key={'id1'}
              hasError={errorIdFront}
              onFileReceive={handleFileReceive(setIdFrontImage, setErrorIdFront)}
              file={idFrontImage.file}
              fileUrl={idFrontImage.fileSrc}
              typeOfFile={'Front Side'}
              typeForEnum={DocumentTypeEnum.FrontCard}
            />
            <DragNDropArea
              key={'id2'}
              hasError={errorIdBack}
              onFileReceive={handleFileReceive(setIdBackImage, setErrorIdBack)}
              file={idBackImage.file}
              fileUrl={idBackImage.fileSrc}
              typeOfFile={'Back Side'}
              typeForEnum={DocumentTypeEnum.BackCard}
            />
            <PrimaryTextSpan
              fontWeight={700}
              fontSize="17px"
              lineHeight="22px"
              color="#fff"
              marginBottom="16px"
            >
              {t('Image Requirements')}
            </PrimaryTextSpan>
            <FlexContainer>
              <FlexContainer
                position="relative"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginRight="12px"
              >
                <FlexContainer
                  marginBottom="12px"
                >
                  <img alt={'example'} height="57px" width="auto" src={Id1} />
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="52px"
                >
                  <img alt={'example'} src={IconCheck} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="12px"
                  lineHeight="18px"
                  color="#fff"
                  marginBottom="16px"
                >
                  {t('Good')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                position="relative"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginRight="12px"
              >
                <FlexContainer
                  marginBottom="12px"
                >
                  <img alt={'example'} height="57px" width="auto" src={Id2} />
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="52px"
                >
                  <img alt={'example'} src={IconCross} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="12px"
                  lineHeight="18px"
                  color="#fff"
                  marginBottom="16px"
                >
                  {t('Not cut')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                position="relative"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginRight="12px"
              >
                <FlexContainer
                  marginBottom="12px"
                >
                  <img alt={'example'} height="57px" width="auto" src={Id3} />
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="52px"
                >
                  <img alt={'example'} src={IconCross} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="12px"
                  lineHeight="18px"
                  color="#fff"
                  marginBottom="16px"
                >
                  {t('Not blurry')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                position="relative"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginRight="12px"
              >
                <FlexContainer
                  marginBottom="12px"
                >
                  <img alt={'example'} height="57px" width="auto" src={Id4} />
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="52px"
                >
                  <img alt={'example'} src={IconCross} />
                </FlexContainer>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="12px"
                  lineHeight="18px"
                  color="#fff"
                  marginBottom="16px"
                >
                  {t('Not reflective')}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer width="100%">
              <FlexContainer
                width="50%"
                flexDirection="column"
                marginRight="22px"
              >
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="13px"
                  lineHeight="18px"
                  color="rgba(255, 255, 255, 0.64)"
                  marginBottom="8px"
                >
                  + {t('Original full-size, unedited documents')}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="13px"
                  lineHeight="18px"
                  color="rgba(255, 255, 255, 0.64)"
                  marginBottom="8px"
                >
                  + {t('Readable, well-lit, colored images')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                width="50%"
                flexDirection="column"
              >
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="13px"
                  lineHeight="18px"
                  color="rgba(255, 255, 255, 0.64)"
                  marginBottom="8px"
                >
                  - {t('No black and white images')}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="13px"
                  lineHeight="18px"
                  color="rgba(255, 255, 255, 0.64)"
                  marginBottom="8px"
                >
                  - {t('No edited or expired documents')}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
    }
  };

  useEffect(() => {
    if (kycStore.allFiles[DocumentTypeEnum.DriverLicenceBack] !== null) {
      // @ts-ignore
      setDriveBackImage(kycStore.allFiles[DocumentTypeEnum.DriverLicenceBack]);
    }
    if (kycStore.allFiles[DocumentTypeEnum.DriverLicenceFront] !== null) {
      // @ts-ignore
      setDriveFrontImage(kycStore.allFiles[DocumentTypeEnum.DriverLicenceFront]);
    }
    if (kycStore.allFiles[DocumentTypeEnum.Id] !== null) {
      // @ts-ignore
      setPassportImage(kycStore.allFiles[DocumentTypeEnum.Id]);
    }
    if (kycStore.allFiles[DocumentTypeEnum.FrontCard] !== null) {
      // @ts-ignore
      setIdFrontImage(kycStore.allFiles[DocumentTypeEnum.FrontCard]);
    }
    if (kycStore.allFiles[DocumentTypeEnum.BackCard] !== null) {
      // @ts-ignore
      setIdBackImage(kycStore.allFiles[DocumentTypeEnum.BackCard]);
    }
  }, []);

  return (
    <FlexContainer
      flexDirection="column"
      marginBottom="50px"
      height="100%"
      overflow="auto"
      justifyContent="space-between"
    >
      <FlexContainer flexDirection="column">
        <PrimaryTextSpan
          fontWeight={700}
          fontSize="17px"
          lineHeight="22px"
          color="#fff"
          marginBottom="24px"
        >
          {t('Select one of the document\'s type')}
        </PrimaryTextSpan>
        <Observer>
          {() => <FlexContainer
            justifyContent="space-between"
            marginBottom="32px"
          >
            {
              // @ts-ignore
              KYCTypeOfIdConst.map((item) => <KYCTypeOfId key={item.id} {...item} />)
            }
          </FlexContainer>}
        </Observer>
        {uploadAreaByType()}
      </FlexContainer>
      <FlexContainer width="100%" justifyContent="space-between">
        <KYCButton className="close" onClick={handleCloseTab}>
          <PrimaryTextSpan
            fontWeight={700}
            fontSize="16px"
            lineHeight="24px"
            color="rgba(255, 255, 255, 0.64)"
          >
            {t('Back')}
          </PrimaryTextSpan>
        </KYCButton>
        <KYCButton disabled={checkDisabled()} onClick={handleContinue}>
          <PrimaryTextSpan
            fontWeight={700}
            fontSize="16px"
            lineHeight="24px"
            color="#1C1F26"
          >
            {t('Continue')}
          </PrimaryTextSpan>
        </KYCButton>
      </FlexContainer>
    </FlexContainer>
  );
});

export default KYCId;

const KYCButton = styled(PrimaryButton)`
  width: 324px;
  padding: 20px 0;
  transition: 0.4s;
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