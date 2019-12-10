import styled from '@emotion/styled';
import ColorsPallete from './colorPallete';
import { FlexContainer } from './FlexContainer';

export const CurrencyQuoteTitle = styled.p`
  font-size: 12px;
  line-height: 14px;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  color: #fff;
  margin-bottom: 4px;
`;

export const CurrencyQuoteIcon = styled.img`
  width: 30px;
  height: 30px;
  display: block;
  margin-right: 10px;
`;

export const CurrencyQuoteInfo = styled.div<{ isGrowth?: boolean }>`
  color: ${props =>
    props.isGrowth ? ColorsPallete.MINT : ColorsPallete.RAZZMATAZZ};
  font-family: 'Roboto', sans-serif;
  font-size: 11px;
  line-height: 13px;
`;

export const QuotesFeedWrapper = styled(FlexContainer)<{ isActive?: boolean }>`
  margin-right: 4px;
  padding: 4px;
  background-color: #1c2438;
  border-left: 1px solid ${ColorsPallete.MINT};
  border-radius: 2px;
  background: ${props =>
    props.isActive ? 'rgba(0, 94, 94, 0.8)' : ColorsPallete.BUNKER};
  width: 140px;
  height: 40px;
  backdrop-filter: blur(12px);

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 94, 94, 0.8);
  }
`;
