import React, { FC } from 'react';
import styled from '@emotion/styled';

import Modal from './Modal';
import { FlexContainer } from '../styles/FlexContainer';
import { useStores } from '../hooks/useStores';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import LoaderComponent from './LoaderComponent';

const MTErrorPopup: FC = observer(() => {
  const { accountTypeStore } = useStores();
  const { t } = useTranslation();

  if (accountTypeStore.showMTErrorPopup) {
    return (
      <Modal>
        <ModalBackground
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          alignItems="center"
          justifyContent="center"
          zIndex="1001"
        >
          <PopupWrap flexDirection="column" position="relative">
            <FlexContainer
              flexDirection="column"
              alignItems="center"
            >
              <PrimaryTextSpan
                fontSize="20px"
                lineHeight="150%"
                fontWeight="bold"
                color="#fff"
                marginBottom="1px"
              >
                {t('Something went wrong')}
              </PrimaryTextSpan>
              <PrimaryTextSpan
                fontSize="14px"
                lineHeight="150%"
                fontWeight={500}
                color="rgba(255, 255, 255, 0.64)"
                marginBottom="32px"
              >
                {t('Please wait while we processing your request')}
              </PrimaryTextSpan>
              <LoaderComponent />
            </FlexContainer>
          </PopupWrap>
        </ModalBackground>
      </Modal>
    );
  }
   return null;
});

export default MTErrorPopup;

const PopupWrap = styled(FlexContainer)`
  width: 392px;
  border-radius: 5px;
  background-color: #2F323C;
  padding: 48px 24px;
  box-shadow: 0px 34px 44px rgba(0, 0, 0, 0.25);
`;

const ModalBackground = styled(FlexContainer)`
  background-color: rgba(37, 38, 54, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(37, 38, 54, 0.6);
    backdrop-filter: blur(12px);
  }
`;
