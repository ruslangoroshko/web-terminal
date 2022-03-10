import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import SvgIcon from '../SvgIcon';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import IconUser from '../../assets/svg/icon-navbar-user.svg';
import IconStatus from '../../assets/svg/icon-profile-status.svg';
import IconUserNotification from '../../assets/svg_no_compress/icon-profile-notifications.svg';
import ProfileDropdown from '../ProfileDropdown';
import { useStores } from '../../hooks/useStores';
import API from '../../helpers/API';
import { getProcessId } from '../../helpers/getProcessId';
import { PersonalDataKYCEnum } from '../../enums/PersonalDataKYCEnum';
import { Observer } from 'mobx-react-lite';

import BasicIMG from '../../assets/images/achievement_status_bg/new/basic_star.png';
import SilverIMG from '../../assets/images/achievement_status_bg/new/silver_star.png';
import GoldIMG from '../../assets/images/achievement_status_bg/new/gold_star.png';
import PlatinumIMG from '../../assets/images/achievement_status_bg/new/platinum_star.png';
import DiamondIMG from '../../assets/images/achievement_status_bg/new/diamond_star.png';
import VipIMG from '../../assets/images/achievement_status_bg/new/vip_star.png';

import OneSignal from 'react-onesignal';
import mixpanel from 'mixpanel-browser';
import KYCStatus from '../../constants/KYCStatus';
import mixapanelProps from '../../constants/mixpanelProps';
import IconShevron from '../../assets/svg/icon-shevron-down.svg';
import ColorsPallete from '../../styles/colorPallete';
import mixpanelEvents from '../../constants/mixpanelEvents';
import { AccountStatusEnum } from '../../enums/AccountStatusEnum';
import { getOneSignalAppId } from '../../helpers/getOneSignalAppId';

