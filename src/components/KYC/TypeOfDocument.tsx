import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { DocumentTypeEnum } from '../../enums/DocumentTypeEnum';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import { KYCPageStepsEnum } from '../../enums/KYCsteps';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../SvgIcon';
import IconGoGo from '../../assets/svg/icon-arrow-right.svg';
import IconCheck from '../../assets/svg/icon-check.svg';
import styled from '@emotion/styled';

interface Props {
  id: KYCPageStepsEnum,
  isSubmitting: boolean,
  title: string,
  comment: string,
  description: string,
  checkId: (DocumentTypeEnum | DocumentTypeEnum[])[],
}

const TypeOfDocument: FC<Props> = (
  {
    id,
    title,
    comment,
    description,
    checkId,
    isSubmitting,
  }) => {
  const {
    kycStore,
  } = useStores();
  const { t } = useTranslation();


  const handleClick = () => {
    kycStore.setCurrentPageStep(id);
  };

  const handleCheckIsLoaded = () => {
    const isLoaded: boolean[] = [];
    checkId.forEach((item) => {
      if (typeof item !== 'object') {
        isLoaded.push(kycStore.allFiles[item] !== null);
      } else {
        isLoaded.push(item.every((inner) => kycStore.allFiles[inner] !== null))
      }
    });
    return isLoaded.some((item) => item);
  };

  return (
    <TypeDocumentWrapper
      backgroundColor="rgba(255, 255, 255, 0.06)"
      borderRadius="10px"
      padding="12px 25px 16px 12px"
      flexDirection="column"
      cursor="pointer"
      marginBottom="16px"
      onClick={handleClick}
      isSubmitting={isSubmitting}
    >
      <FlexContainer
        alignItems="center"
        justifyContent="space-between"
      >
        <FlexContainer
          alignItems="center"
        >
          <FlexContainer
            width="32px"
            height="32px"
            borderRadius="16px"
            backgroundColor={
              handleCheckIsLoaded()
                ? '#fffccc'
                : 'rgba(255, 255, 255, 0.04)'
            }
            border="1px solid rgba(255, 255, 255, 0.12)"
            alignItems="center"
            justifyContent="center"
            marginRight="12px"
          >
            {
              handleCheckIsLoaded()
                ? <SvgIcon
                  {...IconCheck}
                  fillColor="none"
                />
                : <PrimaryTextSpan
                  fontWeight={500}
                  fontSize="17px"
                  lineHeight="24px"
                  color="#fff"
                >
                  {id}
                </PrimaryTextSpan>
            }
          </FlexContainer>
          <FlexContainer>
            <PrimaryTextSpan
              fontWeight={700}
              fontSize="17px"
              lineHeight="22px"
              color="#fff"
            >
              {t(title)} ({t(comment)})
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer alignItems="center">
          <PrimaryTextSpan
            fontWeight={700}
            fontSize="17px"
            lineHeight="22px"
            color="#00FFDD"
            marginRight="4px"
          >
            {handleCheckIsLoaded()
              ? t('Edit')
              : t('Start')}
          </PrimaryTextSpan>
          <SvgIcon
            {...IconGoGo}
            fillColor="#00FFDD"
          />
        </FlexContainer>
      </FlexContainer>
      <FlexContainer
        margin="0 0 0 44px"
      >
        <PrimaryTextSpan
          fontWeight={400}
          fontSize="13px"
          lineHeight="18px"
          color="#fff"
        >
          {t(description)}
        </PrimaryTextSpan>
      </FlexContainer>
    </TypeDocumentWrapper>
  );
}

export default TypeOfDocument;

const TypeDocumentWrapper = styled(FlexContainer)<{isSubmitting: boolean}>`
  transition: 0.4s;
  pointer-events: ${(props) => props.isSubmitting ? 'none' : 'all'};
  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }
`;
