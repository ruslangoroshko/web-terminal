import React from "react";
import styled from '@emotion/styled';
import ProjectLogo from '../assets/images/logo.png';

const Logo = () => <LogoImage src={ProjectLogo} />;

export default Logo;

const LogoImage = styled.img`
  max-width: 100%;
  height: auto;
`;