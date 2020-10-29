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
import { useTranslation } from 'react-i18next';
import AccountTotal from './AccountTotal';
import styled from '@emotion/styled';

function AccountSwitcherDropdown() {
  const { mainAppStore } = useStores();
  const { t } = useTranslation();
  return (
    <Toggle>
      {({ on, toggle }) => (
        <FlexContainer position="relative">
          <ButtonSwitcher onClick={toggle}>
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
                        {mainAppStore.activeAccount?.balance.toFixed(2)}
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
                    {t('Total')}:
                  </PrimaryTextSpan>
                  <AccountTotal />
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
          </ButtonSwitcher>
          {on && (
            <FlexContainer
              backgroundColor="rgba(21, 22, 25, 0.9)"
              position="fixed"
              top="0"
              left="0"
              width="100vw"
              height="100vh"
              zIndex="198"
            >
            </FlexContainer>
          )}
          {on && (
            <Observer>
              {() => (
                <FlexContainer
                  position="absolute"
                  top="100%"
                  right="0"
                  flexDirection="column"
                  zIndex="200"
                  backgroundColor="#1C2026"
                  borderRadius="5px"
                  overflow="hidden"
                  boxShadow="0px 34px 44px rgba(0, 0, 0, 0.25)"
                >
                  {mainAppStore.sortedAccounts.map((acc) => (
                    <AccountInfo
                      key={acc.id}
                      account={acc}
                      toggle={toggle}
                    ></AccountInfo>
                  ))}
                </FlexContainer>
              )}
            </Observer>
          )}
        </FlexContainer>
      )}
    </Toggle>
  );
}

export default AccountSwitcherDropdown;

const ButtonSwitcher = styled(ButtonWithoutStyles)`
  position: relative;
  z-index: 199;
`;
