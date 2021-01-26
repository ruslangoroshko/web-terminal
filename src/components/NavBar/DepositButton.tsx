import React from 'react';
import { PrimaryButton } from '../../styles/Buttons';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import { useTranslation } from 'react-i18next';
import e2eTests from '../../constants/e2eTests';

function DepositButton() {
  const { depositFundsStore } = useStores();
  const { t } = useTranslation();
  return (
    <PrimaryButton
      onClick={depositFundsStore.togglePopup}
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
