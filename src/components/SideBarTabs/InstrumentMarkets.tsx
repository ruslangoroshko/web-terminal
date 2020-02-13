import React, { FC } from 'react';
import { InstrumentModelWSDTO } from '../../types/Instruments';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconStar from '../../assets/svg/icon-star.svg';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import calculateGrowth from '../../helpers/calculateGrowth';
import { useStores } from '../../hooks/useStores';
import { AskBidEnum } from '../../enums/AskBid';
import { observer } from 'mobx-react-lite';

interface Props {
  instrument: InstrumentModelWSDTO;
}

const InstrumentMarkets: FC<Props> = observer(props => {
  const {
    instrument: { base, id, name, quote, ask, bid },
  } = props;
  const { mainAppStore, quotesStore } = useStores();

  return (
    <InstrumentWrapper padding="12px 0" justifyContent="space-between">
      <FlexContainer justifyContent="space-between">
        <FlexContainer alignItems="center" margin="0 8px 0 0">
          <ButtonWithoutStyles>
            <SvgIcon {...IconStar} fillColor="rgba(255, 255, 255, 0.4)" />
          </ButtonWithoutStyles>
        </FlexContainer>
        <FlexContainer
          width="32px"
          height="32px"
          backgroundColor="#FFEADD"
          borderRadius="50%"
          margin="0 8px 0 0"
        ></FlexContainer>
        <FlexContainer flexDirection="column" width="120px">
          <PrimaryTextSpan fontSize="12px" color="#fffccc" marginBottom="4px">
            {name}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            fontSize="10px"
            color="rgba(255, 255, 255, 0.4)"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {base}/{quote}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer width="40px" justifyContent="flex-end">
          <PrimaryTextSpan fontSize="12px" color="#fffccc">
            {bid}
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer width="40px" flexDirection="column" alignItems="flex-end">
        <QuoteText
          isGrowth={quotesStore.quotes[id].dir === AskBidEnum.Buy}
          fontSize="12px"
        >
          {calculateGrowth(bid!, ask!, mainAppStore.activeAccount?.digits)}
        </QuoteText>
      </FlexContainer>
    </InstrumentWrapper>
  );
});

export default InstrumentMarkets;

const InstrumentWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;
