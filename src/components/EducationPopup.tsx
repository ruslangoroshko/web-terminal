import React, { FC, useCallback } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import Modal from './Modal';
import styled from '@emotion/styled';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../styles/TextsElements';
import { PrimaryButton } from '../styles/Buttons';
import { useHistory } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import Page from '../constants/Pages';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import CloseIcon from '../assets/svg/icon-close.svg';
import { useTranslation } from 'react-i18next';
import * as successIcon from '../assets/lotties/success-icon.json';
import * as confettie from '../assets/lotties/confettie-animation.json';
import Lottie from 'react-lottie';
import { observer } from 'mobx-react-lite';

const EducationPopup: FC = observer(() => {
  const { push } = useHistory();
  const { educationStore, tabsStore, bonusStore } = useStores();

  const getLottieOptions = (animationData: any, loop: boolean = false) => {
    return {
      loop: loop,
      autoplay: true,
      pause: false,
      animationData: animationData.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
        clearCanvas: false,
      },
    };
  };

  const nextCourse = () => {
    let indexOfCourse: null | number | undefined = null;
    educationStore.coursesList?.map((item, index) => {
      if (item.id === educationStore.activeCourse?.id) {
        indexOfCourse = index;
      }
      return item;
    });
    educationStore.setActiveCourse(null);
    if (
      (indexOfCourse !== null && indexOfCourse !== undefined) &&
      educationStore.coursesList
    ) {
      switch (indexOfCourse) {
        case 0:
          if (
            educationStore.coursesList[1]?.totalQuestions === educationStore.coursesList[1]?.totalQuestions
          ) {
            educationStore.setActiveCourse(educationStore.coursesList[indexOfCourse + 2]);
          } else {
            educationStore.setActiveCourse(educationStore.coursesList[indexOfCourse + 1]);
          }
          break;
        case 1:
          if (
            educationStore.coursesList[2]?.totalQuestions === educationStore.coursesList[2]?.totalQuestions
          ) {
            educationStore.setActiveCourse(educationStore.coursesList[0]);
          } else {
            educationStore.setActiveCourse(educationStore.coursesList[indexOfCourse + 1]);
          }
          break;
        case 2:
          if (
            educationStore.coursesList[0]?.totalQuestions === educationStore.coursesList[0]?.totalQuestions
          ) {
            educationStore.setActiveCourse(educationStore.coursesList[1]);
          } else {
            educationStore.setActiveCourse(educationStore.coursesList[0]);
          }
          break;
        default:
          educationStore.setActiveCourse(educationStore.coursesList[indexOfCourse + 1]);
      }
    }
    educationStore.setShowPopup(false);
  };

  const checkDeposit = () => {
    educationStore.setActiveCourse(null);
    educationStore.setActiveQuestion(null);
    educationStore.setQuestionsList(null);
    tabsStore.setTabExpanded(false);
    educationStore.setShowPopup(false);
    bonusStore.setShowBonusDeposit(true);
    push(Page.DEPOSIT_POPUP);
  };

  const closePopup = () => {
    educationStore.setActiveCourse(null);
    educationStore.setActiveQuestion(null);
    educationStore.setQuestionsList(null);
    tabsStore.setTabExpanded(false);
    educationStore.setShowPopup(false);
  };

  const checkLastCourses = useCallback(() => {
    return educationStore.coursesList?.every(
      (item) => item.lastQuestionNumber === item.totalQuestions
    );
  }, [educationStore.coursesList]);

  const { t } = useTranslation();

  return (
    <>
      <Modal>
        <BackgroundWrapperLayout
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          justifyContent="center"
          alignItems="center"
          zIndex="1000"
        >
          <FlexContainer
            boxShadow="0px -2px 16px rgba(0, 0, 0, 0.04)"
            borderRadius="5px"
            backgroundColor="#1C1F26"
            border="1px solid rgba(255, 255, 255, 0.12)"
            position="relative"
            width="800px"
            height="734px"
            flexDirection="column"
            padding="0 0 32px"
            alignItems="center"
          >
            <PopupHeader
              width="100%"
              height="68px"
              padding="20px 24px"
            >
              <PrimaryTextSpan
                fontWeight={700}
                fontSize="20px"
                color="#fffccc"
              >
                {t('Course')} - “{educationStore.activeCourse?.title}”
              </PrimaryTextSpan>
            </PopupHeader>
            <FlexContainer position="absolute" top="18px" right="18px">
              <ButtonWithoutStyles onClick={closePopup}>
                <SvgIcon
                  {...CloseIcon}
                  fillColor="rgba(255, 255, 255, 0.6)"
                  hoverFillColor="#01ffdd"
                />
              </ButtonWithoutStyles>
            </FlexContainer>
            <FlexContainer
              flexDirection="column"
              justifyContent="space-between"
              width="100%"
              height="100%"
              margin="68px 0 0"
            >
              <FlexContainer flexDirection="column" alignItems="center" position="relative">
                <FlexContainer
                  left="275px"
                  top="-49px"
                  position="absolute"
                  width="250px"
                  height="250px"
                >
                  <Lottie
                    options={getLottieOptions(confettie, true)}
                    height="250px"
                    width="250px"
                    isClickToPauseDisabled={true}
                  />
                </FlexContainer>
                <FlexContainer
                  width="138px"
                  height="138px"
                  marginBottom="64px"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Lottie
                    options={getLottieOptions(successIcon)}
                    height="138px"
                    width="138px"
                    isClickToPauseDisabled={true}
                  />
                </FlexContainer>
                <PrimaryTextParagraph
                  fontSize="22px"
                  lineHeight="33px"
                  color="#fff"
                  marginBottom="8px"
                  width="470px"
                  textAlign="center"
                >
                  {`${t('Congratulation! You have successfully completed Course')} - “${educationStore.activeCourse?.title}”`}
                </PrimaryTextParagraph>
              </FlexContainer>
              <FlexContainer flexDirection="column" alignItems="center" width="344px" margin="0 auto">
                <FlexContainer width="100%" marginBottom="16px">
                  <PrimaryButton
                    onClick={checkDeposit}
                    width="100%"
                    padding="20px"
                  >
                    <PrimaryTextSpan
                      fontWeight="bold"
                      fontSize="16px"
                      color="#252636"
                    >
                      {t('Deposit & Start Trading')}
                    </PrimaryTextSpan>
                  </PrimaryButton>
                </FlexContainer>
                <NextButton
                  onClick={checkLastCourses() ? closePopup : nextCourse}
                  width="100%"
                >
                  <PrimaryTextSpan
                    fontWeight="bold"
                    fontSize="16px"
                    color="#fff"
                  >
                    {checkLastCourses() ? t('Finish Course') : t('Next Course')}
                  </PrimaryTextSpan>
                </NextButton>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
        </BackgroundWrapperLayout>
      </Modal>
    </>
  );
});

export default EducationPopup;

const BackgroundWrapperLayout = styled(FlexContainer)`
  background-color: rgba(0, 0, 0, 0.7);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(12px);
  }
`;

const PopupHeader = styled(FlexContainer)`
  border-bottom: 1px solid #77797D;
`;

const NextButton = styled(PrimaryButton)`
  height: 20px;
  background-color: transparent;
  &:hover {
    background-color: transparent;
  }
  &:focus {
    background-color: transparent;
  }
`;
