import { useStores } from './useStores';
import { useState, useEffect } from 'react';

const useInstrumentPrecision = (instrumentId: string) => {
  const { instrumentsStore } = useStores();
  const [precision, setPrecision] = useState<number>(0);

  useEffect(() => {
    setPrecision(
      instrumentsStore.instruments.find(
        (item) => item.instrumentItem.id === instrumentId
      )?.instrumentItem.digits || 0
    );
  }, [instrumentsStore.instruments]);

  return { precision };
};
export default useInstrumentPrecision;
