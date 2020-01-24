import React from 'react';
import styled from '@emotion/styled';

interface Props {
  id: string;
  width?: number;
  height?: number;
  viewBox: string;
  fillColor?: string;
  hoverFillColor?: string;
  transformProp?: string;
}

function SvgIcon(props: Props) {
  const {
    id: iconId,
    height,
    width,
    viewBox,
    fillColor,
    hoverFillColor,
    transformProp,
  } = props;
  const viewBoxValues = viewBox.split(' ');
  const viewBoxWidth = width || +viewBoxValues[2];
  const viewBoxHeight = height || +viewBoxValues[3];
  return (
    <SvgIconElement
      viewBox={viewBox}
      width={viewBoxWidth}
      height={viewBoxHeight}
      fillColor={fillColor}
      hoverFillColor={hoverFillColor}
      transformProp={transformProp}
    >
      <use xlinkHref={`#${iconId}`}></use>
    </SvgIconElement>
  );
}

export default SvgIcon;

const SvgIconElement = styled.svg<{
  fillColor?: string;
  hoverFillColor?: string;
  transformProp?: string;
}>`
  fill: ${props => props.fillColor};
  transition: fill 0.2s ease;
  will-change: fill;
  transform: ${props => props.transformProp};

  &:hover {
    fill: ${props => props.hoverFillColor};
  }
`;
