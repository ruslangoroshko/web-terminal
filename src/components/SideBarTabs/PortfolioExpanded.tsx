import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';

interface Props {}

const PortfolioExpanded: FC<Props> = props => {
  const {} = props;
  const { tabsStore } = useStores();
  const closeExpanded = () => {
    tabsStore.isTabExpanded = false;
  };
  return (
    <PortfolioWrapper padding="12px 16px">
      <FlexContainer justifyContent="center" alignItems="center">
        <ButtonWithoutStyles onClick={closeExpanded}>
          <PrimaryTextSpan fontSize="24px" color="#fff">
            CLICK ME TO CLOSE ME
          </PrimaryTextSpan>
        </ButtonWithoutStyles>
      </FlexContainer>
    </PortfolioWrapper>
  );
};

export default PortfolioExpanded;

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
