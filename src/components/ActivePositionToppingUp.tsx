import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import Fields from '../constants/fields';
import hasValue from '../helpers/hasValue';
import { useStores } from '../hooks/useStores';

interface Props {
  challengeStopOutBySlValue: (stopLoss: any) => void;
  challengeStopOutByToppingUp: (isToppingUp: boolean) => void;
  sl?: number;
  isToppingUpActive: boolean;
  setValue: any;
}

const ActivePositionToppingUp: FC<Props> = observer(
  ({
    challengeStopOutBySlValue,
    challengeStopOutByToppingUp,
    sl,
    isToppingUpActive,
    setValue,
  }) => {
    const { SLTPstore } = useStores();

    useEffect(() => {
      if (hasValue(sl)) {
        challengeStopOutBySlValue(sl);
      } else {
        setValue(Fields.IS_TOPPING_UP, false);
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
