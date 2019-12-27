import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
  QuoteText,
} from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import InstrumentInfo from './InstrumentInfo';
import { getNumberSign } from '../../helpers/getNumberSign';
import { observer } from 'mobx-react-lite';

interface Props {}

const Portfolio: FC<Props> = observer(props => {
  const {} = props;
  const { quotesStore, mainAppStore } = useStores();
  return (
    <PortfolioWrapper padding="12px 16px" flexDirection="column">
      <FlexContainer flexDirection="column">
        <FlexContainer margin="0 0 28px">
          <TabPortfolitButton>
            <PrimaryTextSpan
              fontSize="12px"
              lineHeight="16px"
              textTransform="uppercase"
              color="#fff"
            >
              Portfolio
            </PrimaryTextSpan>
          </TabPortfolitButton>
          <TabPortfolitButton>
            <PrimaryTextSpan
              fontSize="12px"
              lineHeight="16px"
              textTransform="uppercase"
            >
              Orders
            </PrimaryTextSpan>
          </TabPortfolitButton>
        </FlexContainer>
        <FlexContainer flexDirection="column">
          <PrimaryTextParagraph
            color="rgba(255, 255, 255, 0.4)"
            textTransform="uppercase"
            fontSize="10px"
            marginBottom="6px"
          >
            Total Profit
          </PrimaryTextParagraph>
          <QuoteText
            isGrowth={true}
            fontSize="24px"
            lineHeight="28px"
            fontWeight="bold"
            marginBottom="20px"
          >
            {getNumberSign(quotesStore.profit)}
            {mainAppStore.account?.symbol}
            {quotesStore.profit.toFixed(2)}
          </QuoteText>
          <FlexContainer>
            <FlexContainer flexDirection="column" margin="0 38px 20px 0">
              <PrimaryTextParagraph
                color="rgba(255, 255, 255, 0.4)"
                textTransform="uppercase"
                fontSize="10px"
                marginBottom="6px"
              >
                Total Investments
              </PrimaryTextParagraph>
              <PrimaryTextSpan
                fontSize="14px"
                lineHeight="16px"
                fontWeight="bold"
              >
                {mainAppStore.account?.symbol}
                {quotesStore.invest}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer flexDirection="column">
              <PrimaryTextParagraph
                color="rgba(255, 255, 255, 0.4)"
                textTransform="uppercase"
                fontSize="10px"
                marginBottom="6px"
              >
                Total Equity
              </PrimaryTextParagraph>
              <PrimaryTextSpan
                fontSize="14px"
                lineHeight="16px"
                fontWeight="bold"
              >
                {mainAppStore.account?.symbol}
                {quotesStore.totalEquity.toFixed(2)}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <ActivePositionsWrapper flexDirection="column">
        {quotesStore.activePositions.map(item => (
          <InstrumentInfo key={item.id} {...item} />
        ))}
      </ActivePositionsWrapper>
    </PortfolioWrapper>
  );
});

export default Portfolio;

const TabPortfolitButton = styled(ButtonWithoutStyles)<{ isActive?: boolean }>`
  border-bottom: ${props => (props.isActive ? '1px solid #eeff00' : 'none')};
  margin-right: 16px;

  &:last-of-type {
    margin-right: 0;
  }
`;

const PortfolioWrapper = styled(FlexContainer)`
  min-width: 320px;
`;

const ActivePositionsWrapper = styled(FlexContainer)`
  overflow: auto;
  max-height: calc(100vh - 236px);
`;
