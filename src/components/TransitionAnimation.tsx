import React, { useEffect, useState, FC } from 'react';
import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';

interface Props {
  show: boolean;
}

const TransitionAnimation: FC<Props> = ({ show, children }) => {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) {
      setRender(true);
    }
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) {
      setRender(false);
    }
  };

  return shouldRender ? (
    <AnimationWrapper onAnimationEnd={onAnimationEnd} show={show}>
      {children}
    </AnimationWrapper>
  ) : null;
};

export default TransitionAnimation;

const translateAnimationIn = keyframes`
    from {
      transform: translateX(-1000px);
    }

    to {
      transform: translateX(0);
    }
`;

const translateAnimationOut = keyframes`
    from {
        transform: translateX(0);
    }

    to {
      transform: translateX(-1000px);
    }
`;

const AnimationWrapper = styled.div<{ show: boolean }>`
  animation: ${props =>
      props.show ? translateAnimationIn : translateAnimationOut}
    0.5s ease;
`;
