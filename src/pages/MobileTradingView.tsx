import React, { useState, useEffect, FC } from 'react';
import { HubConnection } from '@aspnet/signalr';
import Axios from 'axios';
import initConnection from '../services/websocketService';
import Topics from '../constants/websocketTopics';
import { FlexContainer } from '../styles/FlexContainer';
import mobileChartMessageTypes from '../constants/MobileChartMessageTypes';
import {
  LanguageCode,
  ChartingLibraryWidgetOptions,
  SeriesStyle,
  widget,
  IChartingLibraryWidget,
} from '../vendor/charting_library/charting_library.min';
import DataFeedService from '../services/dataFeedService';
import {
  supportedResolutions,
  SupportedResolutionsType,
  supportedInterval,
} from '../constants/supportedTimeScales';
import { BASIC_RESOLUTION_KEY } from '../constants/chartValues';
import { LineStyles } from '../enums/TradingViewStyles';
import moment from 'moment';
import { WS_HOST } from '../constants/vars';

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

const containerId = 'tv_chart_container';

const MobileTradingView: FC = () => {
  const [activeSession, setActiveSession] = useState<HubConnection>();
  const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget>();

  const initWidget = (activeSession: HubConnection, instrumentId: string) => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: instrumentId,
      datafeed: new DataFeedService(activeSession, instrumentId),
      interval: supportedResolutions[BASIC_RESOLUTION_KEY],
      container_id: containerId,
      library_path: CHARTING_LIBRARY_PATH,
      locale: getLanguageFromURL() || 'en',
      custom_css_url: 'custom_trading_view_styles.css',
      disabled_features: [
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
        'mainSeriesProperties.lineStyle.color': '#21B3A4',
        'mainSeriesProperties.lineStyle.linestyle': LineStyles.LINESTYLE_SOLID,
        'mainSeriesProperties.lineStyle.linewidth': 3,
        'mainSeriesProperties.lineStyle.priceSource': 'close',
        'mainSeriesProperties.areaStyle.color1': 'rgba(0, 255, 221, 0.08)',
        'mainSeriesProperties.areaStyle.color2': 'rgba(0, 255, 221, 0.08)',
        'mainSeriesProperties.areaStyle.linecolor': '#21B3A4',
        'mainSeriesProperties.areaStyle.linestyle': LineStyles.LINESTYLE_SOLID,
        'mainSeriesProperties.areaStyle.linewidth': 3,
        'mainSeriesProperties.candleStyle.upColor': '#21B3A4',
        'mainSeriesProperties.candleStyle.downColor': '#21B3A4',
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
        'paneProperties.vertGridProperties.color': 'rgba(255, 255, 255, 0.08)',
        'paneProperties.vertGridProperties.style': LineStyles.LINESTYLE_DOTTED,
        'paneProperties.horzGridProperties.color': 'rgba(255, 255, 255, 0.08)',
        'paneProperties.horzGridProperties.style': LineStyles.LINESTYLE_DOTTED,
        'paneProperties.legendProperties.showStudyArguments': false,
        'paneProperties.legendProperties.showStudyTitles': false,
        'paneProperties.legendProperties.showStudyValues': false,
        'paneProperties.legendProperties.showSeriesTitle': false,
        'paneProperties.legendProperties.showSeriesOHLC': true,
        'paneProperties.legendProperties.showLegend': false,
        'paneProperties.legendProperties.showBarChange': false,
        'paneProperties.legendProperties.showOnlyPriceSource': false,
        'linetoolnote.backgroundColor': '#ed145b',
        'scalesProperties.lineColor': 'transparent',
        'scalesProperties.textColor': 'rgba(255, 255, 255, 0.2)',
        'scalesProperties.backgroundColor': 'transparent',
        'paneProperties.background': 'rgba(0,0,0,0)',
        'mainSeriesProperties.priceLineColor': '#fff',
        'mainSeriesProperties.priceLineWidth': 2,
        'timeScale.rightOffset': 5,
      },
    };

    setTvWidget(new widget(widgetOptions));
  };

  const initWebsocketConnection = async (token: string) => {
    const connection = initConnection(WS_HOST);
    await connection.start();
    setActiveSession(connection);
    try {
      await connection.send(Topics.INIT, token);
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

    tvWidget
      ?.chart()
      .setResolution(supportedResolutions[newResolutionKey], () => {
        tvWidget?.chart().setVisibleRange({
          from: from.valueOf(),
          to: moment().valueOf(),
        });
      });
  };

  const messageHandler = (e: MessageEvent) => {
    if (!activeSession) {
      Axios.defaults.headers['Authorization'] = e.data.token;
      initWebsocketConnection(e.data.token).then(() => {
        initWidget(activeSession!, e.data.instrument);
      });
    }

    if (e.data.type) {
      switch (e.data.type) {
        case mobileChartMessageTypes.SET_CANDLE_TYPE:
          tvWidget?.chart().setChartType(e.data.message);
          break;

        case mobileChartMessageTypes.SET_INSTRUMENT:
          tvWidget?.setSymbol(e.data.instrument, e.data.interval, () => {});
          break;

        case mobileChartMessageTypes.SET_INTERVAL:
          setInterval(e.data);
          break;

        case mobileChartMessageTypes.SET_RESOLUTION:
          tvWidget?.chart().setResolution(e.data.resolution, () => {});
          break;

        default:
          break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('message', messageHandler);
    return window.removeEventListener('message', messageHandler);
  }, []);

  useEffect(() => {
    tvWidget?.onChartReady(async () => {
      //   tradingViewStore.tradingWidget = tvWidget;
    });
    return () => {
      tvWidget?.remove();
    };
  }, [tvWidget]);

  return (
    <FlexContainer height="100vh" width="100vw">
      <FlexContainer width="100%">
        {activeSession && (
          <FlexContainer width="100%" height="100%" id={containerId} />
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default MobileTradingView;
