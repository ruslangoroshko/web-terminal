import React, { FC, useCallback, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { PrimaryButton } from '../../styles/Buttons';
import { useTranslation } from 'react-i18next';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import API from '../../helpers/API';

const EducationQuestionsPage: FC = observer(() => {
  const { educationStore, mainAppStore } = useStores();

  const { t, i18n } = useTranslation();

  const [activePage, setActivePage] = useState<number>(0);
  const [lastHandle, setLastHandle] = useState<'prev' | 'next' | null>(null);

  const checkFirstPage = useCallback(() => {
    return educationStore.activeQuestion?.id === educationStore.questionsList?.questions[0]?.id &&
      activePage === 0;
  }, [
    educationStore.activeQuestion,
    educationStore.questionsList,
    activePage
  ]);

  const checkLastPage = useCallback(() => {
    return (
      educationStore.activeQuestion?.id === educationStore.questionsList?.questions
      [
        educationStore.questionsList?.questions.length - 1
      ]?.id && activePage === (educationStore.activeQuestion?.pages.length! - 1)
    );
  }, [
    educationStore.activeQuestion,
    educationStore.questionsList,
    activePage
  ]);

  const handleNextPage = useCallback(() => {
    setLastHandle('next');
    if (activePage === educationStore.activeQuestion?.pages.length! - 1) {
      setActivePage(0);
      const indexOfQuestion = educationStore.questionsList?.questions.indexOf(educationStore.activeQuestion!) || 0;
      if (indexOfQuestion + 1 > educationStore.activeCourse?.lastQuestionNumber!) {
        const newCourseList = educationStore.coursesList?.map((item) => {
          if (item.id === educationStore.activeCourse?.id) {
            const newCourse = {
              ...item,
              lastQuestionNumber: indexOfQuestion + 1
            };
            educationStore.setActiveCourse(newCourse);
            return newCourse;
          }
          return item;
        });
        if (newCourseList) {
          educationStore.setCoursesList(newCourseList);
        }
        API.saveProgressEducation(
          mainAppStore.initModel.miscUrl,
          educationStore.activeCourse?.id || '',
          educationStore.activeQuestion?.id || 0
        );
      }
      if (indexOfQuestion === educationStore.questionsList?.questions.length! - 1) {
        educationStore.setShowPopup(true);
      } else {
        educationStore.setActiveQuestion(educationStore.questionsList?.questions[indexOfQuestion + 1] || null);
      }
    } else {
      setActivePage(activePage + 1);
    }
  }, [activePage, educationStore.questionsList, educationStore.activeQuestion]);

  const handlePrevPage = useCallback(() => {
    setLastHandle('prev');
    if (activePage === 0) {
      const indexOfQuestion = educationStore.questionsList?.questions.indexOf(educationStore.activeQuestion!) || 0;
      educationStore.setActiveQuestion(educationStore.questionsList?.questions[indexOfQuestion - 1] || null);
    } else {
      setActivePage(activePage - 1);
    }
  }, [activePage, educationStore.questionsList, educationStore.activeQuestion]);

  const checkPage = useCallback(() => {
    if (!educationStore.activeQuestion?.pages[activePage]?.url) {
      return`${window.location.origin}/404`;
    }
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    return `${
      window.location.origin
    }/${
      educationStore.activeQuestion?.pages[activePage]?.url || ''
    }?platform=${
      mainAppStore.initModel.brandName
    }&lang=${
      i18n.language || 'en'
    }&isSafari=${isSafari}`;
  }, [activePage, educationStore.activeQuestion]);

  useEffect(() => {
    if (lastHandle !== 'prev') {
      setActivePage(0);
    } else {
      setActivePage((educationStore.activeQuestion?.pages.length! - 1) || 0);
    }
  }, [
    educationStore.activeQuestion,
    educationStore.coursesList
  ]);

  return (
    <EducationPageWrapper
      flexDirection="column"
      width="calc(100% - 360px)"
      height="100%"
      position="relative"
    >
      {educationStore.activeQuestion &&
        <>
          <FlexContainer
            width="100%"
            height="calc(100% - 110px)"
            margin="0 auto 10px"
          >
            <iframe
              frameBorder="none"
              width="100%"
              height="calc(100% - 142px)"
              src={checkPage()}
              // src={`${educationStore.activeQuestion?.pages[activePage]?.url || ''}`}
            />
          </FlexContainer>
          <FlexContainer
            width="720px"
            margin="0 auto"
            justifyContent="space-between"
          >
            <EducationButton
              disabled={checkFirstPage()}
              backgroundColor="rgba(255, 255, 255, 0.12)"
              handleType="prev"
              onClick={handlePrevPage}
            >
              <PrimaryTextSpan
                fontSize="16px"
                lineHeight="24px"
                color="rgba(255, 255, 255, 0.64)"
              >
                {t('Previous')}
              </PrimaryTextSpan>
            </EducationButton>
            <EducationButton onClick={handleNextPage}>
              <PrimaryTextSpan
                fontSize="16px"
                lineHeight="24px"
                color="#1C1F26"
              >
                {checkLastPage() ? t('Finish') : t('Next')}
              </PrimaryTextSpan>
            </EducationButton>
          </FlexContainer>
        </>
      }
    </EducationPageWrapper>
  );
});

export default EducationQuestionsPage;

const EducationPageWrapper = styled(FlexContainer)`
  background: #252636;
`;

const EducationButton = styled(PrimaryButton)<{ handleType?: string }>`
  width: 348px;
  height: 60px;
  &:hover {
    background-color: ${(props) => props.handleType === 'prev' ? 'rgba(255, 255, 255, 0.42)' : '#9ffff2'};
  }
  &:focus {
    background-color: ${(props) => props.handleType === 'prev' ? 'rgba(255, 255, 255, 0.12)' : '#00ffdd'};
  }
`;
