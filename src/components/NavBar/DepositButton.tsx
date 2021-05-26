import React from 'react';
import { PrimaryButton } from '../../styles/Buttons';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import e2eTests from '../../constants/e2eTests';
import { useHistory } from 'react-router';
import Page from '../../constants/Pages';

function DepositButton() {
  const {push} = useHistory();
  const { t } = useTranslation();
  return (
    <PrimaryButton
      onClick={() => push(Page.DEPOSIT_POPUP)}
      padding="8px 16px"
      data-e2e-id={e2eTests.DEPOSIT_BUTTON_NAVBAR}
      backgroundColor="#00FFF2"
    >
      <PrimaryTextSpan fontSize="12px" color="#003A38" fontWeight="bold">
        {t('Deposit')}
      </PrimaryTextSpan>
    </PrimaryButton>
  );
}

export default DepositButton;
