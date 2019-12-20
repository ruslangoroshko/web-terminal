import React, { FC, useContext } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import baseImg from '../assets/images/base.png';
import quoteImg from '../assets/images/quote.png';
import ColorsPallete from '../styles/colorPallete';
import { QuotesContext } from '../store/QuotesProvider';
import { AskBidEnum } from '../enums/AskBid';
import calculateGrowth from '../helpers/calculateGrowth';
import { InstrumentModelWSDTO } from '../types/Instruments';

interface Props {
  instrument: InstrumentModelWSDTO;
}

const ActiveInstrument: FC<Props> = props => {
  const { instrument } = props;

  const { quotes } = useContext(QuotesContext);
  const quote = quotes[instrument.id] || {
    ask: {
      c: 0,
    },
    bid: {
      c: 0,
    },
  };
  return (
    <FlexContainer>
      <FlexContainer
        height="60px"
        width="60px"
        position="relative"
        margin="0 12px 0 0"
      >
        <BaseImgWrapper>
          <img src={baseImg}></img>
        </BaseImgWrapper>
        <QuoteImgWrapper>
          <img src={quoteImg}></img>
        </QuoteImgWrapper>
      </FlexContainer>
      <FlexContainer flexDirection="column" margin="0 52px 0 0">
        <ActiveInstrumentTitle>{instrument.name}</ActiveInstrumentTitle>
        <ActiveInstrumentFullTitle>{instrument.name}</ActiveInstrumentFullTitle>
      </FlexContainer>
      <FlexContainer flexDirection="column" margin="0 70px 0 0">
        <FlexContainer margin="0 0 12px" alignItems="center">
          <BidText>{quote.bid.c}</BidText>
          <GrowthText isGrowth={quote.dir === AskBidEnum.Buy}>
            {`${quote.dir === AskBidEnum.Buy ? '+' : '-'}${calculateGrowth(
              quote.bid.c,
              quote.ask.c,
              instrument.digits
            )}`}
          </GrowthText>
        </FlexContainer>
        <FlexContainer flexWrap="wrap">
          <FlexContainer margin="0 0 4px 0" width="100%">
            <LabelWrapper>
              <SecondaryTextLabel>Bid</SecondaryTextLabel>
            </LabelWrapper>
            <LabelWrapper>
              <PrimaryTextValue>{quote.bid.c}</PrimaryTextValue>
            </LabelWrapper>
          </FlexContainer>
          <FlexContainer>
            <LabelWrapper>
              <SecondaryTextLabel>Ask</SecondaryTextLabel>
            </LabelWrapper>
            <LabelWrapper>
              <PrimaryTextValue>{quote.ask.c}</PrimaryTextValue>
            </LabelWrapper>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default ActiveInstrument;

// TODO: find out base / quote places

const BaseImgWrapper = styled(FlexContainer)`
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  z-index: 12;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
`;

const QuoteImgWrapper = styled(FlexContainer)`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  bottom: 0;
  right: 0;
  z-index: 11;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
`;

const ActiveInstrumentTitle = styled.span`
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 4px;
`;

const ActiveInstrumentFullTitle = styled.span`
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
  margin-bottom: 8px;
  opacity: 0.4;
`;

const BidText = styled.span`
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  margin-right: 10px;
`;

const GrowthText = styled.span<{ isGrowth: boolean }>`
  font-size: 12px;
  line-height: 14px;
  color: ${props =>
    props.isGrowth ? ColorsPallete.MINT : ColorsPallete.RAZZMATAZZ};
`;

const LabelWrapper = styled.div`
  width: 22px;
  margin-right: 8px;
`;

const SecondaryTextLabel = styled.span`
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
  opacity: 0.4;
`;

const PrimaryTextValue = styled.span`
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
`;
