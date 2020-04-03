import React from 'react';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import Toggle from '../Toggle';
import SvgIcon from '../SvgIcon';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import IconShevron from '../../assets/svg/icon-shevron-down.svg';
import AccountInfo from './AccountInfo';
import { Observer } from 'mobx-react-lite';

function AccountSwitcherDropdown() {
  const { quotesStore, mainAppStore } = useStores();
  return (
    <Toggle>
      {({ on, toggle }) => (
        <FlexContainer position="relative">
          <ButtonWithoutStyles onClick={toggle}>
            <FlexContainer>
              <FlexContainer flexDirection="column">
                <FlexContainer margin="0 0 2px 0">
                  <Observer>
                    {() => (
                      <PrimaryTextSpan
                        marginRight="8px"
                        color="#fffccc"
                        fontSize="16px"
                      >
                        {mainAppStore.activeAccount?.symbol}
                        {quotesStore.available.toFixed(2)}
                      </PrimaryTextSpan>
                    )}
                  </Observer>

                  <Observer>
                    {() => (
                      <FlexContainer
                        borderRadius="3px"
                        border={
                          mainAppStore.activeAccount?.isLive
                            ? '1px solid rgba(255, 255, 255, 0.4)'
                            : '1px solid #EEFF00'
                        }
                        padding="0 4px"
                        alignItems="center"
                      >
                        <PrimaryTextSpan
                          fontSize="12px"
                          color={
                            mainAppStore.activeAccount?.isLive
                              ? 'rgba(255, 255, 255, 0.4)'
                              : '#EEFF00'
                          }
                        >
                          {mainAppStore.activeAccount?.isLive ? 'Real' : 'Demo'}
                        </PrimaryTextSpan>
                      </FlexContainer>
                    )}
                  </Observer>
                </FlexContainer>
                <FlexContainer>
                  <PrimaryTextSpan
                    fontSize="11px"
                    color="rgba(255, 255, 255, 0.4)"
                    marginRight="2px"
                  >
                    Total:
                  </PrimaryTextSpan>
                  <Observer>
                    {() => (
                      <PrimaryTextSpan fontSize="11px" color="#fffccc">
                        {mainAppStore.activeAccount?.symbol}
                        {quotesStore.total.toFixed(2)}
                      </PrimaryTextSpan>
                    )}
                  </Observer>
                </FlexContainer>
              </FlexContainer>
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
                />
              </FlexContainer>
            </FlexContainer>
          </ButtonWithoutStyles>
          {on && (
            <FlexContainer
              position="absolute"
              top="-8px"
              left="-100%"
              flexDirection="column"
              zIndex="200"
              backgroundColor="#1C2026"
              borderRadius="0 0 8px 8px"
              overflow="hidden"
            >
              {mainAppStore.sortedAccounts.map(acc => (
                <AccountInfo
                  key={acc.id}
                  account={acc}
                  toggle={toggle}
                ></AccountInfo>
              ))}
            </FlexContainer>
          )}
        </FlexContainer>
      )}
    </Toggle>
  );
}

export default AccountSwitcherDropdown;
