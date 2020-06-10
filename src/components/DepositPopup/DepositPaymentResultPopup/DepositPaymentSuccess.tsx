import React, { FC } from 'react';
import styled from '@emotion/styled';
import SuccessImage from '../../../assets/images/success.png';

import { ButtonWithoutStyles } from '../../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../../styles/FlexContainer';
import { useHistory } from 'react-router-dom';
import Pages from "../../../constants/Pages";

interface Props {
  amount: number;
  currencySymbol?: string;
}

const DepositPaymentSuccess = (props: Props) => {
  const { amount, currencySymbol } = props;
  const { push } = useHistory();

  return (
    <>
      <FlexContainer flexDirection="column" alignItems="center">
        <FlexContainer marginBottom="40px">
          <img src={SuccessImage} width={138} />
        </FlexContainer>
        <SuccessText>Success</SuccessText>
        <SuccessDescription>
          The operation was succesful.
          <br />
          The amount of{' '}
          <AmountText>
            {currencySymbol}
            {amount?.toFixed(2)}
          </AmountText>{' '}
          has been added to
          <br />
          your account
        </SuccessDescription>
      </FlexContainer>
      <FlexContainer padding="0 16px" width="100%">
        <TradeButton onClick={() => {push(Pages.DASHBOARD)}}>Trade</TradeButton>
      </FlexContainer>
    </>
  );
};

export default DepositPaymentSuccess;

const TradeButton = styled(ButtonWithoutStyles)`
  background-color: #00ffdd;
  border-radius: 10px;
  width: 100%;
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #252636;
`;

const SuccessText = styled.span`
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  color: #ffffff;
  margin-bottom: 18px;
`;

const AmountText = styled.span`
  font-size: 13px;
  line-height: 16px;
  color: #00ffdd;
`;

const SuccessDescription = styled.span`
  font-size: 13px;
  line-height: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 112px;
`;