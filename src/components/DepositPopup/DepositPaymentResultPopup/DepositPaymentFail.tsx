import React, { FC, useEffect } from 'react';
import styled from '@emotion/styled';

import FailImage from '../../../assets/images/fail.png';
import { FlexContainer } from '../../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../../styles/ButtonWithoutStyles';
import { useHistory } from 'react-router-dom';
import Pages from '../../../constants/Pages';
import HashLocation from '../../../constants/hashLocation';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../../constants/mixpanelEvents';
import Colors from '../../../constants/Colors';

const DepositPaymentFail: FC = () => {
  const { push } = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    mixpanel.track(mixpanelEvents.DEPOSIT_PAGE_FAILED);
  }, []);

  return (
    <>
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        marginBottom="112px"
      >
        <FlexContainer
          marginBottom="40px"
          alignItems="center"
          justifyContent="center"
        >
          <img src={FailImage} width={138} />
        </FlexContainer>
        <FailText>{t('Insufficient funds')}</FailText>
        <FailDescription>
          {t('Please, use another payment method or')}
          <br />
          {t('change deposit amount')}
        </FailDescription>
      </FlexContainer>
      <FlexContainer padding="0 16px" width="100%">
        <OtherMethodsButton
          onClick={() => {
            push(`${Pages.DASHBOARD}${HashLocation.Deposit}`);
          }}
        >
          {t('Back to Deposit')}
        </OtherMethodsButton>
      </FlexContainer>
    </>
  );
};

export default DepositPaymentFail;

const OtherMethodsButton = styled(ButtonWithoutStyles)`
  background-color: ${Colors.PRIMARY};
  border-radius: 10px;
  width: 100%;
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
  color: ${Colors.DARK_BLACK};
`;

const FailText = styled.span`
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  color: ${Colors.WHITE};
  margin-bottom: 18px;
`;

const FailDescription = styled.span`
  font-size: 13px;
  line-height: 16px;
  text-align: center;
  color: ${Colors.WHITE_LIGHT};
`;
