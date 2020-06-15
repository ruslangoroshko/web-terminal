import React from "react";
import styled from '@emotion/styled';
import ProjectLogo from '../assets/images/logo.png';
import { FlexContainer } from '../styles/FlexContainer';

const Logo = () => <FlexContainer alignItems="flex-start"><LogoImage src={ProjectLogo} /></FlexContainer>;

export default Logo;

const LogoImage = styled.img`
  max-width: 100%;
  width: 100%;
  height: auto;
`;