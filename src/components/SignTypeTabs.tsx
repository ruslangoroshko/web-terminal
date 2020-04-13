import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import Page from '../constants/Pages';
import { PrimaryTextSpan } from '../styles/TextsElements';

function SignTypeTabs() {
  return (
    <FlexContainer
      borderRadius="4px"
      border="1px solid rgba(255, 255, 255, 0.1)"
      height="40px"
      margin="0 0 40px 0"
    >
      <CustomNavLink to={Page.SIGN_IN} activeClassName="selected">
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.6)"
          fontSize="14px"
          fontWeight="bold"
        >
          Login
        </PrimaryTextSpan>
      </CustomNavLink>
      <CustomNavLink to={Page.SIGN_UP} activeClassName="selected">
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.6)"
          fontSize="14px"
          fontWeight="bold"
        >
          Sign up
        </PrimaryTextSpan>
      </CustomNavLink>
    </FlexContainer>
  );
}

export default SignTypeTabs;

const CustomNavLink = styled(NavLink)`
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  &.selected {
    background-color: rgba(255, 255, 255, 0.03);

    & > span {
      color: #fffccc;
    }
  }

  &:last-of-type {
    border: none;
  }
`;
