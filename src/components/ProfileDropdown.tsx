import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { useStores } from '../hooks/useStores';
import styled from '@emotion/styled';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import IconDeposit from '../assets/svg/icon-deposit.svg';
import IconWithdraw from '../assets/svg/icon-withdraw.svg';
import IconLogout from '../assets/svg/icon-logout.svg';
import { NavLink } from 'react-router-dom';
import Page from '../constants/Pages';

interface Props {}

function ProfileDropdown(props: Props) {
  const {} = props;

  const { mainAppStore } = useStores();
  const logOut = () => {
    mainAppStore.signOut();
  };

  return (
    <FlexContainer
      backgroundColor="#1c2026"
      padding="16px"
      borderRadius="4px"
      flexDirection="column"
      width="172px"
      boxShadow="box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.24), 0px 8px 16px rgba(37, 38, 54, 0.6)"
    >
      <FlexWithBottomBorder
        margin="0 0 16px 0"
        padding="0 0 16px 0"
        alignItems="center"
      >
        <PrimaryTextSpan fontSize="12px" color="#fffccc">
          Profile
        </PrimaryTextSpan>
      </FlexWithBottomBorder>
      <FlexWithBottomBorder
        margin="0 0 16px 0"
        padding="0 0 16px 0"
        flexDirection="column"
      >
        <FlexContainer justifyContent="space-between" margin="0 0 16px 0">
          <PrimaryTextSpan fontSize="12px" color="#fffccc">
            Deposit
          </PrimaryTextSpan>
          <SvgIcon {...IconDeposit} fillColor="rgba(255, 255, 255, 0.6)" />
        </FlexContainer>
        <FlexContainer justifyContent="space-between">
          <PrimaryTextSpan fontSize="12px" color="#fffccc">
            Withdraw
          </PrimaryTextSpan>
          <SvgIcon {...IconWithdraw} fillColor="rgba(255, 255, 255, 0.6)" />
        </FlexContainer>
      </FlexWithBottomBorder>
      <FlexWithBottomBorder
        margin="0 0 16px 0"
        padding="0 0 16px 0"
        flexDirection="column"
      >
        <FlexContainer margin="0 0 16px">
          <NavLink to={Page.ACCOUNT_BALANCE_HISTORY}>
            <PrimaryTextSpan fontSize="12px" color="#fffccc">
              Balance history
            </PrimaryTextSpan>
          </NavLink>
        </FlexContainer>
        <FlexContainer margin="0 0 16px">
          <PrimaryTextSpan fontSize="12px" color="#fffccc">
            Settings
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer>
          <PrimaryTextSpan fontSize="12px" color="#fffccc">
            Historical quotes
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexWithBottomBorder>
      <FlexContainer flexDirection="column">
        <LogoutButton onClick={logOut}>
          <PrimaryTextSpan fontSize="12px" color="#fffccc">
            Logout
          </PrimaryTextSpan>
          <SvgIcon {...IconLogout} fillColor="rgba(255, 255, 255, 0.6)" />
        </LogoutButton>
      </FlexContainer>
    </FlexContainer>
  );
}

export default ProfileDropdown;

const FlexWithBottomBorder = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

const LogoutButton = styled(ButtonWithoutStyles)`
  display: flex;
  justify-content: space-between;
`;
