import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import SvgIcon from '../components/SvgIcon';
import IconClose from '../assets/svg/icon-close.svg';
import IconPlus from '../assets/svg/icon-plus.svg';
import MT5Logo from '../assets/images/logo_MT5.png';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { PrimaryTextSpan } from '../styles/TextsElements';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import { useHistory } from 'react-router-dom';
import Page from '../constants/Pages';
import { useStores } from '../hooks/useStores';
import { observer } from 'mobx-react-lite';
import AccountMTItem from '../components/AccountMTItem';

const AccountMT = observer(() => {
  const { t } = useTranslation();

  const { mainAppStore } = useStores();
  const { push } = useHistory();

  const closePage = () => {
    push(Page.DASHBOARD);
  };

  return (
    <AccountSettingsContainer>
      <FlexContainer
        width="100%"
        maxWidth="1064px"
        margin="0"
        flexDirection="column"
      >
        <IconButton onClick={closePage}>
          <SvgIcon
            {...IconClose}
            fillColor="rgba(255, 255, 255, 0.6)"
            hoverFillColor="#00FFF2"
            width="16px"
            height="16px"
          />
        </IconButton>
        <AccountMTItem
          isST={true}
          bonus={400}
          balance={10000}
          margin={1000}
          icon={mainAppStore.initModel.favicon}
          tradingLink={Page.DASHBOARD}
          depositLink={Page.DEPOSIT_POPUP}
        />
        {
          mainAppStore.isPromoAccount
            ? <AccountMTItem
              isST={false}
              bonus={300}
              balance={4000}
              margin={600}
              icon={MT5Logo}
              tradingLink={Page.DASHBOARD}
              depositLink={Page.DEPOSIT_POPUP}
              server="SwissSVG-Live"
              login="61561156"
            />
            : <FlexContainer
              padding="48px 36px"
              background="rgba(255, 255, 255, 0.04)"
              border="1px dashed rgba(255, 255, 255, 0.64)"
              borderRadius="5px"
              width="100%"
              alignItems="center"
            >
              <FlexContainer marginRight="36px">
                <SvgIcon
                  {...IconPlus}
                  fillColor="none"
                />
              </FlexContainer>
              <PrimaryTextSpan
                fontWeight={500}
                fontSize="20px"
                lineHeight="150%"
                color="#FFFCCC"
              >
                {t('Create MT5 Account')}
              </PrimaryTextSpan>
            </FlexContainer>
        }
      </FlexContainer>
    </AccountSettingsContainer>
  );
});

export default AccountMT;

const IconButton = styled(ButtonWithoutStyles)`
  margin-right: 8px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  &:last-of-type {
    margin-right: 0;
  }
`;
