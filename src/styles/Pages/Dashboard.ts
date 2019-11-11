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

export const Button = styled(ButtonWithoutStyles)<{ isBuy?: boolean }>`
  background-color: ${props => (props.isBuy ? '#2dac41' : '#dc4933')};
  padding: 10px;
  color: #fff;
  margin-bottom: 10px;
  transition: background-color 0.2s ease;
  width: 50px;
  height: 50px;
  border-radius: 4px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    cursor: pointer;
    background-color: ${props => (props.isBuy ? '#41ec5c' : '#ff7f6c')};
  }
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
  font-size: 14;
  font-weight: normal;
  color: ${props => (props.isGrowth ? 'green' : 'red')};
`;

export const CurrencyWrapper = styled(FlexContainer)`
  margin-right: 20px;
  background-color: #1c2438;
  border-radius: 4px;
`;

export const AccountWrapper = styled(FlexContainer)`
  border: 1px solid lightgray;
  padding: 20px;
  border-radius: 10px;
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

export const AccountName = styled.p`
  font-size: 22px;
  color: #fff;
  margin-bottom: 10px;
`;

export const AccountLeverage = styled.span`
  font-size: 20px;
  color: #fff;
`;

export const AccountBalance = styled.span`
  font-size: 30px;
  color: antiquewhite;
`;
