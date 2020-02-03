import styled from '@emotion/styled';

import { FlexContainer } from './FlexContainer';

export const Td = styled(FlexContainer)`
  transition: background-color 0.2s ease;
  padding: 12px 0;
  height: 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

export const DisplayContents = styled.div`
  display: contents;

  &:hover > div {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
