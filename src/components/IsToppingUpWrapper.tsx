import { observer } from 'mobx-react-lite';
import React, { FC, Fragment, useEffect, useRef } from 'react';
import hasValue from '../helpers/hasValue';
import { useStores } from '../hooks/useStores';

interface Props {
  challengeStopOutBySlValue: (arg0: number) => void;
  challengeStopOutByToppingUp: (arg0: boolean) => void;
  stopLoss: number;
}
const IsToppingUpWrapper: FC<Props> = observer(
  ({ challengeStopOutBySlValue, challengeStopOutByToppingUp, stopLoss }) => {
    const { SLTPstore } = useStores();

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (hasValue(stopLoss)) {
        challengeStopOutBySlValue(stopLoss);
      }
    }, [stopLoss]);

    useEffect(() => {
      if (ref.current) {
        console.log(ref.current.getBoundingClientRect());
        challengeStopOutByToppingUp(SLTPstore.isToppingUpActive);
      }
    }, [SLTPstore.isToppingUpActive, ref]);
    return <div ref={ref}></div>;
  }
);

export default IsToppingUpWrapper;
