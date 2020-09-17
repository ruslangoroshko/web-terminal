import React, { FC, useMemo } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
  QuoteText,
} from '../../styles/TextsElements';
import { AccountModelWebSocketDTO } from '../../types/AccountsTypes';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { PrimaryButton, SecondaryButton } from '../../styles/Buttons';
import { getNumberSign } from '../../helpers/getNumberSign';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconClose from '../../assets/svg/icon-close.svg';
import Topics from '../../constants/websocketTopics';
import Fields from '../../constants/fields';
import { useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';
import { useTranslation } from 'react-i18next';

interface Props {
  account: AccountModelWebSocketDTO;
  toggle: () => void;
}

const AccountInfo: FC<Props> = observer(props => {
  const { account, toggle } = props;

  const {
    quotesStore,
    mainAppStore,
    tabsStore,
    notificationStore,
    depositFundsStore,
  } = useStores();
  const { push } = useHistory();

  const { t } = useTranslation();

  const isActiveAccount = mainAppStore.activeAccount?.id === account.id;

  const handleSwitch = () => {
    mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
      [Fields.ACCOUNT_ID]: account.id,
    });
    tabsStore.sideBarTabType = null;
    mainAppStore.setActiveAccount(account);
    toggle();
    notificationStore.notificationMessage = `${t(
      'Your account has been switched on'
    )} ${account.isLive ? t('Real') : t('Demo')}`;
    notificationStore.isSuccessfull = true;
    notificationStore.openNotification();
    push(Page.DASHBOARD);
  };

  const profit = useMemo(() => quotesStore.profit, [quotesStore.profit]);

  return (
    <AccountWrapper
      flexDirection="column"
      isActive={isActiveAccount}
      padding="16px 44px 16px 16px"
      width="390px"
      position="relative"
    >
      {isActiveAccount && (
        <FlexContainer position="absolute" right="16px" top="16px">
          <ButtonWithoutStyles onClick={toggle}>
            <SvgIcon
              {...IconClose}
              fillColor="rgba(255,255,255, 0.4)"
              hoverFillColor="#00FFDD"
            />
          </ButtonWithoutStyles>
        </FlexContainer>
      )}
      <FlexContainer justifyContent="space-between">
        <FlexContainer>
          {/* <FlexContainer width="32px" height="32px" margin="0 12px 0 0">
            {t('Image')}
          </FlexContainer> */}
          <FlexContainer flexDirection="column">
            <FlexContainer margin="0 0 4px 0">
              <PrimaryTextSpan
                marginRight="8px"
                fontSize="12px"
                fontWeight="bold"
              >
                {account.id}, {account.currency}
              </PrimaryTextSpan>
              <FlexContainer
                borderRadius="3px"
                border={
                  account.isLive
                    ? '1px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid #EEFF00'
                }
                padding="0 4px"
              >
                <PrimaryTextSpan
                  fontSize="12px"
                  color={
                    account.isLive ? 'rgba(255, 255, 255, 0.4)' : '#EEFF00'
                  }
                >
                  {account.isLive ? t('Real') : t('Demo')}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
            <PrimaryTextSpan>
              {account.symbol}
              {account.balance.toFixed(2)}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
        {isActiveAccount ? (
          <PrimaryButton
            padding="8px 16px"
            onClick={depositFundsStore.togglePopup}
          >
            <PrimaryTextSpan fontSize="12px" color="#003A38" fontWeight="bold">
              {t('Deposit')}
            </PrimaryTextSpan>
          </PrimaryButton>
        ) : (
          <SwitchButton onClick={handleSwitch}>
            <PrimaryTextSpan color="#fffccc" fontSize="14px">
              {t('Switch')}
            </PrimaryTextSpan>
          </SwitchButton>
        )}
      </FlexContainer>
      {isActiveAccount && (
        <FlexContainer padding="0 0 0 44px">
          <FlexContainer
            width="60px"
            margin="0 24px 0 0"
            flexDirection="column"
          >
            <PrimaryTextParagraph
              fontSize="12px"
              marginBottom="4px"
              color="rgba(255, 255, 255, 0.5)"
            >
              {t('Invest')}
            </PrimaryTextParagraph>
            <PrimaryTextSpan fontSize="12px" color="#fffccc">
              {account.symbol}
              {quotesStore.invest.toFixed(2)}
            </PrimaryTextSpan>
          </FlexContainer>
          <FlexContainer
            width="60px"
            margin="0 24px 0 0"
            flexDirection="column"
          >
            <PrimaryTextParagraph
              fontSize="12px"
              marginBottom="4px"
              color="rgba(255, 255, 255, 0.5)"
            >
              {t('Profit')}:
            </PrimaryTextParagraph>

            <QuoteText fontSize="12px" isGrowth={profit >= 0}>
              {getNumberSign(profit)}
              {account.symbol}
              {Math.abs(profit).toFixed(2)}
            </QuoteText>
          </FlexContainer>
          <FlexContainer width="60px" flexDirection="column">
            <PrimaryTextParagraph
              fontSize="12px"
              marginBottom="4px"
              color="rgba(255, 255, 255, 0.5)"
            >
              {t('Total')}:
            </PrimaryTextParagraph>
            <PrimaryTextSpan fontSize="12px" color="#fffccc">
              {account.symbol}
              {quotesStore.total.toFixed(2)}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
      )}
    </AccountWrapper>
  );
});

export default AccountInfo;

const AccountWrapper = styled(FlexContainer)<{ isActive?: boolean }>`
  background: ${props =>
    props.isActive
      ? `radial-gradient(92.11% 100% at 0% 0%, rgba(255, 252, 204, 0.08) 0%, rgba(255, 252, 204, 0) 100%), rgba(255, 255, 255, 0.04)`
      : '#1C2026'};

  border-bottom: ${props =>
    props.isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.16)'};

  &:last-of-type {
    border-bottom: none;
  }
`;

const DepositButton = styled(PrimaryButton)`
  padding: 8px 16px;
`;

const SwitchButton = styled(SecondaryButton)`
  padding: 6px 16px;
`;
