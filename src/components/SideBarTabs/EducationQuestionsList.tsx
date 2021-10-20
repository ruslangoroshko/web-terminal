import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { observer, Observer } from 'mobx-react-lite';
import SvgIcon from '../SvgIcon';
import IconPlay from '../../assets/svg/icon-play.svg';
import IconLock from '../../assets/svg/icon-lock.svg';
import API from '../../helpers/API';
import { IEducationQuestion, IEducationQuestionsList } from '../../types/EducationTypes';
import LoaderForComponents from '../LoaderForComponents';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import CloseIcon from '../../assets/svg/icon-close.svg';
import { EducationResponseEnum } from '../../enums/EducationResponseEnum';

const EducationQuestionsList = observer(() => {
  const { educationStore, mainAppStore, tabsStore } = useStores();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastCourseId, setLastCourseId] = useState<string>('');

  const activeQuestionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cleanupFunction = false;
    const getCourses = async () => {
      setIsLoading(true);
      try {
        const response = await API.getQuestionsByCourses(
          mainAppStore.initModel.miscUrl,
          educationStore?.activeCourse?.id || ''
        );
        if (
          response.responseCode === EducationResponseEnum.Ok &&
          response.data.questions !== null &&
          response.data.questions.filter((item) => item.pages !== null).length > 0
        ) {
          const newData: IEducationQuestionsList = response.data;
          newData.questions = response.data.questions.filter((item) => item.pages !== null).sort((a, b) => a.id - b.id);
          educationStore.setQuestionsList(newData);
          educationStore.setActiveQuestion(
            educationStore.questionsList?.questions[
              educationStore.activeCourse?.lastQuestionNumber!
            ] ||
            educationStore.questionsList?.questions[0] ||
            null
          );
          if (!cleanupFunction) {
            setIsLoading(false);
          }
        } else {
          tabsStore.setTabExpanded(false);
          educationStore.setActiveCourse(null);
          educationStore.setQuestionsList(null);
          educationStore.setActiveQuestion(null);
        }
      } catch {}
    }
    if (
      educationStore.activeCourse &&
      educationStore.activeCourse?.id !== lastCourseId &&
      tabsStore.isTabExpanded
    ) {
      setLastCourseId(educationStore.activeCourse.id);
      getCourses();
    }
    return () => {
      cleanupFunction = true;
    };
  }, [
    educationStore.activeCourse,
    tabsStore.isTabExpanded
  ]);

  useEffect(() => {
    if (activeQuestionRef !== null) {
      activeQuestionRef?.current?.scrollIntoView();
    }
  }, [educationStore.activeQuestion]);

  const handleOpenQuestion = (question: IEducationQuestion) => () => {
    educationStore.setActiveQuestion(question);
  };

  const handleCloseCourse = () => {
    tabsStore.setTabExpanded(false);
    educationStore.setActiveCourse(null);
    educationStore.setQuestionsList(null);
    educationStore.setActiveQuestion(null);
  };

  const checkNumberOfQuestion = () => {
    const indexOfQuestion = educationStore.questionsList?.questions.indexOf(
      educationStore.activeQuestion!
    );
    if (indexOfQuestion) {
      return indexOfQuestion + 1;
    }
    return 1;
  };

  const checkLastQuestionNumber = useCallback(() => {
    const lastNumber = educationStore.coursesList?.find(
      (item) => item.id === educationStore.activeCourse?.id
    )?.lastQuestionNumber;
    return lastNumber || 0;
  }, [
    educationStore.activeCourse,
    educationStore.coursesList
  ]);

  return (
    <FlexContainer flexDirection="column" height="100%" minWidth="360px" width="360px">
      <QuestionsHeader
        justifyContent="center"
        alignItems="center"
        position="relative"
        height="48px"
      >
        <FlexContainer position="absolute" top="16px" left="20px">
          <ButtonWithoutStyles onClick={handleCloseCourse}>
            <SvgIcon
              {...CloseIcon}
              fillColor="#77797D"
              hoverFillColor="#fff"
            />
          </ButtonWithoutStyles>
        </FlexContainer>
        <FlexContainer position="absolute" top="14px" right="16px">
          <PrimaryTextSpan
            fontSize="14px"
            lineHeight="19.6px"
            color="#fff"
          >
            {checkNumberOfQuestion()} &nbsp;
          </PrimaryTextSpan>
          <PrimaryTextSpan
            fontSize="14px"
            lineHeight="19.6px"
            color="#77797D"
          >
            / {educationStore.activeCourse?.totalQuestions}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer>
          <PrimaryTextSpan
            fontSize="14px"
            lineHeight="18px"
            color="#fff"
          >
            {educationStore.activeCourse?.title}
          </PrimaryTextSpan>
        </FlexContainer>
      </QuestionsHeader>
      {
        isLoading
          ? <LoaderForComponents isLoading={isLoading} />
          : <>
            <Observer>
              {() => (
                <QuestionsWrapper flexDirection="column">
                  {educationStore.questionsList?.questions?.map((item, counter) => (
                    <QuestionWrapper
                      ref={item.id === educationStore.activeQuestion?.id ? activeQuestionRef : null}
                      key={item.id}
                      width="100%"
                      height="56px"
                      padding="0 16px 0 8px"
                      alignItems="center"
                      justifyContent="space-between"
                      background={
                        item.id === educationStore.activeQuestion?.id
                          ? 'rgba(28, 31, 38, 0.5)'
                          : 'rgba(28, 31, 38, 0)'
                      }
                      onClick={handleOpenQuestion(item)}
                      hasAccess={
                        (educationStore.activeCourse &&
                          counter <= checkLastQuestionNumber()) ||
                        false
                      }
                    >
                      <FlexContainer
                        alignItems="center"
                      >
                        <FlexContainer
                          width="16px"
                          marginRight="8px"
                          justifyContent="flex-end"
                        >
                          <PrimaryTextSpan
                            fontSize="12px"
                            lineHeight="15.6px"
                            color="rgba(255, 255, 255, 0.4)"
                          >
                            {counter + 1}
                          </PrimaryTextSpan>
                        </FlexContainer>
                        <FlexContainer
                          maxWidth="250px"
                        >
                          <PrimaryTextSpan
                            fontSize="14px"
                            lineHeight="18.2px"
                            color={
                              item.id === educationStore.activeQuestion?.id
                                ? '#fff'
                                : 'rgba(255, 255, 255, 0.64)'
                            }
                            marginRight="8px"
                          >
                            {item.title}
                          </PrimaryTextSpan>
                        </FlexContainer>
                      </FlexContainer>
                      <FlexContainer>
                        {
                          educationStore.activeCourse &&
                          counter <= educationStore.activeCourse?.lastQuestionNumber
                            ? <SvgIcon fillColor="#00FFDD" {...IconPlay} />
                            : <SvgIcon fillColor="#7D8289" {...IconLock} />
                        }
                      </FlexContainer>
                    </QuestionWrapper>
                  ))}
                </QuestionsWrapper>
              )}
            </Observer>
          </>
      }
    </FlexContainer>
  );
});

export default EducationQuestionsList;

const QuestionsWrapper = styled(FlexContainer)`
  overflow-y: auto;
  max-height: calc(100% - 48px);
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    width: 4px;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb:vertical {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const QuestionWrapper = styled(FlexContainer)<{ hasAccess: boolean }>`
  min-height: 56px;
  cursor: ${ (props) => props.hasAccess ? 'pointer' : 'default' };
  pointer-events: ${ (props) => props.hasAccess ? 'true' : 'none' };
  translate: 0.4s;
  &:hover {
    background: rgba(28, 31, 38, 0.5);
  }
`;

const QuestionsHeader = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
`;
