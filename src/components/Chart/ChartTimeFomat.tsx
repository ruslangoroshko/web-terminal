import React, { useState, useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { TimeScaleItem } from './ChartTimeScale';
import { IChartingLibraryWidget } from '../../vendor/charting_library/charting_library';
import { useStores } from '../../hooks/useStores';

const AUTO_SCALE = 'mainSeriesProperties.priceAxisProperties.autoScale';
const LOG = 'mainSeriesProperties.priceAxisProperties.log';
const PERCENTAGE = 'mainSeriesProperties.priceAxisProperties.percentage';

function ChartTimeFomat() {
  const { tradingViewStore } = useStores();
  const [axisProps, setAxisProps] = useState({
    [AUTO_SCALE]: true,
    [LOG]: false,
    [PERCENTAGE]: false,
  });

  const setAxisScale = (prop: string) => () => {
    let newProps = { ...axisProps };
    switch (prop) {
      case AUTO_SCALE:
        newProps = {
          ...newProps,
          [AUTO_SCALE]: !newProps[AUTO_SCALE],
        };
        break;

      case LOG:
        newProps = {
          ...newProps,
          [LOG]: !newProps[LOG],
          [PERCENTAGE]: false,
        };

        break;

      case PERCENTAGE:
        newProps = {
          ...newProps,
          [PERCENTAGE]: !newProps[PERCENTAGE],
          [LOG]: false,
        };

        break;

      default:
        break;
    }
    tradingViewStore.tradingWidget?.onChartReady(async () => {
      if (newProps) {
        tradingViewStore.tradingWidget?.applyOverrides(newProps);
        setAxisProps(newProps);
      }
    });
  };

  useEffect(() => {
    tradingViewStore.tradingWidget?.onChartReady(async () => {
      if (axisProps) {
        tradingViewStore.tradingWidget?.applyOverrides(axisProps);
      }
    });
  }, [tradingViewStore.tradingWidget]);
  return (
    <FlexContainer padding="2px" alignItems="center">
      <TimeScaleItem
        onClick={setAxisScale(PERCENTAGE)}
        isActive={axisProps[PERCENTAGE]}
      >
        %
      </TimeScaleItem>
      <TimeScaleItem onClick={setAxisScale(LOG)} isActive={axisProps[LOG]}>
        log
      </TimeScaleItem>
      <TimeScaleItem
        onClick={setAxisScale(AUTO_SCALE)}
        isActive={axisProps[AUTO_SCALE]}
      >
        Auto
      </TimeScaleItem>
    </FlexContainer>
  );
}

export default ChartTimeFomat;
