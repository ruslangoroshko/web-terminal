import styled from '@emotion/styled';
import ColorsPallete from './colorPallete';
import { FlexContainer } from './FlexContainer';

export const CurrencyQuoteTitle = styled.span`
  font-size: 12px;
  line-height: 14px;
  font-family: 'Roboto', sans-serif;
  color: #fff;
  margin-right: 20px;
`;

export const CurrencyQuoteIcon = styled.img`
  width: 30px;
  height: 30px;
  display: block;
  margin-right: 10px;
`;

export const CurrencyQuoteInfo = styled.div`
  color: rgba(255, 255, 255, 0.4);
  font-family: 'Roboto', sans-serif;
  font-size: 11px;
  line-height: 14px;
  margin-right: 8px;
`;

export const QuotesFeedWrapper = styled(FlexContainer)<{ isActive?: boolean }>`
  margin-right: 4px;
  border: ${props =>
    props.isActive ? `1px solid ${ColorsPallete.MINT}` : 'none'};
  border-radius: 2px;
  background-color: ${props =>
    props.isActive ? '#1A1E22' : 'rgba(255, 255, 255, 0.06)'};
  backdrop-filter: ${props => (props.isActive ? 'blur(8px)' : 'blur(12px)')};

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 94, 94, 0.8);
  }
`;
