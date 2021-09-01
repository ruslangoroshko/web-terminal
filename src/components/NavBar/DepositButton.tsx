import React from 'react';
import { PrimaryButton } from '../../styles/Buttons';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { FlexContainer } from '../../styles/FlexContainer';
import { useTranslation } from 'react-i18next';
import e2eTests from '../../constants/e2eTests';
import { useHistory } from 'react-router';
import Page from '../../constants/Pages';
import IconGift from '../../assets/svg/icon-gift.svg';
import SvgIcon from '../SvgIcon';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';

const DepositButton = observer(() => {
  const { push } = useHistory();
  const { t } = useTranslation();
  const { bonusStore } = useStores();

  return (
    <StyledDepositButton
      onClick={() => push(Page.DEPOSIT_POPUP)}
      padding="8px 16px"
      data-e2e-id={e2eTests.DEPOSIT_BUTTON_NAVBAR}
      backgroundColor="#00FFF2"
    >
      {
        bonusStore.bonusIsLoaded &&
        bonusStore.bonusData !== null &&
        bonusStore.bonusData?.welcomeBonusExpirations !== null &&
        <FlexContainer margin="0 5px 4px 0">
          <SvgIcon height={13} width={13} fillColor="#003A38" {...IconGift} />
        </FlexContainer>
      }
      <PrimaryTextSpan fontSize="12px" color="#003A38" fontWeight="bold">
        {t('Deposit')}
      </PrimaryTextSpan>
    </StyledDepositButton>
  );
});

export default DepositButton;

const StyledDepositButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  max-height: 30px;
`;