import React from 'react';

interface Props {
  id: string;
  width?: number;
  height?: number;
  viewBox: string;
}

function SvgIcon(props: Props) {
  const { id: iconId, height = 16, width = 16, viewBox } = props;
  const viewBoxValues = viewBox.split(' ');
  const viewBoxWidth = viewBoxValues[2] ? +viewBoxValues[2] : width;
  const viewBoxHeight = viewBoxValues[3] ? +viewBoxValues[3] : height;
  return (
    <svg viewBox={viewBox} width={viewBoxWidth} height={viewBoxHeight}>
      <use xlinkHref={`#${iconId}`}></use>
    </svg>
  );
}

export default SvgIcon;
