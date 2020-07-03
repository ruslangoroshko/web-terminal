import React, { useRef, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import SvgIcon from '../SvgIcon';
import IconUser from '../../assets/svg/icon-navbar-user.svg';
import IconUserNotification from '../../assets/svg_no_compress/icon-profile-notifications.svg';
import ProfileDropdown from '../ProfileDropdown';
import { useStores } from '../../hooks/useStores';
import API from '../../helpers/API';
import { getProcessId } from '../../helpers/getProcessId';
import { PersonalDataKYCEnum } from '../../enums/PersonalDataKYCEnum';
import { Observer } from 'mobx-react-lite';
import { identify, people, Dict } from 'mixpanel-browser';
import KYCStatus from '../../constants/KYCStatus';
import mixpanelEvents from '../../constants/mixpanelEvents';

function UserProfileButton() {
  const { mainAppStore } = useStores();
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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    async function fetchPersonalData() {
      try {
        const response = await API.getPersonalData(getProcessId());
        identify(response.data.id);
        people.set({
          [mixpanelEvents.FIRST_NAME]: response.data.firstName || '',
          [mixpanelEvents.LAST_NAME]: response.data.lastName || '',
          [mixpanelEvents.BRAND_NAME]: mainAppStore.initModel.brandName || '',
          [mixpanelEvents.EMAIL]: response.data.email || '',
          [mixpanelEvents.AVATAR]: response.data.avatar || '',
          [mixpanelEvents.USER_KYC_STATUS]: KYCStatus[response.data.kyc],
          [mixpanelEvents.PHONE]: response.data.phone || '',
          [mixpanelEvents.LAST_LOGIN]: new Date().toISOString(),
        });
        mainAppStore.profileStatus = response.data.kyc;
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
          <>
            {mainAppStore.profileStatus === PersonalDataKYCEnum.NotVerified ? (
              <SvgIcon {...IconUserNotification} />
            ) : (
              <SvgIcon {...IconUser} fillColor="#FFFFFF" />
            )}
          </>
        )}
      </Observer>

      {on && (
        <FlexContainer position="absolute" top="100%" right="100%" zIndex="201">
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
