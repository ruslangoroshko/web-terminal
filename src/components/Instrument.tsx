import React, { useEffect, FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { InstrumentModelWSDTO } from '../types/Instruments';
import Topics from '../constants/websocketTopics';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { BidAskModelWSDTO } from '../types/BidAsk';
import IconClose from '../assets/svg/icon-instrument-close.svg';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import styled from '@emotion/styled';
import { useStores } from '../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import { PrimaryTextSpan, QuoteText } from '../styles/TextsElements';
import calculateGrowth from '../helpers/calculateGrowth';
import { AskBidEnum } from '../enums/AskBid';

interface Props {
  switchInstrument: () => void;
  instrument: InstrumentModelWSDTO;
  isActive?: boolean;
  handleClose: () => void;
}

const Instrument: FC<Props> = ({
  instrument,
  switchInstrument,
  isActive,
  handleClose,
}) => {
  const { quotesStore, mainAppStore } = useStores();

  useEffect(() => {
    mainAppStore.activeSession?.on(
      Topics.BID_ASK,
      (response: ResponseFromWebsocket<BidAskModelWSDTO[]>) => {
        if (!response.data.length) {
          return;
        }
        response.data.forEach(item => {
          quotesStore.setQuote(item);
        });
      }
    );
  }, [instrument]);

  return (
    <MagicWrapperBorders isActive={isActive}>
      <QuotesFeedWrapper
        padding="6px 0 6px 8px"
        isActive={isActive}
        onClick={switchInstrument}
      >
        <FlexContainer
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          {quotesStore.quotes[instrument.id] && (
            <Observer>
              {() => (
                <FlexContainer margin="0 8px 0 0" flexDirection="column">
                  <PrimaryTextSpan fontSize="12px">
                    {instrument.name}
                  </PrimaryTextSpan>
                  <QuoteText
                    fontSize="11px"
                    lineHeight="14px"
                    isGrowth={
                      quotesStore.quotes[instrument.id].dir === AskBidEnum.Buy
                    }
                  >
                    {calculateGrowth(
                      quotesStore.quotes[instrument.id].bid.c,
                      quotesStore.quotes[instrument.id].ask.c,
                      mainAppStore.account?.digits
                    )}
                  </QuoteText>
                </FlexContainer>
              )}
            </Observer>
          )}
          <FlexContainer padding="0 8px 0 0">
            <CloseButton onClick={handleClose}>
              <SvgIcon {...IconClose} fill="rgba(0, 0, 0, 0.6)"></SvgIcon>
            </CloseButton>
          </FlexContainer>
        </FlexContainer>
      </QuotesFeedWrapper>
    </MagicWrapperBorders>
  );
};

export default Instrument;

const QuotesFeedWrapper = styled(FlexContainer)<{ isActive?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 128px;
  height: 40px;
  align-items: center;
  box-shadow: ${props =>
    props.isActive ? 'inset 0px 1px 0px #00ffdd' : 'none'};
  border-radius: 0px 0px 4px 4px;
  overflow: hidden;
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
  background: ${props =>
    props.isActive
      ? 'radial-gradient(50.41% 50% at 50% 0%, rgba(0, 255, 221, 0.08) 0%, rgba(0, 255, 221, 0) 100%), rgba(255, 255, 255, 0.04)'
      : 'none'};

  &:hover {
    cursor: pointer;

    background-color: ${props =>
      !props.isActive && 'rgba(255, 255, 255, 0.08)'};
  }
  &:hover {
    cursor: pointer;

    background-color: ${props =>
      !props.isActive && 'rgba(255, 255, 255, 0.08)'};
  }
`;

const MagicWrapperBorders = styled.div<{ isActive?: boolean }>`
  position: relative;
  display: table-cell;
  width: 128px;
  height: 20px;
  border-right: ${props =>
    props.isActive
      ? '1px double rgba(0, 0, 0, 0)'
      : '1px solid rgba(0, 0, 0, 0.6)'};
  border-left: ${props =>
    props.isActive
      ? '1px double rgba(0, 0, 0, 0)'
      : '1px solid rgba(0, 0, 0, 0.6)'};

  &:hover {
    border-right: 1px double rgba(0, 0, 0, 0);
    border-left: 1px double rgba(0, 0, 0, 0);
  }
`;

const CloseButton = styled(ButtonWithoutStyles)`
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);

    & > svg {
      fill: white;
    }
  }
`;
