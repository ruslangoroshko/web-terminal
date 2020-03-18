import styled from '@emotion/styled';
import { FlexContainer } from '../FlexContainer';

export const AccountsList = styled(FlexContainer)``;

export const Account = styled.div`
  background-color: antiquewhite;
  padding: 20px;
  font-size: 22px;
  color: black;
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
