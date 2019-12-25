import React, { useContext } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import ColorsPallete from '../../styles/colorPallete';
import monfexLogo from '../../assets/images/monfex-logo.png';
import styled from '@emotion/styled';
import SwitchThemeButton from './SwitchThemeButton';
import NotificationsButton from './NotificationsButton';
import LanguageButton from './LanguageButton';
import UserProfileButton from './UserProfileButton';
import DepositButton from './DepositButton';
import MoreButton from './MoreButton';
import AccountBalances from './AccountBalances';
import { useStores } from '../../hooks/useStores';

interface Props {}

function NavBar(props: Props) {
  const {} = props;

  const { mainAppStore, quotesStore } = useStores();

  return (
    <FlexContainer
      padding="8px 0 8px 20px"
      alignItems="center"
      width="100%"
      height="48px"
      position="sticky"
      top="0"
      backgroundColor={ColorsPallete.BLUE_STONE}
      justifyContent="space-between"
      zIndex="105"
    >
      <FlexContainer alignItems="center">
        <img src={monfexLogo} alt="" width="100%" />
      </FlexContainer>
      <FlexContainer>
        <FlexContainer alignItems="center" margin="0 20px 0 0">
          {mainAppStore.account && (
            <AccountBalances
              available={mainAppStore.account.balance}
              symbol={mainAppStore.account.symbol}
              invest={mainAppStore.account.balance}
              profit={quotesStore.profit}
              total={mainAppStore.account.balance}
            />
          )}
        </FlexContainer>
        <FlexContainer margin="0 20px 0 0">
          <MoreButton></MoreButton>
        </FlexContainer>
        <FlexContainer margin="0 20px 0 0">
          <DepositButton />
        </FlexContainer>
        <UserProfileButton></UserProfileButton>
        <NavBarButtonsWrapper>
          <NotificationsButton></NotificationsButton>
        </NavBarButtonsWrapper>
        <NavBarButtonsWrapper>
          <SwitchThemeButton></SwitchThemeButton>
        </NavBarButtonsWrapper>
        <NavBarButtonsWrapper>
          <LanguageButton></LanguageButton>
        </NavBarButtonsWrapper>
      </FlexContainer>
    </FlexContainer>
  );
}

export default NavBar;

const NavBarButtonsWrapper = styled(FlexContainer)`
  border-left: 1px solid rgba(255, 255, 255, 0.08);

  padding: 0 8px;
  &:first-of-type {
    border-right: none;
  }
`;
