import styled from '@emotion/styled';

interface Props {
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between';
  flexDirection?: 'column' | 'row';
  alignItems?: 'center' | 'flex-start' | 'flex-end';
  flexWrap?: 'wrap' | 'nowrap';
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  position?: 'relative' | 'absolute' | 'sticky' | 'static';
}

export const FlexContainer = styled.div<Props>`
  display: flex;
  position: ${props => props.position};
  justify-content: ${props => props.justifyContent};
  align-items: ${props => props.alignItems};
  width: ${props => props.width};
  height: ${props => props.height};
  padding: ${props => props.padding};
  margin: ${props => props.margin};
  flex-wrap: ${props => props.flexWrap};
  flex-direction: ${props => props.flexDirection};
  background-color: ${props => props.backgroundColor};
`;
