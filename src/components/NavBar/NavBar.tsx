import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import MonfexLogo from '../../assets/svg/icon-logo.svg';
import MonfexLogoText from '../../assets/svg/icon-logo-text.svg';
import styled from '@emotion/styled';
import SwitchThemeButton from './SwitchThemeButton';
import NotificationsButton from './NotificationsButton';
import LanguageButton from './LanguageButton';
import UserProfileButton from './UserProfileButton';
import DepositButton from './DepositButton';
import { observer } from 'mobx-react-lite';
import SvgIcon from '../SvgIcon';
import AccountSwitcherDropdown from './AccountSwitcherDropdown';

const NavBar = observer(() => (
  <FlexContainer
    padding="8px 0 8px 20px"
    alignItems="center"
    width="100%"
    height="48px"
    justifyContent="space-between"
    zIndex="105"
  >
    <FlexContainer alignItems="center">
      <FlexContainer margin="0 6px 0 0">
        <SvgIcon {...MonfexLogo} fillColor="#00FFDD" />
      </FlexContainer>
      <SvgIcon {...MonfexLogoText} fillColor="#21B3A4" />
    </FlexContainer>
    <FlexContainer alignItems="center">
      <FlexContainer alignItems="center" margin="0 20px 0 0">
        <AccountSwitcherDropdown></AccountSwitcherDropdown>
      </FlexContainer>
      <FlexContainer margin="0 20px 0 0">
        <DepositButton />
      </FlexContainer>
      <UserProfileButton></UserProfileButton>
      <NavBarButtonsWrapper>
        <SwitchThemeButton></SwitchThemeButton>
      </NavBarButtonsWrapper>
      <NavBarButtonsWrapper>
        <LanguageButton></LanguageButton>
      </NavBarButtonsWrapper>
    </FlexContainer>
  </FlexContainer>
));
export default NavBar;

const NavBarButtonsWrapper = styled(FlexContainer)`
  border-left: 1px solid rgba(255, 255, 255, 0.08);

  padding: 0 8px;
  &:first-of-type {
    border-right: none;
  }
`;
