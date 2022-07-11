import React, { FC, useEffect } from 'react';
import styled from '@emotion/styled';
import SuccessImage from '../../../assets/images/success.png';

import { ButtonWithoutStyles } from '../../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../../styles/FlexContainer';
import { useHistory } from 'react-router-dom';
import Pages from '../../../constants/Pages';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../../constants/mixpanelEvents';
import Colors from '../../../constants/Colors';

interface Props {
  amount: number;
  currencySymbol?: string;
}

const DepositPaymentSuccess: FC<Props> = (props) => {
  const { amount, currencySymbol } = props;
  const { push } = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    mixpanel.track(mixpanelEvents.DEPOSIT_PAGE_SUCCESS);
  }, []);

  return (
    <>
      <FlexContainer flexDirection="column" alignItems="center">
        <FlexContainer
          marginBottom="40px"
          alignItems="center"
          justifyContent="center"
        >
          <img src={SuccessImage} width={138} />
        </FlexContainer>
        <SuccessText>{t('Success')}</SuccessText>
        <SuccessDescription>
          {t('The operation was succesful.')}
          <br />
          {t('The amount of')}{' '}
          <AmountText>
            {currencySymbol}
            {amount?.toFixed(2)}
          </AmountText>{' '}
          {t('has been added to')}
          <br />
          {t('your account')}
        </SuccessDescription>
      </FlexContainer>
      <FlexContainer padding="0 16px" width="100%">
        <TradeButton
          onClick={() => {
            push(Pages.DASHBOARD);
          }}
        >
          {t('Trade')}
        </TradeButton>
      </FlexContainer>
    </>
  );
};

export default DepositPaymentSuccess;

const TradeButton = styled(ButtonWithoutStyles)`
  background-color: ${Colors.PRIMARY};
  border-radius: 10px;
  width: 100%;
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
  color: ${Colors.DARK_BLACK};
`;

const SuccessText = styled.span`
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  color: ${Colors.WHITE};
  margin-bottom: 18px;
`;

const AmountText = styled.span`
  font-size: 13px;
  line-height: 16px;
  color: ${Colors.PRIMARY};
`;

const SuccessDescription = styled.span`
  font-size: 13px;
  line-height: 16px;
  text-align: center;
  color: ${Colors.WHITE_LIGHT};
  margin-bottom: 112px;
`;
