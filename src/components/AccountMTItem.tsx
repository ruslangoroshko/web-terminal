import React, { FC } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import SvgIcon from './SvgIcon';
import IconTrending from '../assets/svg/icon-trending-up.svg';
import { PrimaryButton } from '../styles/Buttons';
import { useTranslation } from 'react-i18next';
import { useStores } from '../hooks/useStores';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Topics from '../constants/websocketTopics';
import Fields from '../constants/fields';

interface Props {
  isST: boolean,
  bonus: string,
  balance: string,
  margin: string,
  server?: string,
  login?: string,
  icon: string,
  depositLink: string,
  tradingLink: string,
}

const AccountMTItem: FC<Props> = observer((props) => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const { isST, balance, bonus, margin, server, login, icon, depositLink, tradingLink } = props;
  const { mainAppStore, tabsStore } = useStores();

  const handleClickDeposit = () => {
    push(depositLink);
  };

  const handleClickTrading = () => {
    const acc = mainAppStore.accounts.find((item) => item.isLive);
    if (isST) {
      if (acc) {
        mainAppStore.setActiveAccount(acc);
        mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: acc.id,
        });
      }
      push(tradingLink);
    } else {
      // @ts-ignore
      window.open(`${tradingLink}`, '_blank').focus();
    }
  };

  return (
    <FlexContainer
      padding="20px 24px"
      background="rgba(255, 255, 255, 0.12)"
      border="1px solid rgba(255, 255, 255, 0.04)"
      borderRadius="5px"
      width="100%"
      alignItems="center"
      position="relative"
      justifyContent="space-between"
      marginBottom="16px"
    >
      <FlexContainer
        position="absolute"
        top="-1px"
        left="104px"
        padding="3px 24px"
        background="#1C1F26"
        border="1px solid rgba(255, 255, 255, 0.04)"
        borderRadius="0 0 5px 5px"
      >
        <PrimaryTextSpan
          fontSize="12px"
          lineHeight="150%"
          color="#00FFDD"
          textTransform="uppercase"
        >
          {isST ? mainAppStore.initModel.brandName : t('MT5 Standart')}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer alignItems="center">
        <FlexContainer marginRight="24px">
          <img src={icon} width="56px" height="56px" />
        </FlexContainer>
        <FlexContainer
          flexDirection="column"
          marginRight="16px"
          minWidth="188px"
        >
          <MTText marginBottom="9px">
            {t('Balance')}
          </MTText>
          <PrimaryTextSpan
            fontWeight={500}
            fontSize="32px"
            lineHeight="100%"
            color="#FFFCCC"
          >
            ${balance}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer
          flexDirection={tabsStore.sideBarTabType !== null ? 'column' : 'row'}
        >
          <FlexContainer
            flexDirection="column"
            marginRight="20px"
            marginBottom={tabsStore.sideBarTabType !== null ? '12px' : '0'}
            minWidth="100px"
          >
            <MTText marginBottom="16.5px">
              {t('Margin')}
            </MTText>
            <PrimaryTextSpan
              fontSize="24px"
              lineHeight="100%"
              color="#FFF"
            >
              ${margin}
            </PrimaryTextSpan>
          </FlexContainer>
          <FlexContainer
            flexDirection="column"
            marginRight="20px"
            minWidth="100px"
          >
            <MTText marginBottom="16.5px">
              {t('Bonus')}
            </MTText>
            <PrimaryTextSpan
              fontSize="24px"
              lineHeight="100%"
              color="#FFF"
            >
              ${bonus}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
        {(!isST && server && login) && <FlexContainer
          flexDirection="column"
          marginRight="20px"
        >
          <MTText marginBottom="17.5px">
            {t('Login info')}
          </MTText>
          <FlexContainer
            flexDirection={tabsStore.sideBarTabType !== null ? 'column' : 'row'}
          >
            <InfoWrapper
              marginRight="12px"
              marginBottom={tabsStore.sideBarTabType !== null ? '12px' : '0'}
            >
              <PrimaryTextSpan
                fontSize="12px"
                lineHeight="100%"
                color="rgba(255, 255, 255, 0.64)"
                marginRight="8px"
              >
                {t('Login')}:
              </PrimaryTextSpan>
              <PrimaryTextSpan
                fontSize="12px"
                lineHeight="100%"
                fontWeight={500}
                color="#fff"
              >
                {login}
              </PrimaryTextSpan>
            </InfoWrapper>
            <InfoWrapper>
              <PrimaryTextSpan
                fontSize="12px"
                lineHeight="100%"
                color="rgba(255, 255, 255, 0.64)"
                marginRight="8px"
              >
                {t('Server name')}:
              </PrimaryTextSpan>
              <PrimaryTextSpan
                fontSize="12px"
                lineHeight="100%"
                fontWeight={500}
                color="#fff"
              >
                {server}
              </PrimaryTextSpan>
            </InfoWrapper>
          </FlexContainer>
        </FlexContainer>}
      </FlexContainer>
      <FlexContainer
        flexDirection="column"
        height="88px"
        justifyContent="space-between"
      >
        <MTButton
          type="button"
          width="94px"
          padding="7.5px"
          backgroundColor="#1C1F26"
          className="deposit"
          onClick={handleClickDeposit}
        >
          <PrimaryTextSpan
            color="#fff"
            fontWeight={700}
            fontSize="14px"
            lineHeight="21px"
          >
            {t('Deposit')}
          </PrimaryTextSpan>
        </MTButton>
        <MTButton
          type="button"
          width="94px"
          padding="7.5px"
          backgroundColor="#00FFDD"
          onClick={handleClickTrading}
        >
          <FlexContainer marginRight="8px">
            <SvgIcon
              {...IconTrending}
              fillColor="none"
            />
          </FlexContainer>
          <PrimaryTextSpan
            color="#1C1F26"
            fontWeight={700}
            fontSize="14px"
            lineHeight="21px"
          >
            {t('Trade')}
          </PrimaryTextSpan>
        </MTButton>
      </FlexContainer>
    </FlexContainer>
  );
});

export default AccountMTItem;

const MTButton = styled(PrimaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  &.deposit {
    &:hover {
      background: rgba(0, 0, 0, 0.4);
    }
  }
`;

const MTText = styled(PrimaryTextSpan)`
  font-size: 13px;
  line-height: 100%;
  color: rgba(255, 255, 255, 0.64);
  text-transform: uppercase;
`;

const InfoWrapper = styled(FlexContainer)`
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 5px;
  padding: 6px 12px;
`;