import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { SecondaryButton } from '../../styles/Buttons';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';

const WithdrawEmptyBalance = () => {
  const { depositFundsStore } = useStores();
  return (
    <FlexContainer
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      padding="30px 0"
    >
      <FlexContainer width="calc(100% - 220px)">
        <PrimaryTextSpan fontSize="14px" color="#FFFCCC" lineHeight="20px">
          Withdrawals are processed by the same payment systems used to deposit
          money into the system.
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer width="160px">
        <DeposteButton onClick={depositFundsStore.togglePopup}>
          <PrimaryTextSpan color="#fffccc" fontSize="14px">
            Make a deposit
          </PrimaryTextSpan>
        </DeposteButton>
      </FlexContainer>
    </FlexContainer>
  );
};

export default WithdrawEmptyBalance;

const DeposteButton = styled(SecondaryButton)`
  width: 100%;
  height: 40px;
`;
