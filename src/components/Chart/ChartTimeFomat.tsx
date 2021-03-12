import React, { useState, useEffect, useCallback } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { TimeScaleItem } from './ChartTimeScale';
import { PriceScaleMode } from '../../vendor/charting_library/charting_library';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';

const ChartTimeFomat = observer(() => {
  const { tradingViewStore } = useStores();
  const [axisProps, setAxisProps] = useState(PriceScaleMode.Normal);

  const setAxisScale = useCallback(
    (scaleMode: PriceScaleMode) => () => {
      const panes = tradingViewStore.tradingWidget?.activeChart().getPanes();
      panes?.forEach((pane) => {
        pane.getRightPriceScales().forEach((item) => {
          item.setMode(scaleMode);
        });
      });
      setAxisProps(scaleMode);
    },
    [tradingViewStore.tradingWidget]
  );

  // useEffect(() => {
  //   tradingViewStore.tradingWidget?.onChartReady(async () => {
  //     if (axisProps) {
  //       tradingViewStore.tradingWidget?.applyOverrides(axisProps);
  //     }
  //   });
  // }, [tradingViewStore.tradingWidget]);
  return (
    <FlexContainer padding="2px" alignItems="center">
      <TimeScaleItem
        onClick={setAxisScale(PriceScaleMode.Percentage)}
        isActive={axisProps === PriceScaleMode.Percentage}
      >
        %
      </TimeScaleItem>
      {/* <TimeScaleItem onClick={setAxisScale(LOG)} isActive={axisProps[LOG]}>
        log
      </TimeScaleItem> */}
      <TimeScaleItem
        onClick={setAxisScale(PriceScaleMode.Normal)}
        isActive={axisProps === PriceScaleMode.Normal}
      >
        Auto
      </TimeScaleItem>
    </FlexContainer>
  );
});

export default ChartTimeFomat;
