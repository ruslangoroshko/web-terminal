import React, { useRef, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import SvgIcon from '../SvgIcon';
import IconUser from '../../assets/svg/icon-navbar-user.svg';
import ProfileDropdown from '../ProfileDropdown';

function UserProfileButton() {
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <UserProfileButtonWrapper
      ref={wrapperRef}
      onClick={handleToggle}
      width="24px"
      height="24px"
      alignItems="center"
      justifyContent="center"
      borderRadius="50%"
      margin="0 16px 0 0"
      position="relative"
      backgroundColor="rgba(255, 255, 255, 0.2)"
    >
      <FlexContainer position="relative">
        <SvgIcon {...IconUser} width={12} height={14} fillColor="#FFFFFF" />
      </FlexContainer>
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
