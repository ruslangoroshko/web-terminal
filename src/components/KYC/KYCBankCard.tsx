import React, { useCallback, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { PrimaryButton } from '../../styles/Buttons';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import { KYCPageStepsEnum } from '../../enums/KYCsteps';
import SvgIcon from '../SvgIcon';
import IconBank from '../../assets/svg/icon-bank-card.svg';
import DragNDropArea from './DragNDropArea';
import Pass1 from '../../assets/images/kyc/4photo.png';
import IconCheck from '../../assets/images/kyc/check.png';
import Pass2 from '../../assets/images/kyc/4photo-1.png';
import IconCross from '../../assets/images/kyc/cross.png';
import Pass3 from '../../assets/images/kyc/4photo-2.png';
import Pass4 from '../../assets/images/kyc/4photo-3.png';
import { DocumentTypeEnum } from '../../enums/DocumentTypeEnum';

const KYCBankCard = () => {
  const { t } = useTranslation();
  const {
    kycStore,
  } = useStores();

  const [errorBack, setErrorBack] = useState(false);
  const [errorFront, setErrorFront] = useState(false);
  const [imageBack, setImageBack] = useState({
    file: new Blob(),
    fileSrc: '',
  });
  const [imageFront, setImageFront] = useState({
    file: new Blob(),
    fileSrc: '',
  });

  const handleFileReceive = (method: (file: any) => void, errorMethod: (file: any) => void,) => (file: any) => {
    method({
      file,
      fileSrc: URL.createObjectURL(file),
    });
    errorMethod(false);
  };

  const handleContinue = () => {
    kycStore.setFile(imageFront, DocumentTypeEnum.BankCardFront);
    kycStore.setFile(imageBack, DocumentTypeEnum.BankCardBack);
    kycStore.setCurrentPageStep(KYCPageStepsEnum.Main);
  };

  const checkDisabled = useCallback(() => {
    return !(!!imageFront.fileSrc.length && !!imageBack.fileSrc.length);
  }, [
    kycStore.typeOfIdActual,
    imageFront,
    imageBack,
  ]);

  const handleCloseTab = () => {
    kycStore.setCurrentPageStep(KYCPageStepsEnum.Main);
  };

  useEffect(() => {
    if (kycStore.allFiles[DocumentTypeEnum.BankCardBack] !== null) {
      // @ts-ignore
      setImageBack(kycStore.allFiles[DocumentTypeEnum.BankCardBack]);
    }
    if (kycStore.allFiles[DocumentTypeEnum.BankCardFront] !== null) {
      // @ts-ignore
      setImageFront(kycStore.allFiles[DocumentTypeEnum.BankCardFront]);
    }
  }, []);

  return (
    <FlexContainer
      flexDirection="column"
      marginBottom="50px"
      height="100%"
      overflow="auto"
      justifyContent="space-between"
      width="100%"
      alignItems="center"
    >
      <FlexContainer marginBottom="12px">
        <SvgIcon {...IconBank} fillColor="none" />
      </FlexContainer>
      <PrimaryTextSpan
        fontWeight={700}
        fontSize="17px"
        lineHeight="22px"
        color="#fff"
        marginBottom="4px"
      >
        {t('Bank Card')} ({t('For card payments only')})
      </PrimaryTextSpan>
      <PrimaryTextSpan
        fontWeight={400}
        fontSize="13px"
        lineHeight="18px"
        color="#fff"
        marginBottom="24px"
      >
        {t('If you make a deposit using a bank card, you need to confirm that it belongs to you')})
      </PrimaryTextSpan>
      <FlexContainer
        width="100%"
      >
        <FlexContainer
          flexDirection="column"
          margin="0 0 64px 0"
          minHeight="120px"
          width="100%"
        >
          <DragNDropArea
            key={'pass1'}
            hasError={errorFront}
            onFileReceive={handleFileReceive(setImageFront, setErrorFront)}
            file={imageFront.file}
            fileUrl={imageFront.fileSrc}
            typeOfFile={'Front Side'}
          />
          <DragNDropArea
            key={'pass2'}
            hasError={errorBack}
            onFileReceive={handleFileReceive(setImageBack, setErrorBack)}
            file={imageBack.file}
            fileUrl={imageBack.fileSrc}
            typeOfFile={'Back Side'}
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
                <img alt={'example'} height="48px" width="auto" src={Pass1} />
              </FlexContainer>
              <FlexContainer
                position="absolute"
                top="38px"
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
                <img alt={'example'} height="48px" width="auto" src={Pass2} />
              </FlexContainer>
              <FlexContainer
                position="absolute"
                top="38px"
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
                <img alt={'example'} height="48px" width="auto" src={Pass3} />
              </FlexContainer>
              <FlexContainer
                position="absolute"
                top="38px"
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
                <img alt={'example'} height="48px" width="auto" src={Pass4} />
              </FlexContainer>
              <FlexContainer
                position="absolute"
                top="38px"
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
          <PrimaryTextSpan
            fontWeight={400}
            fontSize="13px"
            lineHeight="18px"
            color="rgba(255, 255, 255, 0.64)"
          >
            {t('Take a photo of a bank card from the front and back sides, covering part of the data:')}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            fontWeight={400}
            fontSize="13px"
            lineHeight="18px"
            color="rgba(255, 255, 255, 0.64)"
          >
            &bull; {t('Leave the first 6 digits and the last 4 digits of your card number open. Example 1111 22** **** 4444')};
          </PrimaryTextSpan>
          <PrimaryTextSpan
            fontWeight={400}
            fontSize="13px"
            lineHeight="18px"
            color="rgba(255, 255, 255, 0.64)"
            marginBottom="16px"
          >
            &bull; {t('On the back of the card, you must close the СVV code (three digits)')}
          </PrimaryTextSpan>
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
      <FlexContainer width="100%" justifyContent="space-between">
        <KYCButton className="close" onClick={handleCloseTab}>
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
          disabled={checkDisabled()}
          onClick={handleContinue}
        >
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
}

export default KYCBankCard;

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