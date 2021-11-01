import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { observer, Observer } from 'mobx-react-lite';
import EducationQuestionsList from './EducationQuestionsList';
import EducationQuestionsPage from './EducationQuestionsPage';
import NotificationPopup from '../NotificationPopup';

const EducationExpanded: FC = observer(() => {
  const { educationStore, notificationStore } = useStores();

  return (
    <EducationExpandedWrapper
      width="100%"
      height="100%"
      position="relative"
      isInvisible={educationStore.activeQuestion === null}
    >
      <FlexContainer
        position="absolute"
        bottom="100px"
        left="14px"
        zIndex="1005"
      >
        <Observer>
          {() => (
            <NotificationPopup
              show={
                notificationStore.isActiveNotification &&
                !notificationStore.isActiveNotificationGlobal
              }
            ></NotificationPopup>
          )}
        </Observer>
      </FlexContainer>
      {
        educationStore.activeCourse &&
        <>
          <EducationQuestionsList />
          <EducationQuestionsPage />
        </>
      }
    </EducationExpandedWrapper>
  );
});

export default EducationExpanded;

const EducationExpandedWrapper = styled(FlexContainer)<{ isInvisible: boolean }>`
  background: radial-gradient(92.11% 100% at 0% 0%, rgba(255, 252, 204, 0.08) 0%, rgba(255, 252, 204, 0) 100%), #252636;
  opacity: ${(props) => props.isInvisible ? '0' : '1'};
`;
