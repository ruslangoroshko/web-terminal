import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import MarketsIcon from '../../assets/svg/icon-bottom-bar-markets.svg';
import PortfolioIcon from '../../assets/svg/icon-bottom-bar-portfolio.svg';
import NewsIcon from '../../assets/svg/icon-bottom-bar-news.svg';

import BottomNavBarButton from './BottomNavBarButton';
import styled from '@emotion/styled';

interface Props {}

function BottomNavBar(props: Props) {
  const {} = props;

  return (
    <BottonNavBarWrapper
      flexDirection="column"
      height="100%"
      width="60px"
      backgroundColor="#232830"
      zIndex="103"
      position="relative"
    >
      <BottomNavBarButton iconProps={MarketsIcon} title="Markets" />
      <BottomNavBarButton iconProps={PortfolioIcon} title="Portfolio" />
      <BottomNavBarButton iconProps={NewsIcon} title="News" />
    </BottonNavBarWrapper>
  );
}

export default BottomNavBar;

const BottonNavBarWrapper = styled(FlexContainer)`
  box-shadow: 2px 0px 0px #1a1e22;
  border-right: 2px solid #1a1e22;
  min-width: 60px;
`;
