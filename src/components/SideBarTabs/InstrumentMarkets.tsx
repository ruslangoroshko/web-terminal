import React, { FC } from 'react';
import { InstrumentModelWSDTO } from '../../types/Instruments';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconStar from '../../assets/svg/icon-star.svg';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import { observer, Observer } from 'mobx-react-lite';
import { getNumberSign } from '../../helpers/getNumberSign';

interface Props {
  instrument: InstrumentModelWSDTO;
}

const InstrumentMarkets: FC<Props> = observer(props => {
  const {
    instrument: { base, id, name, quote },
  } = props;
  const { instrumentsStore, quotesStore } = useStores();

  const priceChange = instrumentsStore.pricesChange.find(
    item => item.id === id
  ) || {
    id: '',
    chng: 0,
  };

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
            <Observer>{() => <>{quotesStore.quotes[id].bid.c}</>}</Observer>
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer width="40px" flexDirection="column" alignItems="flex-end">
        <QuoteText isGrowth={priceChange.chng >= 0} fontSize="12px">
          {getNumberSign(priceChange.chng)}
          {Math.abs(priceChange.chng)}%
        </QuoteText>
      </FlexContainer>
    </InstrumentWrapper>
  );
});

export default InstrumentMarkets;

const InstrumentWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;
