import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { TimeScaleItem } from './ChartTimeScale';
import { IChartingLibraryWidget } from '../../vendor/charting_library/charting_library.min';

interface Props {
  tvWidget: IChartingLibraryWidget;
}

const AUTO_SCALE = 'mainSeriesProperties.priceAxisProperties.autoScale';
const LOG = 'mainSeriesProperties.priceAxisProperties.log';
const PERCENTAGE = 'mainSeriesProperties.priceAxisProperties.percentage';

function ChartTimeFomat(props: Props) {
  const { tvWidget } = props;
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
    setAxisProps(newProps);
    tvWidget.applyOverrides(newProps);
  };

  useEffect(() => {
    tvWidget.applyOverrides(axisProps);
  }, []);
  return (
    <ChartTimeScaleWrapper padding="2px" alignItems="center">
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
    </ChartTimeScaleWrapper>
  );
}

export default ChartTimeFomat;

const ChartTimeScaleWrapper = styled(FlexContainer)`
`;

// paneProperties.axisProperties.autoScale: true
// paneProperties.axisProperties.percentage: false
// paneProperties.axisProperties.log: false
