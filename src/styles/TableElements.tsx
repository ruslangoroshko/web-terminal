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

export const Th = styled(FlexContainer)`
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

export const TableGrid = styled.div<{ columnsCount: number; height?: string; maxHeight?: string; }>`
  display: grid;
  height: ${props => props.height};
  overflow-y: auto;
  grid-template-columns: minmax(186px, 1fr) repeat(
      ${props => props.columnsCount - 1},
      minmax(100px, 1fr)
    );
  padding-bottom: 150px;  
  max-height: ${props => props.maxHeight}
`;
