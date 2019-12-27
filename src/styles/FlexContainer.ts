import styled from '@emotion/styled';

export interface FlexContainerProps {
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between';
  flexDirection?: 'column' | 'row';
  alignItems?: 'center' | 'flex-start' | 'flex-end';
  flexWrap?: 'wrap' | 'nowrap';
  width?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  textColor?: string;
  position?: 'relative' | 'absolute' | 'sticky' | 'static';
  top?: string;
  bottom?: string;
  right?: string;
  left?: string;
  zIndex?: string;
}

export const FlexContainer = styled.div<FlexContainerProps>`
  display: flex;
  position: ${props => props.position};
  justify-content: ${props => props.justifyContent};
  align-items: ${props => props.alignItems};
  width: ${props => props.width};
  height: ${props => props.height};
  min-height: ${props => props.minHeight};
  max-height: ${props => props.maxHeight};
  padding: ${props => props.padding};
  margin: ${props => props.margin};
  flex-wrap: ${props => props.flexWrap};
  flex-direction: ${props => props.flexDirection};
  background-color: ${props => props.backgroundColor};
  color: ${props => props.textColor};
  top: ${props => props.top};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
  left: ${props => props.left};
  z-index: ${props  => props.zIndex};
`;
