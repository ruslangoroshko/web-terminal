import styled from '@emotion/styled';

interface PrimaryTextType {
  color?: string;
  fontWeight?: 'bold' | 'normal' | number;
  fontStyle?: 'italic' | 'normal';
  fontSize?: '12px' | '11px' | '14px' | '16px' | '10px' | '24px';
  lineHeight?: string;
  marginRight?: string;
  marginBottom?: string;
  textDecoration?: 'underline';
  textTransform?: 'capitalize' | 'lowercase' | 'uppercase';
  whiteSpace?: 'nowrap' | 'pre' | 'normal';
}

export const PrimaryTextSpan = styled.span<PrimaryTextType>`
  font-family: 'Roboto', sans-serif;
  font-style: ${props => props.fontStyle};
  font-weight: ${props => props.fontWeight || 'normal'};
  font-size: ${props => props.fontSize || '14px'};
  line-height: ${props => props.lineHeight || '120%'};
  color: ${props => props.color || '#FFFCCC'};
  margin-right: ${props => props.marginRight};
  margin-bottom: ${props => props.marginBottom};
  text-decoration: ${props => props.textDecoration};
  text-transform: ${props => props.textTransform};
  white-space: ${props => props.whiteSpace};
`;

export const PrimaryTextParagraph = styled.p<PrimaryTextType>`
  font-family: 'Roboto', sans-serif;
  font-style: ${props => props.fontStyle};
  font-weight: ${props => props.fontWeight};
  font-size: ${props => props.fontSize || '16px'};
  line-height: ${props => props.lineHeight || '120%'};
  color: ${props => props.color || '#FFFCCC'};
  margin-right: ${props => props.marginRight};
  margin-bottom: ${props => props.marginBottom};
  text-decoration: ${props => props.textDecoration};
  text-transform: ${props => props.textTransform};
  white-space: ${props => props.whiteSpace};
`;

export const QuoteText = styled(PrimaryTextSpan)<
  PrimaryTextType & { isGrowth?: boolean }
>`
  font-family: 'Roboto', sans-serif;
  font-style: ${props => props.fontStyle || 'normal'};
  font-weight: ${props => props.fontWeight || 'normal'};
  font-size: ${props => props.fontSize || '16px'};
  line-height: ${props => props.lineHeight || '120%'};
  color: ${props => (props.isGrowth ? '#3BFF8A' : '#FF557E')};
  margin-right: ${props => props.marginRight};
  margin-bottom: ${props => props.marginBottom};
  text-decoration: ${props => props.textDecoration};
  text-transform: ${props => props.textTransform};
`;
