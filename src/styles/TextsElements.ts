import styled from '@emotion/styled';

interface PrimaryTextType {
  color?: string;
  fontWeight?: 'bold' | 'normal' | number;
  fontStyle?: 'italic' | 'normal';
  fontSize?: '12px' | '11px' | '14px' | '16px';
  lineHeight?: string;
  opacity?: string;
  marginRight?: string;
  marginBottom?: string;
  textDecoration?: 'underline';
  textTransform?: 'capitalize' | 'lowercase' | 'uppercase';
}

export const PrimaryTextSpan = styled.span<PrimaryTextType>`
  font-style: ${props => props.fontStyle || 'normal'};
  font-weight: ${props => props.fontWeight || 'normal'};
  font-size: ${props => props.fontSize || '14px'};
  line-height: ${props => props.lineHeight || '120%'};
  color: ${props => props.color || '#ffffff'};
  opacity: ${props => props.opacity};
  margin-right: ${props => props.marginRight};
  margin-bottom: ${props => props.marginBottom};
  text-decoration: ${props => props.textDecoration};
  text-transform: ${props => props.textTransform};
`;

export const PrimaryTextParagraph = styled.p<PrimaryTextType>`
  font-style: ${props => props.fontStyle || 'normal'};
  font-weight: ${props => props.fontWeight || 'bold'};
  font-size: ${props => props.fontSize || '16px'};
  line-height: ${props => props.lineHeight || '120%'};
  color: ${props => props.color || '#ffffff'};
  opacity: ${props => props.opacity};
  margin-right: ${props => props.marginRight};
  margin-bottom: ${props => props.marginBottom};
  text-decoration: ${props => props.textDecoration};
  text-transform: ${props => props.textTransform};
`;
