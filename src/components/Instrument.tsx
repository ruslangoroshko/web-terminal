import React, { useEffect, FC, useRef, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { InstrumentModelWSDTO } from '../types/InstrumentsTypes';
import Topics from '../constants/websocketTopics';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { BidAskModelWSDTO } from '../types/BidAsk';
import IconClose from '../assets/svg/icon-close.svg';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import styled from '@emotion/styled';
import { useStores } from '../hooks/useStores';
import { observer, Observer } from 'mobx-react-lite';
import { PrimaryTextSpan } from '../styles/TextsElements';
import ImageContainer from './ImageContainer';
import { autorun } from 'mobx';
import {
  LOCAL_HISTORY_PAGE,
  LOCAL_HISTORY_POSITION,
  LOCAL_PENDING_POSITION,
  LOCAL_PORTFOLIO_TABS,
  LOCAL_POSITION,
  LOCAL_STORAGE_SIDEBAR,
} from './../constants/global';
import { PortfolioTabEnum } from '../enums/PortfolioTabEnum';
import { SideBarTabType } from '../enums/SideBarTabType';

interface Props {
  instrument: InstrumentModelWSDTO;
  handleClose: () => void;
}

const Instrument: FC<Props> = observer(({ instrument, handleClose }) => {
  const {
    quotesStore,
    mainAppStore,
    instrumentsStore,
    tradingViewStore,
    notificationStore,
  } = useStores();
  const buttonCloseRef = useRef<HTMLButtonElement>(null);
  const [closePrice, setClosePrice] = useState('');

  const isActive =
    instrument.id === instrumentsStore.activeInstrument?.instrumentItem.id;

  const switchInstrument = (e: any) => {
    if (buttonCloseRef.current && buttonCloseRef.current.contains(e.target)) {
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
      notificationStore.resetNotification();
      instrumentsStore.switchInstrument(instrument.id);
    }
  };

  const handleCloseInstrument = () => {
    handleClose();
    if (
      instrumentsStore.activeInstrument?.instrumentItem.id === instrument.id
    ) {
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
    }
  };

  useEffect(() => {
    mainAppStore.activeSession?.on(
      Topics.BID_ASK,
      (response: ResponseFromWebsocket<BidAskModelWSDTO[]>) => {
        if (!response.data.length) {
          return;
        }
        response.data.forEach((item) => {
          quotesStore.setQuote(item);
        });
      }
    );
  }, [instrument]);

  useEffect(() => {
    const disposer = autorun(
      () => {
        if (quotesStore.quotes[instrument.id]) {
          setClosePrice(
            quotesStore.quotes[instrument.id].bid.c.toFixed(instrument.digits)
          );
        }
      },
      { delay: 1000 }
    );
    return () => {
      disposer();
    };
  }, []);

  return (
    <MagicWrapperBorders isActive={isActive}>
      <QuotesFeedWrapper
        padding="6px 0 6px 8px"
        isActive={isActive}
        onClick={switchInstrument}
        title={instrument.name}
      >
        <FlexContainer
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          {quotesStore.quotes[instrument.id] && (
            <FlexContainer marginRight="8px" height="100%">
              <FlexContainer minWidth="24px" width="24px" marginRight="8px">
                <ImageContainer instrumentId={instrument.id} />
              </FlexContainer>
              <FlexContainer flexDirection="column">
                <PrimaryTextSpan
                  fontSize="12px"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  maxWidth="calc(120px - 24px - 24px - 16px)"
                >
                  {instrument.name}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="11px"
                  lineHeight="14px"
                  color="rgba(255, 255, 255, 0.4)"
                >
                  {closePrice}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
          )}
          <FlexContainer padding="0 8px 0 0">
            <Observer>
              {() => (
                <>
                  {instrumentsStore.activeInstrumentsIds.length > 1 && (
                    <ButtonWithoutStyles
                      onClick={handleCloseInstrument}
                      ref={buttonCloseRef}
                    >
                      <SvgIcon
                        {...IconClose}
                        fillColor="rgba(0, 0, 0, 0.6)"
                        hoverFillColor="#00FFDD"
                      ></SvgIcon>
                    </ButtonWithoutStyles>
                  )}
                </>
              )}
            </Observer>
          </FlexContainer>
        </FlexContainer>
      </QuotesFeedWrapper>
    </MagicWrapperBorders>
  );
});

export default Instrument;

const QuotesFeedWrapper = styled(FlexContainer)<{ isActive?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 128px;
  height: 40px;
  align-items: center;
  box-shadow: ${(props) =>
    props.isActive ? 'inset 0px 1px 0px #00ffdd' : 'none'};
  border-radius: 0px 0px 4px 4px;
  overflow: hidden;
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
  background: ${(props) =>
    props.isActive
      ? 'radial-gradient(50.41% 50% at 50% 0%, rgba(0, 255, 221, 0.08) 0%, rgba(0, 255, 221, 0) 100%), rgba(255, 255, 255, 0.04)'
      : 'none'};

  &:hover {
    cursor: pointer;

    background-color: ${(props) =>
      !props.isActive && 'rgba(255, 255, 255, 0.08)'};
  }
  &:hover {
    cursor: pointer;

    background-color: ${(props) =>
      !props.isActive && 'rgba(255, 255, 255, 0.08)'};
  }
`;

const MagicWrapperBorders = styled.div<{ isActive?: boolean }>`
  position: relative;
  display: table-cell;
  width: 128px;
  height: 20px;
  border-right: ${(props) =>
    props.isActive
      ? '1px double rgba(0, 0, 0, 0)'
      : '1px solid rgba(0, 0, 0, 0.6)'};
  border-left: ${(props) =>
    props.isActive
      ? '1px double rgba(0, 0, 0, 0)'
      : '1px solid rgba(0, 0, 0, 0.6)'};

  &:hover {
    border-right: 1px double rgba(0, 0, 0, 0);
    border-left: 1px double rgba(0, 0, 0, 0);
  }
`;
