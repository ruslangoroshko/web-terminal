import React, { useState, useEffect, useRef } from 'react';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import Toggle from '../Toggle';
import SvgIcon from '../SvgIcon';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import IconShevron from '../../assets/svg/icon-shevron-down.svg';
import AccountInfo from './AccountInfo';
import { observer, Observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import AccountTotal from './AccountTotal';
import styled from '@emotion/styled';
import { moneyFormat, moneyFormatPart } from '../../helpers/moneyFormat';
import { logger } from '../../helpers/ConsoleLoggerTool';

const AccountSwitcherDropdown = observer(() => {
  const { mainAppStore } = useStores();
  const { t } = useTranslation();
  const [balance, setBalance] = useState<number>(0);
  const [accountId, setAccountId] = useState<string>('');

  const animateValue = (start: number, end: number) => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / 1000, 1);
      setBalance(parseFloat((progress * (end - start) + start).toFixed(2)));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  useEffect(() => {
    if (
      mainAppStore.activeAccount?.balance !== undefined &&
      accountId === mainAppStore.activeAccount.id
    ) {
      animateValue(balance, mainAppStore.activeAccount.balance);
    }
  }, [mainAppStore.activeAccount, mainAppStore.activeAccount?.balance]);

  useEffect(() => {
    if (mainAppStore.activeAccount?.balance !== undefined) {
      setAccountId(mainAppStore.activeAccount.id);
      setBalance(mainAppStore.activeAccount.balance);
    }
  }, [mainAppStore.activeAccount]);

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
                        {moneyFormatPart(balance).full}
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
              {!mainAppStore.isPromoAccount && (
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
              )}
            </FlexContainer>
          </ButtonSwitcher>
          {!mainAppStore.isPromoAccount && on && (
            <FlexContainer
              backgroundColor="rgba(21, 22, 25, 0.9)"
              position="fixed"
              top="0"
              left="0"
              width="100vw"
              height="100vh"
              zIndex="198"
            ></FlexContainer>
          )}
          {!mainAppStore.isPromoAccount && on && (
            <Observer>
              {() => (
                <FlexContainer
                  position="absolute"
                  top="calc(100% + 8px)"
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
});

export default AccountSwitcherDropdown;

const ButtonSwitcher = styled(ButtonWithoutStyles)`
  position: relative;
  z-index: 199;
`;
