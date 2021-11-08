import React, { FC } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../styles/FlexContainer';

interface Props {
  src: string;
}

const Logo: FC<Props> = ({ src }) => (
  <FlexContainer alignItems="flex-start">
    <LogoImage src={src} />
  </FlexContainer>
);

export default Logo;

const LogoImage = styled.img`
  max-width: 100%;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 32px;
`;
