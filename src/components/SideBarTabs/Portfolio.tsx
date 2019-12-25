import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';

interface Props {}

const Portfolio: FC<Props> = props => {
  const {} = props;

  return (
    <PortfolioWrapper padding="12px 16px">
      <FlexContainer>
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
  background: radial-gradient(
    100% 100% at 0% 0%,
    rgba(60, 255, 138, 0.102) 0%,
    rgba(60, 255, 138, 0) 100%
  );
`;
