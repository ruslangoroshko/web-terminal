import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { observer, Observer } from 'mobx-react-lite';
import SvgIcon from '../SvgIcon';
import IconStar from '../../assets/svg/icon-star.svg';
import InstrumentMarkets from './InstrumentMarkets';
import { SortByMarketsEnum } from '../../enums/SortByMarketsEnum';
import { sortByMarketsLabels } from '../../constants/sortByDropdownValues';
import SortByDropdown from '../SortByDropdown';
import { useTranslation } from 'react-i18next';
import { LOCAL_MARKET_SORT, LOCAL_MARKET_TABS } from '../../constants/global';
import Colors from '../../constants/Colors';
import MarketIntrumentList from './Markets/MarketIntrumentList';

const Markets = observer(() => {
  const { instrumentsStore, sortingStore, mainAppStore } = useStores();

  const setActiveInstrumentGroup = (groupId: string) => () => {
    localStorage.setItem(LOCAL_MARKET_TABS, groupId);
    instrumentsStore.setActiveInstrumentGroupId(groupId);
  };
  const [on, toggle] = useState(false);

  const handleToggle = (flag: boolean) => {
    toggle(flag);
  };

  const handleChangeSorting = (sortType: SortByMarketsEnum) => () => {
    sortingStore.setMarketsSortBy(sortType);
    toggle(false);
  };

  const { t } = useTranslation();

  useEffect(() => {
    if (
      mainAppStore.paramsMarkets &&
      instrumentsStore.instrumentGroups.length > 0
    ) {
      const instrumentId =
        instrumentsStore.instrumentGroups.find(
          (item) => item.id === mainAppStore.paramsMarkets
        )?.id || instrumentsStore.instrumentGroups[0].id;
      instrumentsStore.setActiveInstrumentGroupId(instrumentId);
      mainAppStore.setParamsMarkets(null);
    }
  }, [mainAppStore.paramsMarkets, instrumentsStore.instrumentGroups]);

  useEffect(() => {
    const activeSort = localStorage.getItem(LOCAL_MARKET_SORT);
    console.log('active sort ', activeSort)
    if (!!activeSort) {
      console.log('set market sort')
      sortingStore.setMarketsSortBy(parseFloat(activeSort));
    }
  }, []);

  return (
    <FlexContainer flexDirection="column" height="100%">
      <FlexContainer padding="12px 16px" margin="0 0 8px 0">
        <PrimaryTextSpan
          fontSize="12px"
          color={Colors.ACCENT}
          textTransform="uppercase"
        >
          {t('Markets')}
        </PrimaryTextSpan>
      </FlexContainer>
      <MarketButtonsWrapper padding="0 16px">
        <Observer>
          {() => (
            <>
              {instrumentsStore.instrumentGroups.map((item) => (
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
                        ? Colors.ACCENT
                        : Colors.WHITE_DARK
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
          color={Colors.WHITE_LIGHT}
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
              color={Colors.ACCENT}
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
              <SvgIcon {...IconStar} fillColor={Colors.WHITE_LIGHT} />
            </ButtonWithoutStyles>
          </FlexContainer>
          <FlexContainer>
            <ButtonWithoutStyles>
              <PrimaryTextSpan
                fontSize="10px"
                textTransform="uppercase"
                color={Colors.WHITE_LIGHT}
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
                color={Colors.WHITE_LIGHT}
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
                color={Colors.WHITE_LIGHT}
                fontSize="10px"
                textTransform="uppercase"
              >
                {t('24H')}
              </PrimaryTextSpan>
            </ButtonWithoutStyles>
          </FlexContainer>
        </FlexContainer>
      </SortingWrapper>
      <MarketIntrumentList />
    </FlexContainer>
  );
});

export default Markets;

const MarketButtonsWrapper = styled(FlexContainer)`
  overflow-x: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  ::-webkit-scrollbar {
    height: 6px;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb:horizontal {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const MarketButton = styled(ButtonWithoutStyles)<{ isActive?: boolean }>`
  background: ${(props) =>
    props.isActive &&
    `radial-gradient(
      50.44% 50% at 50.67% 100%,
      rgba(0, 255, 221, 0.08) 0%,
      rgba(0, 255, 221, 0) 100%
    ),
    rgba(255, 255, 255, 0.08)`};
  box-shadow: ${(props) =>
    props.isActive && `inset 0px -1px 0px ${Colors.PRIMARY}`};
  transition: background 0.2s ease;
  padding: 8px;

  &:hover {
    background: radial-gradient(
        50.44% 50% at 50.67% 100%,
        rgba(0, 255, 221, 0.08) 0%,
        rgba(0, 255, 221, 0) 100%
      ),
      rgba(255, 255, 255, 0.08);
    box-shadow: inset 0px -1px 0px ${Colors.PRIMARY};
  }
`;

const SortingWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
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
    color: ${Colors.PRIMARY};
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;
