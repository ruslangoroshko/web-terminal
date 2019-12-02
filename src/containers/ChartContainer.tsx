import React, { FC, useEffect, useContext } from 'react';

import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  widget,
} from '../vendor/charting_library/charting_library.min';
import { FlexContainer } from '../styles/FlexContainer';
import { MainAppContext } from '../store/MainAppProvider';
import DataFeedService from '../services/dataFeedService';
import { supportedResolutions } from '../constants/supportedResolutionsTimeScale';

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol'];
  interval: ChartingLibraryWidgetOptions['interval'];

  // BEWARE: no trailing slash is expected in feed URL
  library_path: ChartingLibraryWidgetOptions['library_path'];
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
  clientId: ChartingLibraryWidgetOptions['client_id'];
  userId: ChartingLibraryWidgetOptions['user_id'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
  containerId: ChartingLibraryWidgetOptions['container_id'];
}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

const containerId = 'tv_chart_container';

const defaultProps: ChartContainerProps = {
  symbol: 'Coinbase:BTC/USD',
  interval: supportedResolutions[0],
  containerId: containerId,
  library_path: CHARTING_LIBRARY_PATH,
  chartsStorageUrl: 'https://saveload.tradingview.com',
  chartsStorageApiVersion: '1.1',
  clientId: 'tradingview.com',
  userId: 'public_user_id',
  fullscreen: false,
  autosize: true,
  studiesOverrides: {},
};

interface IProps {
  intrumentId: string;
}

const ChartContainer: FC<IProps> = ({ intrumentId }) => {
  const { activeSession } = useContext(MainAppContext);
  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: defaultProps.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      // tslint:disable-next-line:no-any
      datafeed: new DataFeedService(activeSession!, intrumentId),
      interval: defaultProps.interval,
      container_id: defaultProps.containerId,
      library_path: defaultProps.library_path,
      // toolbar_bg: '#131722',
      locale: getLanguageFromURL() || 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: defaultProps.chartsStorageUrl,
      charts_storage_api_version: defaultProps.chartsStorageApiVersion,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
      overrides: {
        'mainSeriesProperties.showCountdown': true,
        'paneProperties.background': '#131722',
        'paneProperties.vertGridProperties.color': '#363c4e',
        'paneProperties.horzGridProperties.color': '#363c4e',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#AAA',
        'mainSeriesProperties.candleStyle.wickUpColor': '#336854',
        'mainSeriesProperties.candleStyle.wickDownColor': '#7f323f',
      },
    };

    let tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(async () => {
      await tvWidget.headerReady();
      const button = tvWidget.createButton();
      button.setAttribute('title', 'Click to show a notification popup');
      button.classList.add('apply-common-tooltip');
      button.addEventListener('click', () =>
        tvWidget.showNoticeDialog({
          title: 'Notification',
          body: 'TradingView Charting Library API works correctly',
          callback: () => {
            console.log('Noticed!');
          },
        })
      );
      button.innerHTML = 'Check API';
    });
    return () => {
      tvWidget.remove();
    };
  }, []);

  return (
    <FlexContainer width="100%" height="100%" id={defaultProps.containerId} />
  );
};

export default ChartContainer;