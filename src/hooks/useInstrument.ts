import { useStores } from './useStores';
import { useState, useEffect } from 'react';
import { useObserver } from 'mobx-react-lite';

const useInstrumentPrecision = (instrument: string) => {
  const { instrumentsStore } = useStores();
  const [precision, setPrecision] = useState<number>(0);

  useEffect(() => {
    setPrecision(
      instrumentsStore.instruments.find(
        (item) => item.instrumentItem.id === instrument
      )?.instrumentItem.digits || 0
    );
  }, [instrumentsStore.instruments]);

  return useObserver(() => ({ precision }));
};
export default useInstrumentPrecision;
