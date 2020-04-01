import React, { useState, useEffect, FC } from 'react';
import { HubConnection } from '@aspnet/signalr';
import Axios from 'axios';
import initConnection from '../services/websocketService';
import Topics from '../constants/websocketTopics';
import { FlexContainer } from '../styles/FlexContainer';
import mobileChartMessageTypes from '../constants/MobileChartMessageTypes';
import {
  IChartingLibraryWidget,
} from '../vendor/charting_library/charting_library.min';
import {
  supportedResolutions,
  SupportedResolutionsType,
  supportedInterval,
} from '../constants/supportedTimeScales';
import moment from 'moment';
import MobileChartContainer from '../containers/MobileChartContainer';

const MobileTradingView: FC = () => {
  const [activeSession, setActiveSession] = useState<HubConnection>();
  const [instrumentId, setInstrumentId] = useState('');

  const initWebsocketConnection = async (
    token: string,
    instrumentId: string
  ) => {
    alert(`initWebsocketConnection ->token: ${token} instrumentId: ${instrumentId}`);
    setInstrumentId(instrumentId);
    const connection = initConnection(WS_HOST);
    try {
      await connection.start();
      setActiveSession(connection);
      try {
        alert('ws connection try');
        await connection.send(Topics.INIT, token);
        alert('ws connection success');
      } catch (error) {
        alert(`ws connection error ${JSON.stringify(error)}`);
      }
    } catch (error) {}
  };

  const setInterval = (newInterval: string) => {
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
        newResolutionKey = '1 day';
        break;

      case supportedInterval['All']:
        from = moment().subtract(1, 'y');
        newResolutionKey = '1 day';
        break;

      default:
        break;
    }

    // tvWidget
    //   ?.chart()
    //   .setResolution(supportedResolutions[newResolutionKey], () => {
    //     tvWidget?.chart().setVisibleRange({
    //       from: from.valueOf(),
    //       to: moment().valueOf(),
    //     });
    //   });
  };

  const callbackWidget = (tvWidget: IChartingLibraryWidget) => {
    alert('callback widget');
  }


  const messageHandler = (e: MessageEvent) => {
    alert(`message received  typeof ${typeof e.data}`);
    if (!activeSession) {
      Axios.defaults.headers['Authorization'] = e.data.auth;
      initWebsocketConnection(e.data.auth, e.data.instrument).then(() => {});
    }

    // if (e.data.type) {
    //   switch (e.data.type) {
    //     case mobileChartMessageTypes.SET_CANDLE_TYPE:
    //       tvWidget?.chart().setChartType(e.data.message);
    //       break;

    //     case mobileChartMessageTypes.SET_INSTRUMENT:
    //       tvWidget?.setSymbol(e.data.instrument, e.data.interval, () => {});
    //       break;

    //     case mobileChartMessageTypes.SET_INTERVAL:
    //       setInterval(e.data);
    //       break;

    //     case mobileChartMessageTypes.SET_RESOLUTION:
    //       tvWidget?.chart().setResolution(e.data.resolution, () => {});
    //       break;

    //     default:
    //       break;
    //   }
    // }
  };

  useEffect(() => {

    window.addEventListener('message', messageHandler, false);
    const { port1, port2 } = new MessageChannel();

    port1.addEventListener(
      'message',
      function(e) {
       alert(`message from port1 ${e.data}`);
      },
      false
    );

    port2.addEventListener(
      'message',
      function(e) {
        alert(`message port2 ${JSON.stringify(e.data)}`);
      },
      false
    );
    port1.start();
    port2.start();
  }, []);

  return (
    <FlexContainer height="100vh" width="100vw">
      <FlexContainer width="100%">
        {activeSession && instrumentId && (
          <MobileChartContainer
            activeSession={activeSession}
            instrumentId={instrumentId}
            callbackWidget={callbackWidget}
          />
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default MobileTradingView;
