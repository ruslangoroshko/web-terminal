import React from 'react';

interface Props {
  id: string;
  width?: number;
  height?: number;
  viewBox: string;
}

function SvgIcon(props: Props) {
  const { id: iconId, height = 16, width = 16, viewBox } = props;
  return (
    <svg viewBox={viewBox} width={width} height={height}>
      <use xlinkHref={`#${iconId}`}></use>
    </svg>
  );
}

export default SvgIcon;
