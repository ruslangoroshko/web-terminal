import React, { useState, useEffect, FC } from 'react';
import { HubConnection } from '@aspnet/signalr';
import Axios from 'axios';
import initConnection from '../services/websocketService';
import Topics from '../constants/websocketTopics';
import { FlexContainer } from '../styles/FlexContainer';
import mobileChartMessageTypes from '../constants/MobileChartMessageTypes';
import {
  IChartingLibraryWidget, ChartingLibraryWidgetOptions, SeriesStyle, widget,
} from '../vendor/charting_library/charting_library.min';
import {
  supportedResolutions,
  SupportedResolutionsType,
  supportedInterval,
} from '../constants/supportedTimeScales';
import moment from 'moment';
import DataFeedService from '../services/dataFeedService';
import ColorsPallete from '../styles/colorPallete';
import { LineStyles } from '../enums/TradingViewStyles';
import { MobileMessageModel } from '../types/MobileTVTypes';

const containerId = 'tv_chart_container';

const MobileTradingView: FC = () => {
  const [activeSession, setActiveSession] = useState<HubConnection>();
  const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget>();

  let statusSnapshot: MobileMessageModel = {
    auth: '',
    chart_type: SeriesStyle.Area,
    instrument: 'EURUSD',
    interval: '',
    resolution: '',
    type: '',
  }

  const setStatusSnapshot = (newSnapshot: MobileMessageModel) => {
    statusSnapshot = {
      ...statusSnapshot,
      ...newSnapshot,
    };
  }
  

  let { port1, port2 } = new MessageChannel();

  const initWebsocketConnection = async (data: MobileMessageModel) => {
    const connection = initConnection(WS_HOST);
    try {
      await connection.start();
      setActiveSession(connection);
      try {
        await connection.send(Topics.INIT, data.auth);
        setStatusSnapshot(data);
        port2.postMessage(JSON.stringify(data));
      } catch (error) {
        alert(`ws connection error ${JSON.stringify(error)}`);
      }
    } catch (error) {
      alert(`error ${JSON.stringify(error)}`);
    }
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

    const resolution = supportedResolutions[newResolutionKey];

    const newSnapshot = {
      ...statusSnapshot,
      resolution,
      interval: newInterval,
    };

    console.log('resolution', resolution);

    tvWidget?.chart().setResolution(resolution, () => {
      tvWidget?.chart().setVisibleRange({
        from: from.valueOf(),
        to: moment().valueOf(),
      });
      setStatusSnapshot(newSnapshot);
      port2.postMessage(newSnapshot);

    });
  };

  const messageHandler = (event: MessageEvent) => {
    if (event.data !== 'capturePort') {
      port1.postMessage(event.data);
    } else if (event.data === 'capturePort') {
      if (event.ports[0] !== null) {
        port2 = event.ports[0];
      }
    }
  };

  const port2Handler = (e: MessageEvent) => {
    const data: MobileMessageModel = JSON.parse(e.data);
    if (!activeSession) {
      Axios.defaults.headers['Authorization'] = data.auth;
      initWebsocketConnection(data);
    } else if (data.type) {
      let newSnapshot: MobileMessageModel = {
        ...statusSnapshot,
      };
      switch (data.type) {
        case mobileChartMessageTypes.SET_CANDLE_TYPE:
          console.log('setChartType', data.chart_type);
          tvWidget?.chart().setChartType(data.chart_type);
          newSnapshot = {
            ...newSnapshot,
            chart_type: data.chart_type,
          };
          break;

        case mobileChartMessageTypes.SET_INSTRUMENT:
          console.log('setSymbol', data.instrument, data.interval);
          tvWidget?.setSymbol(data.instrument, data.interval, () => {
            newSnapshot = {
              ...newSnapshot,
              instrument: data.instrument,
            };
          });
          break;

        case mobileChartMessageTypes.SET_INTERVAL:
          setInterval(data.interval);
          break;

        case mobileChartMessageTypes.SET_RESOLUTION:
          console.log('setResolution', data.resolution);
          tvWidget?.chart().setResolution(data.resolution, () => {
            newSnapshot = {
              ...newSnapshot,
              resolution: data.resolution,
            };
          });
          
          break;

        default:
          break;
      }
      setStatusSnapshot(newSnapshot);
      port1.postMessage(newSnapshot);
    }
  };

  useEffect(() => {
    window.addEventListener('message', messageHandler, false);
    port2.addEventListener('message', port2Handler, false);
    port1.start();
    port2.start();
    console.log('PAGE IS LOADED');
    // @ts-ignore
    window.initWebsocketConnection = initWebsocketConnection;
  }, []);

  useEffect(() => {
    if (activeSession) {
      console.log('activeSession IS LOADED', JSON.stringify(statusSnapshot));

      const widgetOptions: ChartingLibraryWidgetOptions = {
        debug:true,
        symbol: statusSnapshot.instrument,
        datafeed: new DataFeedService(activeSession, statusSnapshot.instrument),
        interval: statusSnapshot.resolution,
        container_id: containerId,
        library_path: CHARTING_LIBRARY_PATH,
        locale: 'en',
        custom_css_url: 'custom_trading_view_styles.css',
        disabled_features: [
          'adaptive_logo',
          'header_widget',
          'timeframes_toolbar',
          'use_localstorage_for_settings',
          'border_around_the_chart',
          'left_toolbar',
          'symbol_info',
          'context_menus',
          'main_series_scale_menu',
        ],
        enabled_features: ['remove_library_container_border'],
        fullscreen: false,
        autosize: true,
        overrides: {
          'symbolWatermarkProperties.transparency': 90,
          'mainSeriesProperties.style': SeriesStyle.Area,
          'mainSeriesProperties.lineStyle.color': ColorsPallete.MINT,
          'mainSeriesProperties.lineStyle.linestyle':
            LineStyles.LINESTYLE_SOLID,
          'mainSeriesProperties.lineStyle.linewidth': 3,
          'mainSeriesProperties.lineStyle.priceSource': 'close',
          'mainSeriesProperties.areaStyle.color1': 'rgba(0, 255, 221, 0.08)',
          'mainSeriesProperties.areaStyle.color2': 'rgba(0, 255, 221, 0.08)',
          'mainSeriesProperties.areaStyle.linecolor': ColorsPallete.MINT,
          'mainSeriesProperties.areaStyle.linestyle':
            LineStyles.LINESTYLE_SOLID,
          'mainSeriesProperties.areaStyle.linewidth': 3,
          'mainSeriesProperties.candleStyle.upColor': '#21B3A4',
          'mainSeriesProperties.candleStyle.downColor': '#ed145b',
          'mainSeriesProperties.candleStyle.drawWick': true,
          'mainSeriesProperties.candleStyle.drawBorder': false,
          'mainSeriesProperties.candleStyle.borderColor': '#28555a',
          'mainSeriesProperties.candleStyle.borderUpColor': '#21B3A4',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ed145b',
          'mainSeriesProperties.candleStyle.wickUpColor': '#255258',
          'mainSeriesProperties.candleStyle.wickDownColor': '#622243',
          'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
          'mainSeriesProperties.areaStyle.priceSource': 'close',
          'paneProperties.axisProperties.autoScale': false,
          'paneProperties.vertGridProperties.color':
            'rgba(255, 255, 255, 0.08)',
          'paneProperties.vertGridProperties.style':
            LineStyles.LINESTYLE_DOTTED,
          'paneProperties.horzGridProperties.color':
            'rgba(255, 255, 255, 0.08)',
          'paneProperties.horzGridProperties.style':
            LineStyles.LINESTYLE_DOTTED,
          'paneProperties.legendProperties.showStudyArguments': false,
          'paneProperties.legendProperties.showStudyTitles': false,
          'paneProperties.legendProperties.showStudyValues': false,
          'paneProperties.legendProperties.showSeriesTitle': false,
          'paneProperties.legendProperties.showSeriesOHLC': true,
          'paneProperties.legendProperties.showLegend': false,
          'paneProperties.legendProperties.showBarChange': false,
          'paneProperties.legendProperties.showOnlyPriceSource': false,
          'linetoolnote.backgroundColor': ColorsPallete.RAZZMATAZZ,
          'scalesProperties.lineColor': 'transparent',
          'scalesProperties.textColor': 'rgba(255, 255, 255, 0.2)',
          'scalesProperties.backgroundColor': 'transparent',
          'paneProperties.background': 'rgba(0,0,0,0)',
          'mainSeriesProperties.priceLineColor': '#fff',
          'mainSeriesProperties.priceLineWidth': 2,
          'timeScale.rightOffset': 5,
        },
      };

      const tvWidget = new widget(widgetOptions);

      tvWidget.onChartReady(async () => {
        setTvWidget(tvWidget);
      });

      return () => {
        tvWidget.remove();
      };
    }
  }, [activeSession]);

  return (
    <FlexContainer height="100vh" width="100vw">
      <FlexContainer width="100%">
        <FlexContainer width="100%" height="100%" id={containerId} />
      </FlexContainer>
    </FlexContainer>
  );
};

export default MobileTradingView;
