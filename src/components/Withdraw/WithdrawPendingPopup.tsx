import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { PrimaryButton } from '../../styles/Buttons';
import { useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';
import API from '../../helpers/API';
import { getProcessId } from '../../helpers/getProcessId';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';

const WithdrawPendingPopup = () => {
  const { push } = useHistory();

  const { t } = useTranslation();

  const { mainAppStore } = useStores();

  const [userEmail, setEmail] = useState('');

  useEffect(() => {
    async function fetchPersonalData() {
      try {
        const response = await API.getPersonalData(
          getProcessId(),
          mainAppStore.initModel.authUrl
        );
        setEmail(response.data.email);
      } catch (error) {}
    }
    fetchPersonalData();
  }, []);

  return (
    <WithdrawPagePopupWrap alignItems="flex-start">
      <WithdrawPopup
        width="100%"
        padding="16px 20px"
        justifyContent="space-between"
        alignItems="center"
      >
        <FlexContainer padding="0 40px 0 0">
          <PrimaryTextSpan fontSize="14px" color="#ffffff" lineHeight="20px">
            {t('Our Customer support will contact you via')} &nbsp;
            <PrimaryTextSpan color="#FFFCCC">
              {userEmail || 'your@email.com'}{' '}
            </PrimaryTextSpan>
            {t('to confirm and proceed with your withdrawal request.')}{' '}
            {t(
              'Please be note, that you can submit only one withdrawal request at a time'
            )}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer>
          <PrimaryButton
            width="186px"
            padding="12px"
            type="submit"
            onClick={() => push(Page.DASHBOARD)}
          >
            <PrimaryTextSpan color="#1c2026" fontWeight="bold" fontSize="14px">
              {t('Back to Trading')}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      </WithdrawPopup>
    </WithdrawPagePopupWrap>
  );
};

export default WithdrawPendingPopup;

const WithdrawPagePopupWrap = styled(FlexContainer)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    backdrop-filter: blur(3px);
  }
`;

const WithdrawPopup = styled(FlexContainer)`
  background: #23252c;
  border: 1px solid rgba(112, 113, 117, 0.5);
  border-radius: 4px;
`;
