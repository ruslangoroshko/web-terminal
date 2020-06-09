import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import {
  supportedInterval,
  supportedResolutions,
  SupportedResolutionsType,
  SupportedIntervalsType,
} from '../../constants/supportedTimeScales';
import moment from 'moment';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { IActiveInstrument } from '../../types/InstrumentsTypes';

interface Props {}

const ChartIntervalTimeScale: FC<Props> = observer(() => {
  const { instrumentsStore, tradingViewStore } = useStores();

  const handleChangeResolution = (
    newInterval: SupportedIntervalsType
  ) => () => {
    let from = moment();
    let newResolutionKey: SupportedResolutionsType = '1 minute';
    switch (newInterval) {
      case supportedInterval['1D']:
        from = moment().subtract(1, 'd');
        newResolutionKey = '1 minute';
        break;

      case supportedInterval['5D']:
        from = moment().subtract(5, 'd');
        newResolutionKey = '30 minutes';
        break;

      case supportedInterval['1M']:
        from = moment().subtract(1, 'M');
        newResolutionKey = '1 hour';
        break;

      case supportedInterval['YTD']:
        from = moment().subtract(new Date().getUTCMonth(), 'M');
        newResolutionKey = '1 day';
        break;

      case supportedInterval['1Y']:
        from = moment().subtract(1, 'year');
        newResolutionKey = '1 day';
        break;

      case supportedInterval['3Y']:
        from = moment().subtract(1, 'y');
        newResolutionKey = '1 month';
        break;

      case supportedInterval['All']:
        from = moment().subtract(1, 'y');
        newResolutionKey = '1 month';
        break;

      default:
        break;
    }
    if (!instrumentsStore.activeInstrument) {
      return;
    }

    const newActiveInstrument: IActiveInstrument = {
      ...instrumentsStore.activeInstrument,
      interval: newInterval,
    };
    if (newResolutionKey === instrumentsStore.activeInstrument!.resolution) {
      tradingViewStore.tradingWidget?.chart().setVisibleRange({
        from: from.valueOf(),
        to: moment().valueOf(),
      });
    } else {
      newActiveInstrument.resolution = newResolutionKey;
      tradingViewStore.tradingWidget
        ?.chart()
        .setResolution(supportedResolutions[newResolutionKey], () => {
          tradingViewStore.tradingWidget?.chart().setVisibleRange({
            from: from.valueOf(),
            to: moment().valueOf(),
          });
        });
    }
    instrumentsStore.editActiveInstrument(newActiveInstrument);
  };

  return (
    <ChartTimeScaleWrapper padding="2px" alignItems="center">
      {Object.entries(supportedInterval).map(([key, value]: any) => (
        <TimeScaleItem
          isActive={value === instrumentsStore.activeInstrument?.interval}
          key={key}
          onClick={handleChangeResolution(value)}
        >
          {key}
        </TimeScaleItem>
      ))}
    </ChartTimeScaleWrapper>
  );
});

export default ChartIntervalTimeScale;

const ChartTimeScaleWrapper = styled(FlexContainer)``;

export const TimeScaleItem = styled(FlexContainer)<{ isActive?: boolean }>`
  padding: 6px 8px;
  background: ${props =>
    props.isActive &&
    `radial-gradient(
      50.44% 50% at 50.67% 100%,
      rgba(0, 255, 221, 0.08) 0%,
      rgba(0, 255, 221, 0) 100%
    ),
    rgba(255, 255, 255, 0.1)`};
  box-shadow: ${props => props.isActive && 'inset 0px -1px 0px #00ffdd'};
  border-radius: 2px 2px 0px 0px;
  text-transform: uppercase;
  color: ${props => (props.isActive ? '#fffccc' : 'rgba(255, 255, 255, 0.6)')};
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  line-height: 16px;
  transition: all 0.2s ease;
  will-change: background;

  &:hover {
    background: radial-gradient(
        50.44% 50% at 50.67% 100%,
        rgba(0, 255, 221, 0.08) 0%,
        rgba(0, 255, 221, 0) 100%
      ),
      rgba(255, 255, 255, 0.1);
    cursor: pointer;
    box-shadow: inset 0px -1px 0px #00ffdd;
  }
`;
