import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
  QuoteText,
} from '../../styles/TextsElements';
import styled from '@emotion/styled';

interface Props {}

const Portfolio: FC<Props> = props => {
  const {} = props;

  return (
    <PortfolioWrapper padding="12px 16px" flexDirection="column">
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
          +$1,659.26
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
              $1,659.26
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
              $51,659.26
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer flexDirection="column"></FlexContainer>
    </PortfolioWrapper>
  );
};

export default Portfolio;

const TabPortfolitButton = styled(ButtonWithoutStyles)`
  border-bottom: 1px solid #eeff00;
  margin-right: 16px;

  &:last-of-type {
    margin-right: 0;
  }
`;

const PortfolioWrapper = styled(FlexContainer)`
  min-width: 320px;
  background: radial-gradient(
    100% 100% at 0% 0%,
    rgba(60, 255, 138, 0.102) 0%,
    rgba(60, 255, 138, 0) 100%
  );
`;
