import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

interface Props {
  id: string;
  width?: number;
  height?: number;
  viewBox: string;
  fillColor?: string;
  hoverFillColor?: string;
}

function SvgIcon(props: Props) {
  const {
    id: iconId,
    height = 16,
    width = 16,
    viewBox,
    fillColor,
    hoverFillColor,
  } = props;
  const viewBoxValues = viewBox.split(' ');
  const viewBoxWidth = viewBoxValues[2] ? +viewBoxValues[2] : width;
  const viewBoxHeight = viewBoxValues[3] ? +viewBoxValues[3] : height;
  return (
    <SvgIconElement
      viewBox={viewBox}
      width={viewBoxWidth}
      height={viewBoxHeight}
      fillColor={fillColor}
      hoverFillColor={hoverFillColor}
    >
      <use xlinkHref={`#${iconId}`}></use>
    </SvgIconElement>
  );
}

export default SvgIcon;

const SvgIconElement = styled.svg<{
  fillColor?: string;
  hoverFillColor?: string;
}>`
  fill: ${props => props.fillColor};

  &:hover {
    fill: ${props => props.hoverFillColor};
  }
`;
