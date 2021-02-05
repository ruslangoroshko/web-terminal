import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import hasValue from '../helpers/hasValue';
import { useStores } from '../hooks/useStores';

interface Props {
  challengeStopOutBySlValue: (arg0: number) => void;
  challengeStopOutByToppingUp: (arg0: boolean) => void;
  stopLoss?: number;
}
const IsToppingUpWrapper: FC<Props> = observer(
  ({ challengeStopOutBySlValue, challengeStopOutByToppingUp, stopLoss }) => {
    const { SLTPstore } = useStores();

    useEffect(() => {
      if (hasValue(stopLoss)) {
        challengeStopOutBySlValue(stopLoss!);
      }
    }, [stopLoss]);

    useEffect(() => {
      challengeStopOutByToppingUp(SLTPstore.isToppingUpActive);
    }, [SLTPstore.isToppingUpActive]);
    return <></>;
  }
);

export default IsToppingUpWrapper;
