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
import styled from '@emotion/styled';
import IconDiamond from '../../assets/svg/icon-diamond.svg';
import EventBonusTimer from '../EventBonusTimer';
import OnboardingBonusImage from '../../assets/images/onboarding-bonus.png';
import { Link } from 'react-router-dom';
import Page from '../../constants/Pages';

const BonusDropdown = observer(() => {
  const { mainAppStore, bonusStore } = useStores();
  const { t } = useTranslation();

  useEffect(() => {
    bonusStore.getUserBonus();
  }, []);

  return (
    <Toggle>
      {({ on, toggle }) => (
        <FlexContainer position="relative" marginRight="40px">
          <ButtonSwitcher onClick={toggle}>
            <FlexContainer>
              <FlexContainer
                alignItems="center"
              >
                <FlexContainer marginRight="5px">
                  <SvgIcon height={20} width={20} fillColor="#00FFDD" {...IconDiamond} />
                </FlexContainer>
                <PrimaryTextSpan
                  color="#ffffff"
                  fontSize="14px"
                  fontWeight={400}
                >
                  {t('Get Bonus')}
                </PrimaryTextSpan>
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
            > </FlexContainer>
          )}
          {on && (
            <Observer>
              {() => (
                <FlexContainer
                  position="absolute"
                  top="calc(100% + 14px)"
                  right="0"
                  flexDirection="column"
                  zIndex="200"
                  backgroundColor="#1C1F26"
                  borderRadius="5px"
                  overflow="hidden"
                  boxShadow="0px 34px 44px rgba(0, 0, 0, 0.25)"
                  padding="20px 16px"
                >
                  <FlexContainer
                    borderRadius="5px"
                    alignItems="center"
                    border="1px solid rgba(255, 255, 255, 0.12)"
                    boxShadow="0px 12px 72px rgba(0, 0, 0, 0.24)"
                    width="342px"
                    marginBottom="15px"
                  >
                    <CustomLink to={Page.DEPOSIT_POPUP}>
                      <FlexContainer
                        width="106px"
                        height="86px"
                        background="#00FFDD"
                        borderRadius="5px"
                        alignItems="center"
                        justifyContent="center"
                        marginRight="15px"
                      >
                        <PrimaryTextSpan
                          fontSize="24px"
                          fontWeight="bold"
                          color="#1C1F26"
                        >
                          +{bonusStore.bonusPercent}%
                        </PrimaryTextSpan>
                      </FlexContainer>
                      <FlexContainer
                        padding="16px 0 24px"
                        flexDirection="column"
                      >
                        <PrimaryTextSpan
                          fontSize="18px"
                          fontWeight={700}
                          color="#ffffff"
                          marginBottom="5px"
                        >
                          {t('Get Bonus')}
                        </PrimaryTextSpan>
                        <PrimaryTextSpan
                          fontSize="14px"
                          fontWeight={400}
                          color="rgba(255, 255, 255, 0.4)"
                        >
                          <EventBonusTimer />
                        </PrimaryTextSpan>
                      </FlexContainer>
                    </CustomLink>
                  </FlexContainer>
                  <FlexContainer
                    borderRadius="5px"
                    alignItems="center"
                    border="1px solid rgba(255, 255, 255, 0.12)"
                    boxShadow="0px 12px 72px rgba(0, 0, 0, 0.24)"
                    width="342px"
                  >
                    <CustomLink to={Page.ONBOARDING}>
                      <FlexContainer
                        width="106px"
                        height="86px"
                      >
                        <img src={OnboardingBonusImage} />
                      </FlexContainer>
                      <FlexContainer
                        padding="16px 0 24px"
                        flexDirection="column"
                        margin="0 0 0 -20px"
                      >
                        <PrimaryTextSpan
                          fontSize="18px"
                          fontWeight={700}
                          color="#ffffff"
                          marginBottom="5px"
                        >
                          {t('Onboarding guide')}
                        </PrimaryTextSpan>
                        <PrimaryTextSpan
                          fontSize="14px"
                          fontWeight={400}
                          color="rgba(255, 255, 255, 0.4)"
                        >
                          {t('Learn how to start trading')}
                        </PrimaryTextSpan>
                      </FlexContainer>
                    </CustomLink>
                  </FlexContainer>
                </FlexContainer>
              )}
            </Observer>
          )}
        </FlexContainer>
      )}
    </Toggle>
  );
});

export default BonusDropdown;

const ButtonSwitcher = styled(ButtonWithoutStyles)`
  position: relative;
  z-index: 199;
`;

const CustomLink = styled(Link)`
  width: 100%;
  display: flex;
  align-items: center;
  &:hover {
    text-decoration: none;
  }
`;
