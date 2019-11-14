import styled from '@emotion/styled';
import { FlexContainer } from '../FlexContainer';
import { ButtonWithoutStyles } from '../ButtonWithoutStyles';

export const AccountsList = styled(FlexContainer)``;

export const Account = styled.div`
  background-color: antiquewhite;
  padding: 20px;
  font-size: 22px;
  color: black;
`;

export const Instrument = styled.p`
  width: 100%;
`;

export const CurrencyQuoteTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
`;

export const CurrencyQuoteIcon = styled.img`
  width: 30px;
  height: 30px;
  display: block;
  margin-right: 10px;
`;

export const CurrencyQuoteInfo = styled.div<{ isGrowth?: boolean }>`
  font-size: 12px;
  font-weight: normal;
  color: ${props => (props.isGrowth ? 'green' : 'red')};
`;

export const QuotesFeedWrapper = styled(FlexContainer)<{ isActive?: boolean }>`
  margin-right: 20px;
  background-color: #1c2438;
  border-radius: 4px;
  border: 1px solid #353c4d;

  background-image: ${props =>
    props.isActive && 'linear-gradient(#535a6d, #1c2438)'};

  &:hover {
    cursor: pointer;
  }
`;

export const AccountIndex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  background-color: gray;
  color: #fff;
  font-weight: bold;
  margin-right: 8px;
`;

export const AccountNameTitle = styled.span`
  font-size: 12px;
  color: #fff;
`;

export const AccountName = styled.span`
  font-size: 30px;
  color: #fff;
`;

export const AccountLeverage = styled(AccountName)``;

export const AccountBalance = styled(AccountName)`
  color: #ef7000;
`;

export const AccountBalanceTitle = styled(AccountBalance)`
  font-size: 12px;
`;
