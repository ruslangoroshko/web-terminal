import styled from '@emotion/styled';

interface Props {
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between';
  flexDirection?: 'column' | 'row';
  alignItem?: 'center' | 'flex-start' | 'flex-end';
  width?: string;
  height?: string;
}

export const FlexContainer = styled.div<Props>`
  display: flex;
  justify-content: ${props => props.justifyContent};
  align-items: ${props => props.alignItem};
  width: ${props => props.width};
  height: ${props => props.height};
  flex-direction: ${props => props.flexDirection};
`;
