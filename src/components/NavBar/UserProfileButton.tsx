import React, { useRef, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconUser from '../../assets/svg/icon-navbar-user.svg';
import ProfileDropdown from '../ProfileDropdown';

interface Props {}

function UserProfileButton(props: Props) {
  const {} = props;
  const [on, toggle] = useState(false);
  const wrapperRef = useRef<HTMLButtonElement>(null);
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
  });

  return (
    <UserProfileButtonWrapper ref={wrapperRef} onClick={handleToggle}>
      <SvgIcon {...IconUser} width={12} height={14} fillColor="#FFFFFF" />
      {on && (
        <FlexContainer position="absolute" top="100%" right="100%" zIndex="201">
          <ProfileDropdown></ProfileDropdown>
        </FlexContainer>
      )}
    </UserProfileButtonWrapper>
  );
}

export default UserProfileButton;

const UserProfileWrapper = styled(FlexContainer)`
  position: relative;
  margin-right: 16px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;

  &:hover {
    cursor: pointer;
  }
`;

const UserProfileButtonWrapper = styled(ButtonWithoutStyles)`
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-right: 16px;
  position: relative;
`;
