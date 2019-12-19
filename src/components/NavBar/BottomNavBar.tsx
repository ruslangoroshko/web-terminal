import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import MarketsIcon from '../../assets/svg/icon-bottom-bar-markets.svg';
import PortfolioIcon from '../../assets/svg/icon-bottom-bar-portfolio.svg';
import NewsIcon from '../../assets/svg/icon-bottom-bar-news.svg';

import BottomNavBarButton from './BottomNavBarButton';

interface Props {}

function BottomNavBar(props: Props) {
  const {} = props;

  return (
    <FlexContainer
      flexDirection="column"
      height="100%"
      width="60px"
      backgroundColor="#262A2D"
    >
      <BottomNavBarButton iconProps={MarketsIcon} title="Markets" />
      <BottomNavBarButton iconProps={PortfolioIcon} title="Portfolio" />
      <BottomNavBarButton iconProps={NewsIcon} title="News" />
    </FlexContainer>
  );
}

export default BottomNavBar;
