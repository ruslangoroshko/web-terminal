import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconUser from '../../assets/svg/icon-navbar-user.svg';

interface Props {}

function UserProfileButton(props: Props) {
  const {} = props;

  return (
    <UserProfileWrapper
      justifyContent="center"
      alignItems="center"
      width="24px"
      height="24px"
    >
      <ButtonWithoutStyles>
        <SvgIcon {...IconUser} width={12} height={14} fillColor="#FFFFFF" />
      </ButtonWithoutStyles>
    </UserProfileWrapper>
  );
}

export default UserProfileButton;

const UserProfileWrapper = styled(FlexContainer)`
  position: relative;
  margin-right: 16px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
`;
