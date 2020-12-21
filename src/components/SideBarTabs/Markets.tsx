import React, { useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { Observer } from 'mobx-react-lite';
import SvgIcon from '../SvgIcon';
import IconStar from '../../assets/svg/icon-star.svg';
import InstrumentMarkets from './InstrumentMarkets';
import { SortByMarketsEnum } from '../../enums/SortByMarketsEnum';
import { sortByMarketsLabels } from '../../constants/sortByDropdownValues';
import SortByDropdown from '../SortByDropdown';
import { useTranslation } from 'react-i18next';
import { LOCAL_MARKET_TABS } from '../../constants/global';

function Markets() {
  const { instrumentsStore, sortingStore } = useStores();

  const setActiveInstrumentGroup = (groupId: string) => () => {
    localStorage.setItem(LOCAL_MARKET_TABS, groupId);
    instrumentsStore.activeInstrumentGroupId = groupId;
  };
  const [on, toggle] = useState(false);

  const handleToggle = (flag: boolean) => {
    toggle(flag);
  };

  const handleChangeSorting = (sortType: SortByMarketsEnum) => () => {
    sortingStore.marketsSortBy = sortType;
    toggle(false);
  };

  const { t } = useTranslation();

  return (
    <FlexContainer flexDirection="column" height="100%">
      <FlexContainer padding="12px 16px" margin="0 0 8px 0">
        <PrimaryTextSpan
          fontSize="12px"
          color="#fffccc"
          textTransform="uppercase"
        >
          {t('Markets')}
        </PrimaryTextSpan>
      </FlexContainer>
      <MarketButtonsWrapper padding="0 16px">
        <Observer>
          {() => (
            <>
              {instrumentsStore.instrumentGroups.map(item => (
                <MarketButton
                  key={item.id}
                  isActive={
                    instrumentsStore.activeInstrumentGroupId === item.id
                  }
                  onClick={setActiveInstrumentGroup(item.id)}
                >
                  <PrimaryTextSpan
                    color={
                      instrumentsStore.activeInstrumentGroupId === item.id
                        ? '#fffccc'
                        : 'rgba(255, 255, 255, 0.6)'
                    }
                    fontSize="10px"
                  >
                    {item.name}
                  </PrimaryTextSpan>
                </MarketButton>
              ))}
            </>
          )}
        </Observer>
      </MarketButtonsWrapper>
      <SortByWrapper
        backgroundColor="rgba(65, 66, 83, 0.5)"
        padding="10px 16px"
      >
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.4)"
          marginRight="4px"
          fontSize="10px"
          textTransform="uppercase"
        >
          {t('Sort by')}:
        </PrimaryTextSpan>
        <SortByDropdown
          selectedLabel={t(sortByMarketsLabels[sortingStore.marketsSortBy])}
          opened={on}
          toggle={handleToggle}
        >
          {Object.entries(sortByMarketsLabels).map(([key, value]) => (
            <DropdownItemText
              color="#fffccc"
              fontSize="12px"
              key={key}
              onClick={handleChangeSorting(+key)}
              whiteSpace="nowrap"
            >
              {t(value)}
            </DropdownItemText>
          ))}
        </SortByDropdown>
      </SortByWrapper>
      <SortingWrapper
        backgroundColor="rgba(65,66,83,0.5)"
        padding="8px 16px"
        alignItems="center"
        justifyContent="space-between"
      >
        <FlexContainer>
          <FlexContainer margin="0 8px 0 0">
            <ButtonWithoutStyles>
              <SvgIcon {...IconStar} fillColor="rgba(255, 255, 255, 0.4)" />
            </ButtonWithoutStyles>
          </FlexContainer>
          <FlexContainer>
            <ButtonWithoutStyles>
              <PrimaryTextSpan
                fontSize="10px"
                textTransform="uppercase"
                color="rgba(255, 255, 255, 0.4)"
              >
                {t('market name')}
              </PrimaryTextSpan>
            </ButtonWithoutStyles>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer>
          <FlexContainer
            margin="0 44px 0 0"
            width="34px"
            flexDirection="column"
            alignItems="flex-end"
          >
            <ButtonWithoutStyles>
              <PrimaryTextSpan
                color="rgba(255,255,255,0.4)"
                fontSize="10px"
                textTransform="uppercase"
              >
                {t('quote')}
              </PrimaryTextSpan>
            </ButtonWithoutStyles>
          </FlexContainer>
          <FlexContainer flexDirection="column">
            <ButtonWithoutStyles>
              <PrimaryTextSpan
                color="rgba(255,255,255,0.4)"
                fontSize="10px"
                textTransform="uppercase"
              >
                {t('24H')}
              </PrimaryTextSpan>
            </ButtonWithoutStyles>
          </FlexContainer>
        </FlexContainer>
      </SortingWrapper>
      <Observer>
        {() => (
          <MarketsWrapper flexDirection="column">
            {instrumentsStore.sortedInstruments.map(item => (
              <InstrumentMarkets
                instrument={item}
                key={item.id}
              ></InstrumentMarkets>
            ))}
          </MarketsWrapper>
        )}
      </Observer>
    </FlexContainer>
  );
}

export default Markets;

const MarketButtonsWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

const MarketButton = styled(ButtonWithoutStyles)<{ isActive?: boolean }>`
  background: ${props =>
    props.isActive &&
    `radial-gradient(
      50.44% 50% at 50.67% 100%,
      rgba(0, 255, 221, 0.08) 0%,
      rgba(0, 255, 221, 0) 100%
    ),
    rgba(255, 255, 255, 0.08)`};
  box-shadow: ${props => props.isActive && 'inset 0px -1px 0px #00ffdd'};
  transition: background 0.2s ease;
  padding: 8px;

  &:hover {
    background: radial-gradient(
        50.44% 50% at 50.67% 100%,
        rgba(0, 255, 221, 0.08) 0%,
        rgba(0, 255, 221, 0) 100%
      ),
      rgba(255, 255, 255, 0.08);
    box-shadow: inset 0px -1px 0px #00ffdd;
  }
`;

const SortingWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

const MarketsWrapper = styled(FlexContainer)`
  overflow-y: auto;
  max-height: calc(100% - 135px);

  ::-webkit-scrollbar {
    width: 4px;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb:vertical {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const SortByWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

const DropdownItemText = styled(PrimaryTextSpan)`
  transition: color 0.2s ease;
  will-change: color;
  margin-bottom: 16px;
  cursor: pointer;

  &:hover {
    color: #00ffdd;
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;