function UserProfileButton() {
  const { mainAppStore, phoneVerificationStore, accountTypeStore } = useStores();
  const [on, toggle] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleToggle = () => {
    toggle(!on);
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  const getStarLabel = useCallback(
    () => {
      const key = accountTypeStore.actualType?.type;
      switch (key) {
        case AccountStatusEnum.Gold:
          return GoldIMG;
        case AccountStatusEnum.Silver:
          return SilverIMG;
        case AccountStatusEnum.Vip:
          return VipIMG;
        case AccountStatusEnum.Platinum:
          return PlatinumIMG;
        case AccountStatusEnum.Diamond:
          return DiamondIMG;
        case AccountStatusEnum.Ultra:
          return VipIMG;
        default:
          return BasicIMG;
      }
    },
    [mainAppStore.activeAccount]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    async function fetchAdditionalFields() {
      try {
        const response = await API.getAdditionalSignUpFields(
          mainAppStore.initModel.authUrl
        );
        phoneVerificationStore.setShouldValidatePhone(!!response.length);
      } catch (error) {}
    }

    async function fetchPersonalData() {
      try {
        const response = await API.getPersonalData(
          getProcessId(),
          mainAppStore.initModel.authUrl
        );
        if (!response.data.phone) {
          fetchAdditionalFields();
        }
        mainAppStore.setProfileStatus(response.data.kyc);
        mainAppStore.setProfilePhone(response.data.phone || '');
        mainAppStore.setProfileName(!!response.data.firstName && !!response.data.lastName
          ? `${response.data.firstName} ${response.data.lastName}`
          : '');
        mainAppStore.setProfileEmail(response.data.email || '');
        const appIdOneSignal: string | null = getOneSignalAppId(location.href);
        if (appIdOneSignal) {
          await OneSignal.init({
            appId: appIdOneSignal
          });
          await OneSignal.setExternalUserId(response.data.id);
          OneSignal.getExternalUserId().then(function(externalUserId){
            console.log("externalUserId: ", externalUserId);
          });

          await OneSignal.registerForPushNotifications();
          console.log('registered');
          await OneSignal.getUserId().then(function(UserId: any){
            console.log("UserId: ", UserId);
          })
        }
        const setMixpanelEvents = async () => {
          mainAppStore.signUpFlag
            ? await mixpanel.alias(response.data.id)
            : await mixpanel.identify(response.data.id);
          mixpanel.people.set({
            [mixapanelProps.PHONE]: response.data.phone || '',
            [mixapanelProps.EMAIL]: response.data.email || '',
            [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandProperty,
            [mixapanelProps.TRADER_ID]: response.data.id || '',
            [mixapanelProps.FIRST_NAME]: response.data.firstName || '',
            [mixapanelProps.KYC_STATUS]: KYCStatus[response.data.kyc],
            [mixapanelProps.LAST_NAME]: response.data.lastName || '',
          });
          mixpanel.people.union({
            [mixapanelProps.PLATFORMS_USED]: 'web',
            [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandProperty,
          });

          if (mainAppStore.lpLoginFlag) {
            mixpanel.track(mixpanelEvents.SIGN_UP, {
              [mixapanelProps.BRAND_NAME]:
              mainAppStore.initModel.brandProperty,
            });
          }

          // mainAppStore.setSignUpFlag(false);
          // mainAppStore.setLpLoginFlag(false);
          // mainAppStore.setProfileStatus(response.data.kyc);
          // mainAppStore.setProfilePhone(response.data.phone || '');
          // mainAppStore.setProfileName(!!response.data.firstName && !!response.data.lastName
          //   ? `${response.data.firstName} ${response.data.lastName}`
          //   : '');
          // mainAppStore.setProfileEmail(response.data.email || '');
        };
        setMixpanelEvents();
      } catch (error) {}
    }
    fetchPersonalData();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <UserProfileButtonWrapper
      ref={wrapperRef}
      onClick={handleToggle}
      margin="0 8px 0 0"
      position="relative"
    >
      <Observer>
        {() => (
          <FlexContainer alignItems={'center'}>
            <FlexContainer
              width={'25px'}
              height={'25px'}
              justifyContent={'center'}
              alignItems={'center'}
              marginRight={'8px'}
              borderRadius={'50%'}
              position={'relative'}
            >
              <img src={getStarLabel()} width="24px" height="24px" />
              {(
                mainAppStore.profileStatus === PersonalDataKYCEnum.NotVerified ||
                mainAppStore.profileStatus === PersonalDataKYCEnum.Restricted ||
                mainAppStore.profileStatus === PersonalDataKYCEnum.OnVerification
              ) && (
                <FlexContainer
                  backgroundColor={
                    mainAppStore.profileStatus !== PersonalDataKYCEnum.OnVerification
                      ? ColorsPallete.RAZZMATAZZ
                      : ColorsPallete.STAR_BASIC
                  }
                  height="10px"
                  width="10px"
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  borderRadius="50%"
                  border="2px solid #1C2026"
                > </FlexContainer>
              )}
            </FlexContainer>
            <PrimaryTextSpan
              fontSize={'12px'}
              color={'#ffffff'}
              marginRight={'10px'}
            >
              Profile
            </PrimaryTextSpan>
            <FlexContainer
              justifyContent="center"
              alignItems="center"
              padding="5px"
            >
              <SvgIcon
                {...IconShevron}
                fillColor="rgba(255, 255, 255, 0.6)"
                width={6}
                height={4}
                transformProp={on ? 'rotate(180deg)' : ''}
              />
            </FlexContainer>
          </FlexContainer>
        )}
      </Observer>

      {on && (
        <FlexContainer position="absolute" top="160%" right="0" zIndex="201">
          <ProfileDropdown></ProfileDropdown>
        </FlexContainer>
      )}
    </UserProfileButtonWrapper>
  );
}

export default UserProfileButton;

const UserProfileButtonWrapper = styled(FlexContainer)`
  &:hover {
    cursor: pointer;
  }
`;
