import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import hasValue from '../helpers/hasValue';
import { useStores } from '../hooks/useStores';

interface Props {
  challengeStopOutBySlValue: (stopLoss: any) => void;
  challengeStopOutByToppingUp: (isToppingUp: boolean) => void;
  sl?: number;
  isToppingUpActive: boolean;
}

const ActivePositionToppingUp: FC<Props> = observer(
  ({
    challengeStopOutBySlValue,
    challengeStopOutByToppingUp,
    sl,
    isToppingUpActive,
  }) => {
    const { SLTPstore } = useStores();
    
    useEffect(() => {
      if (hasValue(sl)) {
        challengeStopOutBySlValue(sl);
      }
    }, [sl, SLTPstore.slType]);

    useEffect(() => {
      if (hasValue(isToppingUpActive)) {
        challengeStopOutByToppingUp(isToppingUpActive);
      }
    }, [isToppingUpActive]);
    return <></>;
  }
);

export default ActivePositionToppingUp;
