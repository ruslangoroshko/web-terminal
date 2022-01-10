import React, { useCallback, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { PrimaryButton } from '../../styles/Buttons';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import { KYCPageStepsEnum } from '../../enums/KYCsteps';
import DragNDropArea from './DragNDropArea';
import IconCheck from '../../assets/images/kyc/check.png';
import IconCross from '../../assets/images/kyc/cross.png';
import Pass1 from '../../assets/images/kyc/3photo.png';
import Pass2 from '../../assets/images/kyc/3photo-1.png';
import Pass3 from '../../assets/images/kyc/3photo-2.png';
import Pass4 from '../../assets/images/kyc/3photo-3.png';
import IconHome from '../../assets/svg/icon-home.svg';
import { DocumentTypeEnum } from '../../enums/DocumentTypeEnum';
import { observer } from 'mobx-react-lite';
import SvgIcon from '../SvgIcon';

const KYCAddress = observer(() => {
  const { t } = useTranslation();
  const {
    kycStore,
  } = useStores();

  const [error, setError] = useState(false);
  const [image, setImage] = useState({
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
    kycStore.setFile(image, DocumentTypeEnum.ProofOfAddress);
    kycStore.setCurrentPageStep(KYCPageStepsEnum.Main);
  };

  const checkDisabled = useCallback(() => {
    return !image.fileSrc.length;
  }, [
    kycStore.typeOfIdActual,
    image,
  ]);

  const handleCloseTab = () => {
    kycStore.setCurrentPageStep(KYCPageStepsEnum.Main);
  };

  useEffect(() => {
    if (kycStore.allFiles[DocumentTypeEnum.ProofOfAddress] !== null) {
      // @ts-ignore
      setImage(kycStore.allFiles[DocumentTypeEnum.ProofOfAddress]);
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
        <SvgIcon {...IconHome} fillColor="none" />
      </FlexContainer>
      <PrimaryTextSpan
        fontWeight={700}
        fontSize="17px"
        lineHeight="22px"
        color="#fff"
        marginBottom="4px"
      >
        {t('Proof of Address')} ({t('Required')})
      </PrimaryTextSpan>
      <PrimaryTextSpan
        fontWeight={400}
        fontSize="13px"
        lineHeight="18px"
        color="#fff"
        marginBottom="24px"
      >
        {t('You need to upload proof of address. It can be your bank statement or utility bill.')})
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
            key={'pass'}
            hasError={error}
            onFileReceive={handleFileReceive(setImage, setError)}
            file={image.file}
            fileUrl={image.fileSrc}
            typeOfFile={'Proof of Address'}
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
                <img alt={'example'} height="77px" width="auto" src={Pass1} />
              </FlexContainer>
              <FlexContainer
                position="absolute"
                top="72px"
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
                <img alt={'example'} height="77px" width="auto" src={Pass2} />
              </FlexContainer>
              <FlexContainer
                position="absolute"
                top="72px"
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
                <img alt={'example'} height="77px" width="auto" src={Pass3} />
              </FlexContainer>
              <FlexContainer
                position="absolute"
                top="72px"
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
                <img alt={'example'} height="77px" width="auto" src={Pass4} />
              </FlexContainer>
              <FlexContainer
                position="absolute"
                top="72px"
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
              <PrimaryTextSpan
                fontWeight={400}
                fontSize="13px"
                lineHeight="18px"
                color="rgba(255, 255, 255, 0.64)"
                marginBottom="8px"
              >
                + {t('Сreated less than 3 months old')}
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
});

export default KYCAddress;

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