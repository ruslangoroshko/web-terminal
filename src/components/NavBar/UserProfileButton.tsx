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
import mixpanel from 'mixpanel-browser';
import KYCStatus from '../../constants/KYCStatus';
import mixapanelProps from '../../constants/mixpanelProps';
import IconShevron from '../../assets/svg/icon-shevron-down.svg';
import AchievementStatus from '../../constants/achievementStatus';
import ColorsPallete from '../../styles/colorPallete';

function UserProfileButton() {
  const { mainAppStore, phoneVerificationStore } = useStores();
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

  const getBackgroundColor = useCallback(
    (type: string) => {
      const key = mainAppStore.activeAccount?.achievementStatus;
      switch (key) {
        case AchievementStatus.SILVER:
          return type === 'background'
            ? ColorsPallete.BACKGROUND_SILVER
            : ColorsPallete.STAR_OTHER;
        case AchievementStatus.GOLD:
          return type === 'background'
            ? ColorsPallete.BACKGROUND_GOLD
            : ColorsPallete.STAR_OTHER;
        case AchievementStatus.PLATINUM:
          return type === 'background'
            ? ColorsPallete.BACKGROUND_PLATINUM
            : ColorsPallete.STAR_OTHER;
        default:
          return type === 'background'
            ? ColorsPallete.BACKGROUND_BASIC
            : ColorsPallete.STAR_BASIC;
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
        mainAppStore.signUpFlag
          ? mixpanel.alias(response.data.id)
          : mixpanel.identify(response.data.id);
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

        mainAppStore.setSignUpFlag(false);
        mainAppStore.setProfileStatus(response.data.kyc);
        mainAppStore.profilePhone = response.data.phone || '';
        mainAppStore.profileName =
          !!response.data.firstName && !!response.data.lastName
            ? `${response.data.firstName} ${response.data.lastName}`
            : '';
        mainAppStore.profileEmail = response.data.email || '';
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
      margin="0 16px 0 0"
      position="relative"
    >
      <Observer>
        {() => (
          <FlexContainer alignItems={'center'}>
            <FlexContainer
              background={getBackgroundColor('background')}
              width={'25px'}
              height={'25px'}
              justifyContent={'center'}
              alignItems={'center'}
              marginRight={'8px'}
              borderRadius={'50%'}
              position={'relative'}
            >
              <SvgIcon
                {...IconStatus}
                fillColor={getBackgroundColor('star')}
                width={13}
                height={13}
              />
              {mainAppStore.profileStatus ===
                PersonalDataKYCEnum.NotVerified && (
                <FlexContainer
                  backgroundColor={ColorsPallete.RAZZMATAZZ}
                  height={'10px'}
                  width={'10px'}
                  position={'absolute'}
                  top={'0'}
                  right={'0'}
                  borderRadius={'50%'}
                  border={'2px solid #1C2026'}
                ></FlexContainer>
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
              padding="6px"
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
