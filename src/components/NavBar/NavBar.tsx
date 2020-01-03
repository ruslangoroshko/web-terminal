import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import MonfexLogo from '../../assets/svg/logo-monfex.svg';
import styled from '@emotion/styled';
import SwitchThemeButton from './SwitchThemeButton';
import NotificationsButton from './NotificationsButton';
import LanguageButton from './LanguageButton';
import UserProfileButton from './UserProfileButton';
import DepositButton from './DepositButton';
import MoreButton from './MoreButton';
import AccountBalances from './AccountBalances';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import SvgIcon from '../SvgIcon';

interface Props {}

const NavBar: FC<Props> = observer(props => {
  const { mainAppStore, quotesStore } = useStores();

  return (
    <FlexContainer
      padding="8px 0 8px 20px"
      alignItems="center"
      width="100%"
      height="48px"
      position="sticky"
      top="0"
      justifyContent="space-between"
      zIndex="105"
    >
      <FlexContainer alignItems="center">
        <SvgIcon {...MonfexLogo} fill="#21B3A4" />
      </FlexContainer>
      <FlexContainer>
        <FlexContainer alignItems="center" margin="0 20px 0 0">
          {mainAppStore.account && (
            <AccountBalances
              available={quotesStore.available}
              symbol={mainAppStore.account.symbol}
              invest={quotesStore.invest}
              profit={quotesStore.profit}
              total={quotesStore.total}
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
});
export default NavBar;

const NavBarButtonsWrapper = styled(FlexContainer)`
  border-left: 1px solid rgba(255, 255, 255, 0.08);

  padding: 0 8px;
  &:first-of-type {
    border-right: none;
  }
`;
