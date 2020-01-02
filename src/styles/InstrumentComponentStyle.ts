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
  position: relative;
  align-items: center;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props =>
      props.isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent'};
  }

  &:hover {
    cursor: pointer;

    &:before {
      background-color: rgba(255, 255, 255, 0.08);
    }
  }
`;
