import React, { useCallback } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { useStores } from '../hooks/useStores';
import styled from '@emotion/styled';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import { NavLink, useHistory } from 'react-router-dom';
import Page from '../constants/Pages';
import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';
import { useTranslation } from 'react-i18next';
import IconUser from '../assets/svg/icon-user-logo.svg';
import AchievementStatus from '../constants/achievementStatus';
import SilverBG from '../assets/images/achievement_status_bg/silver.png';
import GoldBG from '../assets/images/achievement_status_bg/gold.png';
import PlatinumBG from '../assets/images/achievement_status_bg/platinum.png';
import UltraBG from '../assets/images/achievement_status_bg/ultra.png';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import e2eTests from '../constants/e2eTests';
import { observable } from 'mobx';
import { Observer, observer } from 'mobx-react-lite';

const ProfileDropdown = observer(() => {
  const { mainAppStore, depositFundsStore, tabsStore } = useStores();
  const { t } = useTranslation();
  const { push } = useHistory();

  const getStatusLabel = useCallback(
    (type?: string) => {
      const key = mainAppStore.accounts.find((acc) => acc.isLive)
        ?.achievementStatus;
      switch (key) {
        case AchievementStatus.SILVER:
          return type === 'color' ? '#C5DDF1' : SilverBG;
        case AchievementStatus.GOLD:
          return type === 'color' ? '#fffccc' : GoldBG;
        case AchievementStatus.PLATINUM:
          // return type === 'color' ? '#00ffdd' : PlatinumBG;
          return type === 'color' ? '#AE88FF' : UltraBG;
        default:
          return type === 'color' ? '#C5DDF1' : SilverBG;
      }
    },
    [mainAppStore.accounts]
  );

  const renderStatusLabel = () => {
    switch (mainAppStore.profileStatus) {
      case PersonalDataKYCEnum.NotVerified:
        return (
          <FlexContainer margin="20px 0 0" width="100%">
            <CustomeNavLink to={Page.PROOF_OF_IDENTITY}>
              <VerificationButton
                borderRadius="5px"
                backgroundColor="#ED145B"
                height="21px"
                alignItems="center"
                width="100%"
                justifyContent="center"
              >
                <PrimaryTextSpan color="#ffffff" fontSize="10px">
                  {t('Not Verified')}
                </PrimaryTextSpan>
              </VerificationButton>
            </CustomeNavLink>
          </FlexContainer>
        );

      case PersonalDataKYCEnum.Verified:
      case PersonalDataKYCEnum.OnVerification:
        return null;

      default:
        return null;
    }
  };
  const handleLogoutClick = () => {
    tabsStore.closeAnyTab();
    mixpanel.track(mixpanelEvents.LOGOUT, {
      [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandProperty,
    });
    mainAppStore.signOut();
  };

  return (
    <FlexContainer
      backgroundColor="#1C1F26"
      padding="0 32px 20px"
      borderRadius="5px"
      flexDirection="column"
      width="286px"
      border="1px solid rgba(169, 171, 173, 0.1)"
      boxShadow="0px 34px 44px rgba(0, 0, 0, 0.25)"
    >
      {!mainAppStore.isPromoAccount &&
        (mainAppStore.accounts.find((acc) => acc.isLive)?.achievementStatus ===
          AchievementStatus.GOLD ||
          mainAppStore.accounts.find((acc) => acc.isLive)?.achievementStatus ===
            AchievementStatus.SILVER ||
          mainAppStore.accounts.find((acc) => acc.isLive)?.achievementStatus ===
            AchievementStatus.PLATINUM) && (
          <StatusLabel
            width="124px"
            height="24px"
            padding="5px"
            borderRadius="0 0 12px 12px"
            alignItems="center"
            justifyContent="center"
            margin="0 auto"
            background={`url(${getStatusLabel()})`}
          >
            <PrimaryTextSpan
              fontSize="12px"
              textTransform="uppercase"
              color={getStatusLabel('color')}
              fontWeight={500}
            >
              {mainAppStore.accounts.find((acc) => acc.isLive)
                ?.achievementStatus === AchievementStatus.PLATINUM
                // ? AchievementStatus.VIP
                ? AchievementStatus.ULTRA
                : mainAppStore.accounts.find((acc) => acc.isLive)
                    ?.achievementStatus}
            </PrimaryTextSpan>
          </StatusLabel>
        )}
      <FlexWithBottomBorder
        flexDirection="column"
        padding="0 0 18px"
        margin="20px 0"
        width="100%"
      >
        <FlexContainer alignItems="center">
          <FlexContainer
            borderRadius="50%"
            width="40px"
            height="40px"
            justifyContent="center"
            alignItems="center"
            marginRight="8px"
            backgroundColor="#77797D"
          >
            <SvgIcon
              width={25}
              height={25}
              {...IconUser}
              fillColor="rgba(196, 196, 196, 0.5)"
            />
          </FlexContainer>
          <FlexContainer flexDirection="column" width="calc(100% - 50px)">
            {!!mainAppStore.profileName.length && (
              <PrimaryTextSpan
                fontSize="12px"
                color="#fffccc"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                title={mainAppStore.profileName}
              >
                {mainAppStore.profileName}
              </PrimaryTextSpan>
            )}
            <PrimaryTextSpan
              fontSize="12px"
              color="rgba(255, 255, 255, 0.4)"
              overflow="hidden"
              textOverflow="ellipsis"
              title={mainAppStore.profileEmail}
            >
              {mainAppStore.profileEmail}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
        {!mainAppStore.isPromoAccount && renderStatusLabel()}
      </FlexWithBottomBorder>
      <FlexContainer margin="0 0 12px">
        <CustomeNavLink to={Page.ACCOUNT_SEQURITY}>
          <PrimaryTextSpan fontSize="13px" color="rgba(255, 255, 255, 0.5)">
            {t('Account Settings')}
          </PrimaryTextSpan>
        </CustomeNavLink>
      </FlexContainer>

      {!mainAppStore.isPromoAccount && (
        <>
          <FlexContainer margin="0 0 12px">
            <DepositButtonWrapper onClick={() => push(Page.DEPOSIT_POPUP)}>
              <PrimaryTextSpan fontSize="13px" color="rgba(255, 255, 255, 0.5)">
                {t('Deposit')}
              </PrimaryTextSpan>
            </DepositButtonWrapper>
          </FlexContainer>
          <FlexContainer margin="0 0 12px">
            <CustomeNavLink
              to={Page.ACCOUNT_WITHDRAW}
              activeClassName="is-active"
            >
              <PrimaryTextSpan fontSize="13px" color="rgba(255, 255, 255, 0.5)">
                {t('Withdraw')}
              </PrimaryTextSpan>
            </CustomeNavLink>
          </FlexContainer>
          <FlexContainer margin="0 0 12px">
            <CustomeNavLink to={Page.ACCOUNT_BALANCE_HISTORY}>
              <PrimaryTextSpan fontSize="13px" color="rgba(255, 255, 255, 0.5)">
                {t('Balance history')}
              </PrimaryTextSpan>
            </CustomeNavLink>
          </FlexContainer>
          <FlexContainer margin="0 0 12px">
            <CustomeNavLink to={Page.BONUS_FAQ}>
              <PrimaryTextSpan fontSize="13px" color="rgba(255, 255, 255, 0.5)">
                {t('Bonus FAQ')}
              </PrimaryTextSpan>
            </CustomeNavLink>
          </FlexContainer>
        </>
      )}

      <FlexContainer flexDirection="column">
        <LogoutButton onClick={handleLogoutClick}>
          <PrimaryTextSpan fontSize="13px" color="rgba(255, 255, 255, 0.5)">
            {t('Logout')}
          </PrimaryTextSpan>
        </LogoutButton>
      </FlexContainer>
    </FlexContainer>
  );
});

export default ProfileDropdown;

const FlexWithBottomBorder = styled(FlexContainer)`
  border-bottom: 1px solid rgba(112, 113, 117, 0.5);
`;

const VerificationButton = styled(FlexContainer)`
  transition: 0.4;
  &:hover {
    background-color: #ff557e;
  }
`;

const StatusLabel = styled(FlexContainer)`
  border: 1px solid rgba(169, 171, 173, 0.1);
  border-top: 0;
  background-repeat: no-repeat;
  background-size: cover;
`;

const LogoutButton = styled(ButtonWithoutStyles)`
  display: flex;
  justify-content: space-between;
  span {
    transition: 0.4s;
  }
  &:hover {
    span {
      color: #fffccc;
    }
  }
`;

const CustomeNavLink = styled(NavLink)`
  display: block;
  width: 100%;
  span {
    transition: 0.4s;
  }
  &:hover {
    span {
      color: #fffccc;
    }
  }
  &:hover,
  &:active,
  &:focus,
  &:visited {
    text-decoration: none;
  }
`;

const DepositButtonWrapper = styled(ButtonWithoutStyles)`
  span {
    transition: 0.4s;
  }
  &:hover {
    span {
      color: #fffccc;
    }
  }
`;
