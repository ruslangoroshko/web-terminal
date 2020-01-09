import React, { FC, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import {
  supportedInterval,
  supportedResolutions,
} from '../../constants/supportedTimeScales';
import { BASIC_RESOLUTION } from '../../constants/defaultChartValues';
import moment from 'moment';
import { useStores } from '../../hooks/useStores';

interface Props {}

const ChartIntervalTimeScale: FC<Props> = props => {
  const [resolution, setResolution] = useState(BASIC_RESOLUTION);
  const [interval, setInterval] = useState(supportedInterval['1D']);
  const { tradingViewStore } = useStores();

  const handleChangeResolution = (newInterval: string) => () => {
    let from = moment();
    let newResolution = supportedResolutions['1 minute'];
    debugger;
    switch (newInterval) {
      case supportedInterval['1D']:
        from = moment().subtract(1, 'd');
        newResolution = supportedResolutions['1 minute'];
        break;

      case supportedInterval['5D']:
        from = moment().subtract(5, 'd');
        newResolution = supportedResolutions['5 minutes'];
        break;

      case supportedInterval['1M']:
        from = moment().subtract(1, 'M');
        newResolution = supportedResolutions['1 hour'];
        break;

      case supportedInterval['YTD']:
        from = moment().subtract(new Date().getUTCMonth(), 'M');
        newResolution = supportedResolutions['1 day'];
        break;

      case supportedInterval['1Y']:
        from = moment().subtract(1, 'year');
        newResolution = supportedResolutions['1 day'];
        break;

      case supportedInterval['3Y']:
        from = moment().subtract(1, 'y');
        newResolution = supportedResolutions['1 day'];
        break;

      case supportedInterval['All']:
        from = moment().subtract(1, 'y');
        newResolution = supportedResolutions['1 day'];
        break;

      default:
        break;
    }
    setInterval(newInterval);

    if (newResolution === resolution) {
      tradingViewStore.tradingWidget?.chart().setVisibleRange({
        from: from.valueOf() / 1000,
        to: moment().valueOf() / 1000,
      });
    } else {
      setResolution(newResolution);
      tradingViewStore.tradingWidget
        ?.chart()
        .setResolution(newResolution, () => {
          tradingViewStore.tradingWidget?.chart().setVisibleRange({
            from: from.valueOf() / 1000,
            to: moment().valueOf() / 1000,
          });
        });
    }
  };

  return (
    <ChartTimeScaleWrapper padding="2px" alignItems="center">
      {(Object.keys(supportedInterval) as Array<
        keyof typeof supportedInterval
      >).map(key => (
        <TimeScaleItem
          isActive={supportedInterval[key] === interval}
          key={key}
          onClick={handleChangeResolution(supportedInterval[key])}
        >
          {key}
        </TimeScaleItem>
      ))}
    </ChartTimeScaleWrapper>
  );
};

export default ChartIntervalTimeScale;

const ChartTimeScaleWrapper = styled(FlexContainer)``;

export const TimeScaleItem = styled(FlexContainer)<{ isActive?: boolean }>`
  padding: 4px 12px;
  height: 28px;
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${props => (props.isActive ? '#21B3A4' : 'rgba(255, 255, 255, 0.6)')};
  border: ${props => (props.isActive ? '1px solid #21B3A4' : 'none')};
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  background-color: ${props => props.isActive && 'rgba(33, 179, 164, 0.04);'};

  &:hover {
    background-color: rgba(33, 179, 164, 0.04);
    cursor: pointer;
  }
`;
