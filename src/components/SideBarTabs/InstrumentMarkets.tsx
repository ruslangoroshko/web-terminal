import React, { FC, useRef } from 'react';
import { InstrumentModelWSDTO } from '../../types/InstrumentsTypes';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconStar from '../../assets/svg/icon-star.svg';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import { observer, Observer } from 'mobx-react-lite';
import { getNumberSign } from '../../helpers/getNumberSign';
import ImageContainer from '../ImageContainer';
import {
  LOCAL_HISTORY_PAGE,
  LOCAL_HISTORY_POSITION,
  LOCAL_PENDING_POSITION,
  LOCAL_PORTFOLIO_TABS,
  LOCAL_POSITION,
  LOCAL_STORAGE_SIDEBAR,
} from '../../constants/global';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import { SideBarTabType } from '../../enums/SideBarTabType';
import Colors from '../../constants/Colors';

interface Props {
  instrument: InstrumentModelWSDTO;
  toggle?: () => void;
}

const InstrumentMarkets: FC<Props> = observer((props) => {
  const {
    instrument: { base, id, name, quote, digits },
    toggle,
  } = props;
  const { instrumentsStore, quotesStore, tradingViewStore } = useStores();

  const favouritesButtonRef = useRef<HTMLButtonElement>(null);

  // TODO: refactor :)
  const setInstrumentActive = (e: any) => {
    if (
      favouritesButtonRef.current &&
      favouritesButtonRef.current.contains(e.target)
    ) {
      e.preventDefault();
    } else {
      const activeTab = localStorage.getItem(LOCAL_PORTFOLIO_TABS);
      const isHistory = localStorage.getItem(LOCAL_STORAGE_SIDEBAR);
      if (!!isHistory) {
        if (
          !!activeTab &&
          parseInt(activeTab) === PortfolioTabEnum.Orders &&
          parseFloat(isHistory) === SideBarTabType.Portfolio
        ) {
          tradingViewStore.setSelectedPendingPosition(undefined);
          localStorage.removeItem(LOCAL_PENDING_POSITION);
        } else if (
          ((!!activeTab &&
            parseInt(activeTab) === PortfolioTabEnum.Portfolio) ||
            !activeTab) &&
          parseFloat(isHistory) === SideBarTabType.Portfolio
        ) {
          quotesStore.setSelectedPositionId(null);
          localStorage.removeItem(LOCAL_POSITION);
        } else if (parseFloat(isHistory) === SideBarTabType.History) {
          tradingViewStore.setSelectedHistory(undefined);
          localStorage.removeItem(LOCAL_HISTORY_POSITION);
          localStorage.removeItem(LOCAL_HISTORY_PAGE);
        }
      }
      instrumentsStore.switchInstrument(id);
      if (toggle) {
        toggle();
      }
    }
  };
  return (
    <InstrumentHoverWrapper
      padding="0 16px"
      flexDirection="column"
      height="58px"
      minHeight="58px"
      onClick={setInstrumentActive}
    >
      <InstrumentWrapper
        height="100%"
        padding="12px 0"
        justifyContent="space-between"
      >
        <FlexContainer justifyContent="space-between">
          <FlexContainer alignItems="center" margin="0 8px 0 0">
            <ButtonWithoutStyles ref={favouritesButtonRef}>
              <SvgIcon {...IconStar} fillColor={Colors.WHITE_LIGHT} />
            </ButtonWithoutStyles>
          </FlexContainer>
          <FlexContainer width="32px" height="32px" margin="0 8px 0 0">
            <ImageContainer instrumentId={id} />
          </FlexContainer>
          <FlexContainer flexDirection="column" width="110px" marginRight="4px">
            <PrimaryTextSpan
              fontSize="12px"
              color={Colors.ACCENT}
              marginBottom="4px"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {name}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              fontSize="10px"
              color={Colors.WHITE_LIGHT}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {base}/{quote}
            </PrimaryTextSpan>
          </FlexContainer>
          <FlexContainer width="48px" justifyContent="flex-end">
            <PrimaryTextSpan fontSize="12px" color={Colors.ACCENT}>
              <Observer>
                {() => (
                  <>
                    {quotesStore.quotes[id] &&
                      quotesStore.quotes[id].bid.c.toFixed(digits)}
                  </>
                )}
              </Observer>
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer
          width="40px"
          flexDirection="column"
          alignItems="flex-end"
        >
          {!!instrumentsStore.pricesChange[id] && (
            <QuoteText
              isGrowth={instrumentsStore.pricesChange[id] >= 0}
              fontSize="12px"
            >
              {getNumberSign(instrumentsStore.pricesChange[id])}
              {Math.abs(instrumentsStore.pricesChange[id])}%
            </QuoteText>
          )}
        </FlexContainer>
      </InstrumentWrapper>
    </InstrumentHoverWrapper>
  );
});

export default InstrumentMarkets;

const InstrumentWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

const InstrumentHoverWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;
  will-change: background-color;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
`;
