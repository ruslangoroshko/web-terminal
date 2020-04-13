import React from 'react'
import styled from '@emotion/styled'
import { getImageSource } from '../helpers/getImageSource';

interface Props {
    instrumentId: string;
}

function ImageContainer(props: Props) {
  const { instrumentId } = props;

  return <ImageElem src={getImageSource(instrumentId)} />;
}

export default ImageContainer;

const ImageElem = styled.img`
  display: block;
  object-fit: contain;
  width: 100%;
`;