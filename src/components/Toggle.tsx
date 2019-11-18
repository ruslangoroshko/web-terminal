import React, { useState, FC } from 'react';

interface Props {
  children: (arg0: { on: boolean; toggle: () => void }) => React.ReactElement;
}

const Toggle: FC<Props> = props => {
  const { children } = props;
  const [isOpened, setIsOpened] = useState(false);
  const toggle = () => {
    setIsOpened(!isOpened);
  };

  return children({
    on: isOpened,
    toggle,
  });
};
export default Toggle;
